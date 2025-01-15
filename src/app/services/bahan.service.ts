import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { environment } from '../environments/environment.prod';
import { Bahan } from '../interfaces/global.interface';

@Injectable({
  providedIn: 'root'
})
export class BahanService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private globalService: GlobalService) {}

  // Function to gel user detail by id_auth
  getID(id: string): Observable<Bahan> {
    const headers = this.globalService.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/bahan/getid/?id=${id}`, { headers });
  }
  // Function to get All user by group or kategori
  getAll(page: number, pageSize: number, search: string): Observable<Bahan[]> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Bahan[]>(`${this.apiUrl}/bahan/getall/`, { headers, params });
  }
  create(formData: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/bahan/create/`, formData, { headers });
  }

  update(id: any, data: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/bahan/update/${id}`, data, { headers });
  }

  deletedby(id: any, jdata:any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/bahan/delete/${id}`, { headers, jdata});
  }

  delete(id: string): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.delete(`${this.apiUrl}/bahan/delete/`, { headers, params: { id } });
  }

}
