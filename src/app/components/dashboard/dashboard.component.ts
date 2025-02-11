import { Component } from '@angular/core';
import { Projek } from '../../interfaces/global.interface';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartRef!: ElementRef<HTMLCanvasElement>;

  selesaiCount = 3;
  dalamProsesCount = 5;
  pendingCount = 2;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.chartRef) {
        new Chart(this.chartRef.nativeElement, {
          type: 'bar',
          data: {
            labels: ['Selesai', 'Dalam Proses', 'Pending'],
            datasets: [{
              label: 'Jumlah Proyek',
              data: [this.selesaiCount, this.dalamProsesCount, this.pendingCount],
              backgroundColor: ['green', 'yellow', 'red']
            }]
          }
        });
      }
    }, 0);
  }
  projekList: Projek[] = [
    { id: 1, no_project: 'PRJ001', tgl_project: '2024-01-10', ket_project: 'Instalasi AC', nama_customer: 'PT ABC', addr_customer: 'Jakarta', contact_customer: '08123456789', status_project: 'Selesai', created_by: 'Admin', created_date: '2024-01-01', updated_by: 'Admin', updated_date: '2024-01-10', is_deleted: 0 },
    { id: 2, no_project: 'PRJ002', tgl_project: '2024-01-12', ket_project: 'Maintenance Server', nama_customer: 'PT XYZ', addr_customer: 'Bandung', contact_customer: '08129876543', status_project: 'Dalam Proses', created_by: 'Admin', created_date: '2024-01-02', updated_by: 'Admin', updated_date: '2024-01-12', is_deleted: 0 },
    { id: 3, no_project: 'PRJ003', tgl_project: '2024-02-05', ket_project: 'Pengadaan Laptop', nama_customer: 'PT Jaya', addr_customer: 'Surabaya', contact_customer: '08131234567', status_project: 'Selesai', created_by: 'Admin', created_date: '2024-01-05', updated_by: 'Admin', updated_date: '2024-02-05', is_deleted: 0 },
    { id: 4, no_project: 'PRJ004', tgl_project: '2024-02-15', ket_project: 'Pemasangan CCTV', nama_customer: 'PT Maju', addr_customer: 'Medan', contact_customer: '08132345678', status_project: 'Dalam Proses', created_by: 'Admin', created_date: '2024-01-10', updated_by: 'Admin', updated_date: '2024-02-15', is_deleted: 0 },
    { id: 5, no_project: 'PRJ005', tgl_project: '2024-03-01', ket_project: 'Upgrade Software', nama_customer: 'PT Digital', addr_customer: 'Yogyakarta', contact_customer: '08133456789', status_project: 'Pending', created_by: 'Admin', created_date: '2024-01-15', updated_by: 'Admin', updated_date: '2024-03-01', is_deleted: 0 },
    { id: 6, no_project: 'PRJ006', tgl_project: '2024-03-10', ket_project: 'Instalasi Internet', nama_customer: 'PT Net', addr_customer: 'Semarang', contact_customer: '08134567890', status_project: 'Dalam Proses', created_by: 'Admin', created_date: '2024-02-01', updated_by: 'Admin', updated_date: '2024-03-10', is_deleted: 0 },
    { id: 7, no_project: 'PRJ007', tgl_project: '2024-04-05', ket_project: 'Pemeliharaan Data Center', nama_customer: 'PT Data', addr_customer: 'Bali', contact_customer: '08135678901', status_project: 'Selesai', created_by: 'Admin', created_date: '2024-02-15', updated_by: 'Admin', updated_date: '2024-04-05', is_deleted: 0 },
    { id: 8, no_project: 'PRJ008', tgl_project: '2024-04-12', ket_project: 'Pembuatan Website', nama_customer: 'PT Web', addr_customer: 'Makassar', contact_customer: '08136789012', status_project: 'Pending', created_by: 'Admin', created_date: '2024-03-01', updated_by: 'Admin', updated_date: '2024-04-12', is_deleted: 0 },
    { id: 9, no_project: 'PRJ009', tgl_project: '2024-05-01', ket_project: 'Jaringan Baru', nama_customer: 'PT Network', addr_customer: 'Batam', contact_customer: '08137890123', status_project: 'Dalam Proses', created_by: 'Admin', created_date: '2024-03-10', updated_by: 'Admin', updated_date: '2024-05-01', is_deleted: 0 },
    { id: 10, no_project: 'PRJ010', tgl_project: '2024-05-15', ket_project: 'Pembuatan ERP', nama_customer: 'PT Software', addr_customer: 'Malang', contact_customer: '08138901234', status_project: 'Pending', created_by: 'Admin', created_date: '2024-03-20', updated_by: 'Admin', updated_date: '2024-05-15', is_deleted: 0 }
  ];
  constructor() {
    this.selesaiCount = this.projekList.filter(p => p.status_project === 'Selesai').length;
    this.dalamProsesCount = this.projekList.filter(p => p.status_project === 'Dalam Proses').length;
    this.pendingCount = this.projekList.filter(p => p.status_project === 'Pending').length;
  }
}
