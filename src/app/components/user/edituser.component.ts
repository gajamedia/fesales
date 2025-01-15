import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/global.interface';
import { ShareduserService } from '../../services/shareduser.service';

@Component({
  selector: 'app-edituser',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edituser.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService, AuthService]
})
export class EdituserComponent implements OnInit, OnDestroy {
  user: any;
  dataLogin:any={}
  dataListUser: any;
  formData: User = {
    id_auth: '',
    username: '',
    nmlengkap: '',
    photo: '',
    photo_url: '',
    email: '',
    gender: '',
    nowa: '',
    alamat: '',
    idrole: 0,
  };
  id:any
  initialFormData: any = { ...this.formData  }; // clone the initial data User
  dataProfile: any = {};
  currentPage: number = 1;
  totalPages!: number;

  page: number = 1;
  dataBaris: number[] = [10, 25, 50, 100];
  selectedPageSize: number = this.dataBaris[0];
  pageSize!: number;
  search = '';

  tahunini: any;
  tgldel: any;
  deletedby: any;

  idkat!: number; // 0=None 1=Pendidik 2=Siswa 3=Staft Khusus 4=Staft Umum
  idkls!: number; // 1=1 dll
  idrole!: number; // 0=None 1=SuperAdmin 2=Admin 3=Guru 4=TU 5=Siswa 6=Satpam 7=Walisiswa
  isRole: boolean = false;
  isCollapsed: boolean = false;
  isDesktop: boolean = false;

  photoPreviewUrl: string | ArrayBuffer | null = null;

  selectedUsers: any[] = [];
  selectAll: boolean = false;
  isViewDisabled:boolean = false;
  selectedData:any[]=[]
  tmpDataQR:any[]=[]
  selectedTab: number=1;

  kelasOptions = [
    { value: 7, label: 'VII' },
    { value: 8, label: 'VIII' },
    { value: 9, label: 'IX' }
  ];
  roleOptions = [
    { value: 1, label: 'SuperAdmin' },
    { value: 2, label: 'Admin' },
    { value: 3, label: 'Staff' },
  ];
  selectedFile: File | null = null;
  resizedFile: File | null = null;
  uploadProgress: number = 0; // Progress percentage


  constructor(
    private shareduserService: ShareduserService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pageSize = this.selectedPageSize;
    this.dataListUser = this.shareduserService.getData('editUser');
    //console.log( 'tmpval2 on init', this.dataListUser)
    if (!this.dataListUser) {
      // Handle case where user is not found, maybe navigate back or show an error
    }
    this.initFormData()
  }

  ngOnDestroy() {
    this.shareduserService.clearData('editUser');
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

  initFormData(){
    this.id = this.dataListUser.id
    this.formData.id_auth = this.dataListUser.id_auth;
    this.formData.username = this.dataListUser.username;
    this.formData.nmlengkap = this.dataListUser.profilesiswa.nmlengkap;
    this.formData.email = this.dataListUser.profilesiswa.email;
    this.formData.nowa = this.dataListUser.profilesiswa.nowa;
    this.formData.gender = this.dataListUser.profilesiswa.gender;
    this.formData.alamat = this.dataListUser.profilesiswa.alamat;
    this.formData.photo_url = this.dataListUser.profilesiswa.photo_url;
    this.formData.idrole = this.dataListUser.profilesiswa.idrole;
  }

  onUpdate(): void {
    const formDataToSend = new FormData();
  
    // Explicitly cast keys to keyof User
    (Object.keys(this.formData) as (keyof User)[]).forEach((key) => {
      let value:any = this.formData[key];
      // Type check before appending to formData
      if (typeof value === 'string' || value instanceof Blob) {
        formDataToSend.append(key, value);
      } else if (typeof value === 'number') {
        formDataToSend.append(key, value.toString());
      }
    });
  
    if (this.resizedFile) {
      formDataToSend.append('photo', this.resizedFile, this.resizedFile.name);
    }
    console.log('formDataToSend', formDataToSend)
    this.userService.update(this.id, formDataToSend).subscribe({
      next: (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (this.selectedFile && event.total) {
              this.uploadProgress = Math.round((100 * event.loaded) / event.total);
            }
            break;
          case HttpEventType.Response:
            console.log('Update profile successful', event.body);
            this.router.navigate(['/user']);
            this.uploadProgress = 0; // Reset progress after upload
            break;
          default:
            break;
        }
      },
      error: (err: any) => {
        console.error('Error updating profile:', err);
      }
    });

    this.initialFormData = { ...this.formData };
  }
  
  onCancel(){
    this.router.navigate(['/user'])
  }
}
