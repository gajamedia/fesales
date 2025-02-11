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
    return this.http.get<any>(`${this.apiUrl}/bahan/${id}/`, { headers });
  }
  // Function to get All
  getListAll(): Observable<Bahan[]> {
    const headers = this.globalService.getHeaders();
    return this.http.get<Bahan[]>(`${this.apiUrl}/bahan/list/`, { headers});
  }
  getAll(search: string, page: number, pageSize: number): Observable<Bahan[]> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Bahan[]>(`${this.apiUrl}/bahan/search/`, { headers, params });
  }
  create(formData: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/bahan/create/`, formData, { headers });
  }

  update(id: any, data: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/bahan/${id}/update/`, data, { headers });
  }

  deletedby(id: any, data: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/bahan/${id}/delete/`, data, { headers});
  }


}
