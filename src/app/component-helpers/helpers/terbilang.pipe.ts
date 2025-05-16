// terbilang.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'terbilang',
  standalone: true  // Menambahkan opsi standalone: true
})
export class TerbilangPipe implements PipeTransform {
  transform(value: number): string {
    return this.terbilang(value);
  }

  private terbilang(number: number): string {
    const bilangan = [
      "Nol", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan",
      "Sepuluh", "Sebelas"
    ];

    if (number < 12) {
      return bilangan[number];
    } else if (number < 20) {
      return bilangan[number - 10] + " Belas";
    } else if (number < 100) {
      let puluhan = Math.floor(number / 10);
      let sisa = number % 10;
      return bilangan[puluhan] + " Puluh" + (sisa > 0 ? " " + bilangan[sisa] : "");
    } else if (number < 200) {
      return "Seratus" + (number > 100 ? " " + this.terbilang(number - 100) : "");
    } else if (number < 1000) {
      let ratusan = Math.floor(number / 100);
      let sisa = number % 100;
      return bilangan[ratusan] + " Ratus" + (sisa > 0 ? " " + this.terbilang(sisa) : "");
    } else if (number < 1000_000) {
      let ribuan = Math.floor(number / 1000);
      let sisa = number % 1000;
      return this.terbilang(ribuan) + " Ribu" + (sisa > 0 ? " " + this.terbilang(sisa) : "");
    } else if (number < 1_000_000_000) {
      let jutaan = Math.floor(number / 1_000_000);
      let sisa = number % 1_000_000;
      return this.terbilang(jutaan) + " Juta" + (sisa > 0 ? " " + this.terbilang(sisa) : "");
    } else if (number < 1_000_000_000_000) {
      let milyaran = Math.floor(number / 1_000_000_000);
      let sisa = number % 1_000_000_000;
      return this.terbilang(milyaran) + " Miliar" + (sisa > 0 ? " " + this.terbilang(sisa) : "");
    }

    return number.toString(); // Handle numbers larger than 1 trillion if needed
  }
}
