import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  email!: string;
  password!: string;
  nmlengkap!: string;
  photo!: File;
  idkat!: number;
  idrole!: number;
  idauth!: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('RegisterComponent initialized');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photo = input.files[0];
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('nmlengkap', this.nmlengkap);
    if (this.photo) {
      formData.append('photo', this.photo);
    }
    formData.append('idkat', this.idkat.toString());
    formData.append('idrole', this.idrole.toString());
    formData.append('idauth', this.idauth);

    this.http.post('http://localhost:8000/api/register/', formData)
      .subscribe({
        next: (response) => {
        console.log('User registered:', response);
      }, error: error => {
        console.error('Error registering user:', error);
      }
    })
  }
}
