import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingStateService {
  // Default the BehaviorSubject to `false` (not loading) initially
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observable for loading state
  isLoading$ = this.loadingSubject.asObservable();

  // Set loading state
  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }
}
