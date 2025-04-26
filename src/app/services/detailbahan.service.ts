import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { environment } from '../environments/environment.prod';
import { DetailBahan } from '../interfaces/global.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailbahanService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private globalService: GlobalService) {}

  // Function to gel user detail by id_auth
  getID(id: string): Observable<DetailBahan> {
    const headers = this.globalService.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/detilbahan/${id}/`, { headers });
  }
  // Function to gel user detail by id_auth
  getbyIdDetailProjek(id: string): Observable<DetailBahan> {
    const headers = this.globalService.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/detilbahan/searchbyipd/?id_project_detil=${id}`, { headers });
  }
  // Function to get All
  getListAll(): Observable<DetailBahan[]> {
      const headers = this.globalService.getHeaders();
      return this.http.get<DetailBahan[]>(`${this.apiUrl}/detilbahan/list/`, { headers});
  }
  // Function to get All
  getAll(search: string, page: number, pageSize: number): Observable<DetailBahan[]> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<DetailBahan[]>(`${this.apiUrl}/detilbahan/search/`, { headers, params });
  }
  create(formData: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/detilbahan/create/`, formData, { headers });
  }

  update(id: any, data: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/detilbahan/${id}/update/`, data, { headers });
  }

  deletedby(id: any, jdata:any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/detilbahan/${id}/delete/`, jdata, { headers});
  }
  //detilbahan/<int:pk>/harddelete/
  deletedbyidprojdet(id: any): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.delete(`${this.apiUrl}/detilbahan/${id}/harddelete/`, { headers});
  }
}
