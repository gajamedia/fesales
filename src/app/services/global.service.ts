import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private http: HttpClient, private router: Router, private authService:AuthService) {}
  
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('custom_token');
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('custom_token');
    if (!token) {
      console.warn('Token not found');
      return null;
    }
    
    // Use the getUidToken method from AuthService
    return this.authService.getUidToken(token);
  }
  
  isUserAuthenticated(): boolean {
    const token = localStorage.getItem('custom_token');
    if (!token) {
      return false;
    }
    
    // Use the getUidToken method to get the UID
    const uid = this.authService.getUidToken(token);
    return !!uid; // Return true if UID is valid
  }
}
