import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { environment } from '../environments/environment.prod';
import { Jenisbahan } from '../interfaces/global.interface';

@Injectable({
  providedIn: 'root'
})
export class JenisbahanService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private globalService: GlobalService) {}

  // Function to gel user detail by id_auth
  getID(id: string): Observable<Jenisbahan> {
    const headers = this.globalService.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/jenisbahan/getid/?id=${id}`, { headers });
  }
  // Function to get All
  getAll(): Observable<Jenisbahan[]> {
    const headers = this.globalService.getHeaders();
    return this.http.get<Jenisbahan[]>(`${this.apiUrl}/jenisbahan/list/`, { headers});
  }
  /*
  getAll(page: number, pageSize: number, search: string): Observable<Jenisbahan[]> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Jenisbahan[]>(`${this.apiUrl}/jenisbahan/getall/`, { headers, params });
  }
  */

  create(formData: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/jenisbahan/create/`, formData, { headers });
  }

  update(id: any, data: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/jenisbahan/update/${id}`, data, { headers });
  }

  deletedby(id: any, jdata:any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/jenisbahan/delete/${id}`, { headers, jdata});
  }

  delete(id: string): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.delete(`${this.apiUrl}/jenisbahan/delete/`, { headers, params: { id } });
  }

}
