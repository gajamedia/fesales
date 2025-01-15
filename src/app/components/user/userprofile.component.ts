import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { SharedloginService } from '../../services/sharedlogin.service';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
  providers: [UserService, AuthService]
})
export class UserprofileComponent implements OnInit {
  dataUser: any[] = [];
  dataProfile: any = {};
  id: string = '';

  formData: any = {
    id_auth: '',
    username:'',
    nmlengkap: '',
    photo: '',
    photo_url: '',
    email: '',
    gender: '',
    nowa: '',
    alamat: '',
    idrole: ''

  };
  initialFormData: any = { ...this.formData };
  selectedFile: File | null = null;
  resizedFile: File | null = null;
  uploadProgress: number = 0; // Progress percentage

  constructor(
    private shareloginService: SharedloginService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isFormDirty();
    this.shareloginService.getProfileData().subscribe(data => {
      this.dataProfile = data;
      //console.log('Header received updated profile:', this.dataLogin);
      //this.cekIdKategori();
      this.initFormData()
    });
    
  }
  
  initFormData() {
    //console.log('data profil in profil user2', this.dataProfile)
    this.id = this.dataProfile.id;
    this.formData.id_auth = this.dataProfile.id_auth;
    this.formData.idrole = this.dataProfile.profilesiswa.idrole;
    this.formData.nmlengkap = this.dataProfile.profilesiswa.nmlengkap;
    this.formData.photo_url = this.dataProfile.profilesiswa.photo_url;
    this.formData.email = this.dataProfile.profilesiswa.email;
    this.formData.nowa = this.dataProfile.profilesiswa.nowa;
    this.formData.gender = this.dataProfile.profilesiswa.gender;
    this.formData.alamat = this.dataProfile.profilesiswa.alamat;
  }

  isFormDirty(): boolean {
    return JSON.stringify(this.formData) !== JSON.stringify(this.initialFormData);
  }

  onUpdate(): void {
    const formDataToSend = new FormData();
    
    // Append all form data to the FormData object
    Object.keys(this.formData).forEach(key => {
      formDataToSend.append(key, this.formData[key]);
    });
  
    if (this.resizedFile) {
      formDataToSend.append('photo', this.resizedFile, this.resizedFile.name);
    }
    // Call the update method from the userService and subscribe to its events
    this.userService.update(this.id, formDataToSend)
      .subscribe({
        next: (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              // Show upload progress
              if (this.selectedFile && event.total) {
                this.uploadProgress = Math.round((100 * event.loaded) / event.total);
              }
              break;
  
            case HttpEventType.Response:
              // Successful response
              console.log('Update Profile Successful', event.body);
              this.refreshDataLogin()
  
              // Re-initialize the form with the updated profile data
              this.initFormData(); 
  
              // Reset upload progress after completion
              this.uploadProgress = 0; 
  
              // Optionally, navigate to another route, e.g., user profile
              this.router.navigate(['/userprofile']);
              break;
  
            default:
              break;
          }
        },
        error: (err: any) => {
          console.error('Error updating profile:', err);
          // Reset progress on error
          this.uploadProgress = 0;
        },
        complete: () => {
          console.log('Update process completed.');
        }
      });
  
    // Optionally, update the initial form data to reflect current form data
    this.initialFormData = { ...this.formData };
  }
  refreshDataLogin(){

    this.authService.getUserDetails(this.formData.id_auth).subscribe({
      next:(res:any)=>{
        this.shareloginService.setProfileData(res[0])
      },
      error:(e)=>console.error(e)
    })
  }
  
  // Handle file selection and resize
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Resize the image before using it
      this.resizeImage(this.selectedFile, 300, 300).then((resizedImage) => {
        this.resizedFile = resizedImage; // Save the resized file
      });
    }
  }

  // Resize image using canvas
  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height *= maxWidth / width));
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width *= maxHeight / height));
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error('Image resize failed.'));
            }
          }, file.type);
        };
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  onEdit() {
    // Implement edit logic if necessary
  }
  getPhotoUrl(photo: string | undefined): string {
    return photo || 'default.jpg'; // Provide a default image path or URL
  }
}

