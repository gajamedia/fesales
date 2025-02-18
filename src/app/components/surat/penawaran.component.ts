import { Component } from '@angular/core';

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
  styleUrls: [`./penawaran.component.scss`]
})
export class SuratPenawaranComponent {
  formattedDate = formatDate('2025-02-15');
  formatRupiah = formatRupiah;

  // Method to handle print functionality
  printPenawaran() {
    this.printSection('penawaranReport');
  }

  private printSection(sectionId: string) {
    const printContent = document.getElementById(sectionId);
    const newWindow = window.open('', '', 'width=800,height=600');
    
    // Ambil semua link CSS dan style dari halaman utama
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