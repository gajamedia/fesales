import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PenawaranService } from '../../services/penawaran.service';
import { CommonModule } from '@angular/common';

function formatDate(dateString: string): string {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatRupiah(value: number): string {
  return value.toLocaleString('id-ID');
}

@Component({
  selector: 'app-surat-penawaran',
  standalone: true,
  templateUrl: `./penawaran.component.html`,
  styleUrls: [`./penawaran.component.scss`],
  imports:[CommonModule]
})
export class SuratPenawaranComponent implements OnInit {

  tglHariIni: string = '';
  formatRupiah = formatRupiah;
  penawaranData: any = [];
  //data
  info:any={
    cv: "TERUS JAYA ABAD",
    alamat: "Gresik Regency Blok D5, Manyar, Gresik - Jawa Timur",
    phone: "0822 3338 9489",
    email: "tjakra.abadi@gmail.com"
  }
  
  constructor(private http: HttpClient, private penawaranService: PenawaranService ) {}

  ngOnInit(): void {
    let idpr : number = 3
    this.fetchPenawaranData(idpr);
    this.tglHariIni = new Date().toISOString().split('T')[0];
  }

  fetchPenawaranData(idp: number): void {
    this.penawaranService.getByIdProject(idp).subscribe({
      next: (res: any) => {
        console.log('res penawaran', res);
        if (res.length > 0) {
          const penawaran = res[0]; // Ambil objek pertama karena response berbentuk array
  
          this.penawaranData = {
            customer: penawaran.customer,
            project: penawaran.project,
            details: penawaran.details
          };
        }
      },
      error: (err) => {
        console.error('Error fetching penawaran:', err);
      }
    });
  }
  

  printPenawaran(): void {
    this.printSection('penawaranReport');
  }

  private printSection(sectionId: string): void {
    const printContent = document.getElementById(sectionId);
    const newWindow = window.open('', '', 'width=800,height=600');
    
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('');
    
    newWindow?.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>${styles}</style> 
        </head>
        <body>${printContent?.innerHTML}</body>
      </html>
    `);
    newWindow?.document.close();
    newWindow?.print();
  }
}
