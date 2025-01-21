import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { environment } from '../environments/environment.prod';
import { Projek } from '../interfaces/global.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjekService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private globalService: GlobalService) {}

  // Function to gel user detail by id_auth
  getID(id: string): Observable<Projek> {
    const headers = this.globalService.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/projek/getid/?id=${id}`, { headers });
  }
  // Function to get All
  getListAll(): Observable<Projek[]> {
      const headers = this.globalService.getHeaders();
      return this.http.get<Projek[]>(`${this.apiUrl}/project/list/`, { headers});
  }
  // Function to get All
  getAll(search: string, page: number, pageSize: number): Observable<Projek[]> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Projek[]>(`${this.apiUrl}/project/search/`, { headers, params });
  }
  create(formData: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/project/create/`, formData, { headers });
  }

  update(id: any, data: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/project/${id}/update/`, data, { headers });
  }

  deletedby(id: any, jdata:any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/project/${id}/delete/`, { headers, jdata});
  }

}
