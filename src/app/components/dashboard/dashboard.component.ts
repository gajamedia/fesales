import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProjekService } from '../../services/projek.service';
import { Projek } from '../../interfaces/global.interface';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { InvoiceReportComponent } from '../surat/invoice.component';
import { SuratPenawaranComponent } from '../surat/penawaran.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, InvoiceReportComponent, SuratPenawaranComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartRef!: ElementRef<HTMLCanvasElement>;

  statusCounts: { [key: string]: number } = {};
  chartInstance: Chart | null = null;
  projekList: Projek[] = [];
  countProject?:number
  
  constructor(private projekService: ProjekService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDataProjek();
  }

  loadDataProjek() {
    const startTime = performance.now();
    this.projekService.getAll('', 1, 100).pipe(debounceTime(300)).subscribe({
      next: (res: any) => {
        const endTime = performance.now();
        console.log(`API response time: ${endTime - startTime} ms`);
        console.log('res dashboard project', res.results);

        this.projekList = res.results;
        this.countProject = res.count
        console.log('res dashboard count', this.countProject);
        this.cdr.detectChanges(); // Paksa update tampilan
        this.updateStatusCounts(this.projekList);
        setTimeout(() => this.updateChart(), 100);
      },
      error: (e) => console.error('Error fetching project data:', e),
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateChart(), 0);
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    switch (status) {
      case "0": return 'FU';
      case "1": return 'Kontrak';
      case "2": return 'Pengerjaan';
      case "3": return 'Pemasangan';
      case "4": return 'Pengecekan';
      case "5": return 'Penagihan';
      case "6": return 'Lunas';
      default: return 'Unknown';
    }
  }

  getStatusColor(status: string) {
    const statusMap: { [key: string]: string } = {
      'FU': 'bg-blue-500',
      'Kontrak': 'bg-green-500',
      'Pengerjaan': 'bg-yellow-500',
      'Pemasangan': 'bg-orange-500',
      'Pengecekan': 'bg-teal-500',
      'Penagihan': 'bg-purple-500',
      'Lunas': 'bg-red-500',
    };
    return statusMap[status] || 'bg-gray-500';
  }
    
  updateStatusCounts(projekList: Projek[]) {
    // Reset statusCounts
    this.statusCounts = {
      FU: 0, Kontrak: 0, Pengerjaan: 0, Pemasangan: 0, 
      Pengecekan: 0, Penagihan: 0, Lunas: 0
    };
  
    // Loop untuk menghitung jumlah berdasarkan status
    projekList.forEach(p => {
      const status = this.getStatusLabel(p.status_project); // Get status label from status_project
      if (status in this.statusCounts) {
        this.statusCounts[status]++; // Increment the count for the correct status
      }
    });
  
    console.log('Updated statusCounts:', this.statusCounts);
    this.updateChart(); // Update chart if needed
  }

  updateChart() {
    console.log('res dashboard count di chart ', this.countProject);
    if (!this.chartRef) return;
  
    const labels = Object.keys(this.statusCounts);
    const data = Object.values(this.statusCounts);
  
    const backgroundColors = [
      '#3b82f6', '#22c55e', '#facc15', '#fb923c', '#14b8a6', '#a855f7', '#ef4444'
    ];
  
    if (!this.chartInstance) {
      this.chartInstance = new Chart(this.chartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Jumlah Proyek',
            data: data,
            backgroundColor: backgroundColors
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                stepSize: 1,   // Ensures whole numbers on the y-axis
              },
              min: 0,          // Start the y-axis from 0
            }
          }
        }
      });
    } else {
      this.chartInstance.data.labels = labels;
      this.chartInstance.data.datasets[0].data = data;
      this.chartInstance.data.datasets[0].label = 'Jumlah Proyek';
      this.chartInstance.update();
    }
  }
  
  
  
}
