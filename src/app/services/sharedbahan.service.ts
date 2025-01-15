import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedbahanService {
  private data: any = {};

  setData(key: string, value: any) {
    this.data[key] = value;
  }

  getData(key: string) {
    return this.data[key];
  }

  clearData(key: string) {
    delete this.data[key];
  }
}
