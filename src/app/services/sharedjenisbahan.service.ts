import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedjenisbahanService {
  private data: any = {};

  setData(key: string, value: any) {
    this.data[key] = value;
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  getData(key: string) {
    if (!this.data[key]) {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        this.data[key] = JSON.parse(storedValue);
      }
    }
    return this.data[key];
  }
  
  clearData(key: string) {
    delete this.data[key];
    localStorage.removeItem(key);
  }
  
}
