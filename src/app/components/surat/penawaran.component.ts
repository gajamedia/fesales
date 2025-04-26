import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PenawaranService } from '../../services/penawaran.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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

  //data
  info:any={
    cv: "TERUS JAYA ABADI",
    alamat: "Gresik Regency Blok D5, Manyar, Gresik - Jawa Timur",
    phone: "0822 3338 9489",
    email: "tjakra.abadi@gmail.com"
  }
  penawaranData: any = {
    customer: {},
    project: {},
    details: []
  };

  
  constructor(private http: HttpClient, private penawaranService: PenawaranService, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log('Params:', params.keys, params.get('id')); // Debugging
  
      const idpr = Number(params.get('id')); // Konversi ke number
      console.log('Project ID dari URL:', idpr); // Cek hasilnya
  
      if (!isNaN(idpr) && idpr > 0) {
        this.fetchPenawaranData(idpr);
      }
    });
  
    this.tglHariIni = new Date().toISOString().split('T')[0];
  }
  

  fetchPenawaranData(idp: number): void {
    console.log('res penawaran', idp);
    this.penawaranService.getByIdProject(idp).subscribe({
      next: (res: any) => {
        console.log('res penawaran', res[0]); // Log response untuk cek struktur data
        if (res?.length) { 
          this.penawaranData = {
            customer: res[0]?.customer || {},
            project: res[0]?.project || {},
            details: res[0]?.details?.map((d: any) => ({
              ...d,
              items: d.items || [] // Pastikan items selalu berupa array
            })) || []
          };
        }
      },
      error: (err) => console.error('Error fetching penawaran:', err)
    });
  }
  

  printPenawaran(): void {
    const printContent = document.getElementById('penawaranReport')?.innerHTML;
    if (!printContent) return;
    
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    location.reload(); // Refresh agar kembali normal setelah print
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
