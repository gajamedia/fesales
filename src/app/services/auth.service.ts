import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environment.prod';
import { SharedloginService } from './sharedlogin.service';
import { ModalExpiredService} from './modalexpired.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private modalexpiredService: ModalExpiredService, 
    private shareloginService: SharedloginService) {}

 
  teslogin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/token/`, {username, password}).pipe(
      tap(response => {
        console.log('test respon token api', response)
        const token = response['access'];
        localStorage.setItem('custom_token', token);

      }),
      catchError(this.handleError<any>('/home'))
    );
  }
  
  getUidToken(token: string): string | null {
    
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.user_id || null; // Extract UID from token
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getUserDetails(uid: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/getuserdetails/`, {
      params: new HttpParams().set('id_auth', uid)
    }).pipe(
      catchError(this.handleError<any>(`getUserDetails uid=${uid}`))
    );
  }
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  // AuthService
  logout() {
    console.log('logout dri header di auth service')
    // Clear token from local storage
    localStorage.removeItem('custom_token');
    this.router.navigate(['/home']);
    
  }
 
  isAuthenticated(): boolean {
    const token = localStorage.getItem('custom_token');

    if (!token || this.isTokenExpired(token)) {
      console.warn('Token tidak valid atau sudah expired. Melakukan logout otomatis...');
      this.logout(); // ✅ langsung logout
      return false;
    }

    return true;
  }

  
  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const exp = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      return exp < currentTime;
    } catch (error) {
      console.error('Error decoding token', error);
      return true; // Consider token expired if there's an error
    }
  }
}