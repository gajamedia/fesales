import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SharedloginService } from './services/sharedlogin.service';
import { Observable, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const shareloginService = inject(SharedloginService);

  // Ensure the user is authenticated
  if (!authService.isAuthenticated()) {
    console.log('User not authenticated. Redirecting to login.');
    router.navigate(['/login']);
    return of(false); // Block navigation
  }
  shareloginService.initializeProfileData();
  // Check for profile data using BehaviorSubject
  return shareloginService.getProfileData().pipe(
    take(1), // Take the first emitted value and complete the observable
    map((userProfile: any) => {
      console.log('Received Profile Data:', userProfile); // Log profile data
      if (!userProfile || !userProfile.idrole) {
        console.log('No profile data or idrole found. Redirecting to login.');
        
        //router.navigate(['/login']);
        return false; // Block navigation
      }

      const userRole = userProfile.idrole;
      const allowedRoles = route.data['allowedRoles'] || [];

      console.log('User Role:', userRole);
      console.log('Allowed Roles for this route:', allowedRoles);

      if (allowedRoles.includes(userRole)) {
        console.log('User role is allowed. Navigation permitted.');
        return true; // Allow navigation
      } else {
        console.log('User role is not allowed. Redirecting to forbidden.');
        router.navigate(['/forbidden']);
        return false; // Block navigation
      }
    }),
    catchError((error) => {
      console.error('Error fetching user profile:', error);
      router.navigate(['/login']); // Redirect to login on error
      return of(false); // Block navigation
    })
  );
};
