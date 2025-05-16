import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements AfterViewInit {
  @Output() switchToLogin = new EventEmitter<void>();
  @ViewChild('fullnameInput') fullnameInputRef!: ElementRef;

  private apiUrl = `${environment.apiUrl}`;
  
  registerForm: FormGroup;
  showPassword = false;
  selectedAvatar: File | null = null;
  uploadProgress: number = 0;
  passwordFieldType: 'password' | 'text' = 'password';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group(
      {
        fullname: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        avatar: [null],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.fullnameInputRef?.nativeElement.focus();
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.selectedAvatar = file;
      this.registerForm.patchValue({ avatar: file });
    }
  }

  onSwitch() {
    this.switchToLogin.emit();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('username', this.registerForm.value.username);
    formData.append('email', this.registerForm.value.email);
    formData.append('password', this.registerForm.value.password);
    formData.append('fullname', this.registerForm.value.fullname);
    if (this.selectedAvatar) {
      formData.append('avatar', this.selectedAvatar);
    }

    this.http.post(`${this.apiUrl}/auth/register`, formData, {
      reportProgress: true,
      observe: 'events',
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        this.uploadProgress = Math.round((event.loaded / event.total) * 100);
      }

      if (event.type === HttpEventType.Response) {
        alert('Registrasi berhasil!');
        this.router.navigate(['/main/home']);
        this.registerForm.reset();
        this.uploadProgress = 0;
      }
    });
  }

  focusNextField(nextFieldRef: ElementRef): void {
    setTimeout(() => {
      nextFieldRef.nativeElement.focus();
    }, 200);
  }

  onEnterKey(event: Event, nextInput?: HTMLElement): void {
    const ke = event as KeyboardEvent;
    if (ke.key === 'Enter') {
      ke.preventDefault();
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
}
