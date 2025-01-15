import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedloginService {
  private profileSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null); // Initialized with null
  private profileKey = 'userProfile'; // Key for localStorage

  constructor() {
    // Initialize from localStorage if available
    this.initializeProfileData();
  }

  // Initialize profile data from localStorage
  initializeProfileData(): void {
    const savedProfile = localStorage.getItem(this.profileKey);
    if (savedProfile) {
      this.profileSubject.next(JSON.parse(savedProfile)); // Load data from localStorage
    }
  }

  // Set profile data (both in BehaviorSubject and localStorage)
  setProfileData(data: any): void {
    this.profileSubject.next(data); // Update the BehaviorSubject
    localStorage.setItem(this.profileKey, JSON.stringify(data)); // Save to localStorage
  }

  // Get profile data as an observable
  getProfileData(): Observable<any> {
    return this.profileSubject.asObservable();
  }

  // Clear profile data
  clearProfileData(): void {
    this.profileSubject.next(null); // Clear the BehaviorSubject
    localStorage.removeItem(this.profileKey); // Clear localStorage
  }
}
