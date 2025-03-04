import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { environment } from '../environments/environment.prod';
import { Projek } from '../interfaces/global.interface';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjekService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private globalService: GlobalService) {}

  // Function to gel user detail by id_auth
  getID(id: string): Observable<Projek> {
    const headers = this.globalService.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/project/${id}/`, { headers });
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
  // http://localhost:7040/api/project/retrieveby/?datefrom=2025-01-01&dateto=2025-03-30
  //http://localhost:7040/api/project/retrieveby/?status_project=2&datefrom=2025-01-01&dateto=2025-03-30
  getBetweenDate(stp:string, datefrom: string, dateto: string): Observable<Projek[]> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams()
        .set('status_project', stp)
        .set('datefrom', datefrom)
        .set('dateto', dateto);
        
    return this.http.get<Projek[]>(`${this.apiUrl}/project/retrieveby/`, { headers, params });
  }
  /*
  getStatusBetweenDate(search: string, datefrom: string, dateto: string): Observable<Projek[]> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams();
  
    // Tambahkan datefrom dan dateto jika ada
    if (datefrom) {
      params = params.set('datefrom', datefrom);
    }
    if (dateto) {
      params = params.set('dateto', dateto);
    }
    // Tambahkan status_project jika ada
    if (search) {
      params = params.set('status_project', search);
    }
  
    return this.http.get<{ results: Projek[] }>(`${this.apiUrl}/project/retrieveby/`, { headers, params })
      .pipe(
        map(response => response.results || []), // Ambil hanya results
        catchError(error => {
          console.error('Error fetching data:', error);
          return of([]); // Return array kosong jika terjadi error
        })
      );
  }
  */

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
    return this.http.put(`${this.apiUrl}/project/${id}/delete/`, jdata, { headers});
  }

}
