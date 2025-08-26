import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { environment } from '../environments/environment.prod';
import { DetailProjek } from '../interfaces/global.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailprojekService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private globalService: GlobalService) {}

  // Function to gel user detail by id_auth
  getID(id: string): Observable<DetailProjek> {
    const headers = this.globalService.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/projectdetil/${id}/`, { headers });
  }
  // Function to get All
  getListAll(): Observable<DetailProjek[]> {
      const headers = this.globalService.getHeaders();
      return this.http.get<DetailProjek[]>(`${this.apiUrl}/projectdetil/list/`, { headers});
  }
  // Function to get All
  getAll(search: string, page: number, pageSize: number): Observable<DetailProjek[]> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<DetailProjek[]>(`${this.apiUrl}/projectdetil/search/`, { headers, params });
  }
   // Function to gel user detail by id_auth
  getbyIdDetailProjek(id: string): Observable<DetailProjek> {
      const headers = this.globalService.getHeaders();
      return this.http.get<any>(`${this.apiUrl}/projectdetil/searchbyiph/?id_project_header=${id}`, { headers });
    }
  create(formData: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/projectdetil/create/`, formData, { headers });
  }

  update(id: any, data: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/projectdetil/${id}/update/`, data, { headers });
  }

  deletedby(id: any, jdata:any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/projectdetil/${id}/delete/`, jdata, { headers});
  }
  getkain(id: any,): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.get(`${this.apiUrl}/totalkainsplit/?id_project_detil=${id}`, { headers});
  }
  getvitrase(id: any,): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.get(`${this.apiUrl}/totalkainvitrase/?id_project_detil=${id}`, { headers});
  }
  // jasa pasang
  jasaPasang(params: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.get(`${this.apiUrl}/jasapasang/`, { headers, params });
  }

  kebutuhanRelnya(endpoint: string, params: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.get(`${this.apiUrl}/${endpoint}/`, { headers, params });
  }
}
