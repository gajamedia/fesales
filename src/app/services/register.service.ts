import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  register(formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post(`${this.apiUrl}/users/register/`, formData, {
      reportProgress: true,
      observe: 'events', // Observe the whole event stream, including progress
    });
  }
  
}