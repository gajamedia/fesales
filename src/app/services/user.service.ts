import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, private globalService: GlobalService) {}

  /*
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('custom_token');
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  */
  
  // untuk header profile
  //getUserDetails(id: string): Observable<any> {
    //const headers = this.globalService.getHeaders();
    //return this.http.get<any>(`${this.apiUrl}/users/getuserdetails/?auth_id=${id}`, { headers });
  //}

  getUserByID(id: string): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/users/getuserbyid/?auth_id=${id}`, { headers });
  }
  // Function to get All user by group or kategori siswa
  getUserByGroup(page: number, pageSize: number, idkat: number, kelas:number, search: string): Observable<any> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString()).set('idkategori', idkat.toString()).set('kelas', kelas.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(`${this.apiUrl}/users/getuserbykategori/`, { headers, params });
  }
  // Function to get All user by siswa or guru
  getSiswaOrPendidik(page: number, pageSize: number, idkat: number, search: string): Observable<any> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString()).set('idkategori', idkat.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(`${this.apiUrl}/users/getsiswaorpendidik/`, { headers, params });
  }
 
  getUserSiswaByKelas(page: number, pageSize: number, idkat: number, kelas:number, search: string): Observable<any> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString()).set('idkategori', idkat.toString()).set('kelas', kelas.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(`${this.apiUrl}/users/getsiswabykelas/`, { headers, params });
  }
  getUserDetailsById(id_auth: string): Observable<any> {
    const headers = this.globalService.getHeaders();
    const params = { id_auth };
    return this.http.get<any>(`${this.apiUrl}/users/details/`, { headers, params });
  }
  // Function to get all users
  getAllUsers(page: number, pageSize: number, search: string): Observable<any> {
    const headers = this.globalService.getHeaders();
    let params = new HttpParams().set('page', page.toString()).set('page_size', pageSize.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(`${this.apiUrl}/users/getusers/`, { headers, params });
  }
  delete(id: string): Observable<any> {
    const headers = this.globalService.getHeaders();
    return this.http.delete(`${this.apiUrl}/users/delete/`, { headers, params: { id } });
  }
  update(id_user: string, formData:FormData): Observable<HttpEvent<any>> {
    const headers = this.globalService.getHeaders();
    return this.http.put(`${this.apiUrl}/users/update/${id_user}`, formData, { headers, reportProgress: true,
      observe: 'events', // Observe the whole event stream, including progress
    });
  }
  getProfilePictureUrl(path: string): string {
    return `${environment.apiUrl}${path}`;
  }
  
}
