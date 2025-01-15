
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { LoadingComponent } from '../loading/loading.component';
import { GlobalService } from '../../services/global.service';
import { LoadingStateService } from '../../services/loading-state.service';
import { SharedloginService } from '../../services/sharedlogin.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  providers: [SharedloginService, UserService, AuthService, LoadingStateService]
})

export class LoginComponent implements OnInit {
  login = { username: '', password: '' };
  categorySelected: boolean = false; // Track if a category is selected
  dataProfile:any={}
  passwordFieldType: 'password' | 'text' = 'password';
  isPasswordVisible: boolean = false;

  constructor(
    private shareloginService: SharedloginService,
    public loadingStateService: LoadingStateService,
    private authService:AuthService,
    private userService:UserService,
    private globalService: GlobalService,
    private router:Router) {}

  ngOnInit(): void {
    //console.log('AuthComponent initialized');
    // You can add initialization logic here
    this.shareloginService.clearProfileData()
  }


  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  
  onLoginSubmit(): void {
    // Set loading to true when login starts
    this.loadingStateService.setLoading(true);

    // Prepare the form data
    const formData = new FormData();
    formData.append('username', this.login.username);
    formData.append('password', this.login.password);

    // Call the login API
    this.authService.teslogin(formData)
    .subscribe({
      next: (response: any) => {
        console.log('Login successful undefined:', response);
        // Load profile data after successful login
        // Hide loading spinner
        this.loadingStateService.setLoading(false);
      },
      error: (error) => {
        console.error('Error during login:', error);
        // Hide loading spinner
        this.loadingStateService.setLoading(false);
        // Optionally, provide feedback to the user (e.g., display an error message)
        this.showError('Login failed. Please try again.');
      }
    });
  }
  // tampung data detail user untuk digunakan di user profile
  loadDataLogin(): void {

  }

  showError(message: string): void {
    // Implement a method to show error messages to the user
    alert(message); // Replace with your own error display mechanism
  }

  
}


