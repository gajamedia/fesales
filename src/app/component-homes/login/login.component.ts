// login.component.ts
import { Component, Inject, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingStateService } from '../../services/loading-state.service';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from '../../services/global.service';
import { SharedloginService } from '../../services/sharedlogin.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AuthService, LoadingStateService]
})
export class LoginComponent implements OnInit {
  @ViewChild('passwordInput') passwordInputRef!: ElementRef;
  @ViewChild('loginButton') loginButtonRef!: ElementRef;
  @ViewChild('usernameInput') usernameInputRef!: ElementRef;
  @Output() switchToRegister = new EventEmitter<void>();

  
  categorySelected: boolean = false;
  dataProfile: any = {};
  passwordFieldType: 'password' | 'text' = 'password';
  isPasswordVisible: boolean = false;
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(
    public loadingStateService: LoadingStateService,
    private shareloginService: SharedloginService,
    @Inject(AuthService) private authService: AuthService,
    private globalService: GlobalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shareloginService.clearProfileData()
    setTimeout(() => {
      this.usernameInputRef.nativeElement.focus();
    }, 200);
  }
  onSwitch() {
    this.switchToRegister.emit();
  }
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLoginSubmit(): void {
    this.loadingStateService.setLoading(true);
    this.authService.teslogin(this.username, this.password).subscribe({
      next: (res: any) => {
        this.loadingStateService.setLoading(false);
        this.router.navigate(['/main/dashboard']);

      },
      error: (err: any) => {
        this.loadingStateService.setLoading(false);
        const errorMessage = err.error?.message;
          if (errorMessage === 'Akun Anda tidak/ belum aktif. Silakan hubungi admin.') {
            alert(errorMessage); // ❌ Khusus untuk is_active = 0
          } else {
            alert('Login gagal. Cek Username dan Password anda dan coba lagi.'); // ❌ Untuk username/password salah
          }
        console.error('❌ Login error:', err);
      }
    });
  }

  showError(message: string): void {
    alert(message);
  }

  focusNextField(nextFieldRef: ElementRef): void {
    setTimeout(() => {
      nextFieldRef.nativeElement.focus();
    }, 200);
  }

  onEnterKey(event: Event, nextInput?: HTMLElement) {
    const ke = event as KeyboardEvent;
    if (ke.key === 'Enter') {
      ke.preventDefault();
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
}
