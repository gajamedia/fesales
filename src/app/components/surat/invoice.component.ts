// invoice-report.component.ts
import { Component, OnInit } from '@angular/core';
import { TerbilangPipe } from '../helpers/terbilang.pipe';  // Import pipe yang sudah dideklarasikan sebagai standalone
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-report',
  standalone: true,  // Komponen standalone
  imports: [CommonModule, FormsModule, TerbilangPipe],  // Impor pipe standalone
  templateUrl: `./invoice.component.html`,  // Template Anda
  styleUrls: [`./invoice.component.scss`]
})
export class InvoiceReportComponent implements OnInit {
  items = [
    { keterangan: 'Gorden Penyakit IGD', qty: 4, volume: 73.68, harga: 115000, total: 8473200 },
    { keterangan: 'Gorden Penyakit Resusitasi', qty: 1, volume: 12.26, harga: 115000, total: 1412200 },
    { keterangan: 'Gorden Penyakit Tindakan', qty: 1, volume: 3.08, harga: 320000, total: 985600 },
    { keterangan: 'Rel Gorden Penyakit Tindakan', qty: 2, volume: 7.33, harga: 320000, total: 2345600 },
  ];

  get total() {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  formatNumber(value: number): string {
    return value.toLocaleString('id-ID');
  }

  ngOnInit() {}

  printInvoice() {
    this.printSection('invoiceReport');
  }

  printKwitansi() {
    this.printSection('kwitansiReport');
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
