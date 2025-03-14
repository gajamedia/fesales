import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { environment } from '../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class PenawaranService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private globalService: GlobalService) {}
 //http://localhost:7040/api/penawaran/?id_project_header=2
  getByIdProject(id_project_header:number): Observable<any[]> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('id_project_header', id_project_header.toString());
    return this.http.get<any[]>(`${this.apiUrl}/penawaran/`, { headers, params});
  }
  

}
