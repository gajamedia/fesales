import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/global.interface';
import { SharedloginService } from '../../services/sharedlogin.service';
import { ShareduserService } from '../../services/shareduser.service';



@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService, AuthService]
})
export class UserComponent implements OnInit {
  dataLogin:any={}
  dataListUser: any[] = [];
  dataUser: User = {
    id_auth: '',
    username: '',
    nmlengkap: '',
    photo: '',
    photo_url: '',
    email: '',
    idrole: 0,
    alamat: ''
  };
  initialFormData: any = { ...this.dataUser }; // clone the initial data User
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

  idrole!: number; // 0=None 1=SuperAdmin 2=Admin 3=staff
  isRole: boolean = false;

  photoPreviewUrl: string | ArrayBuffer | null = null;

  selectedUsers: any[] = [];
  selectAll: boolean = false;
  isViewDisabled:boolean = false;
  selectedData:any[]=[]
  tmpDataQR:any[]=[]

  constructor(
    private shareloginService: SharedloginService,
    private shareduserService: ShareduserService,
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    
   
    this.pageSize = this.selectedPageSize;
    this.shareloginService.getProfileData().subscribe((data:any) => {
      this.dataLogin = data;
    });
    this.cekIdRole
  }
  

  cekIdRole() {
    this.isRole = [1, 2].includes(this.dataLogin.idrole) ? true : false;
    this.loadUser(); // list 1: superadmin, 2 admin, 3 staff

  }

  loadUser() {
    this.userService.getAllUsers(this.page, this.pageSize, this.search).subscribe({
      next: (user: any) => {
        console.log('data', user);
        this.dataListUser = user.results;
        this.totalPages = user.count;
      },
    });
  }

  handlePageChange(p: any) {
    this.page = p;
    this.loadUser()
  }

  handleSearch() {
    this.loadUser()
  }

  handlePageSizeChange() {
    this.pageSize = this.selectedPageSize;
    this.page = 1;
    this.currentPage = this.page;
    this.loadUser()
  }

  handleNext() {
    if (this.currentPage < this.totalPages) {
      this.page = ++this.currentPage;
      this.loadUser()
    }
  }

  handlePrev() {
    if (this.currentPage > 1) {
      this.page = --this.currentPage;
      this.loadUser()
    }
  }

  onEdit(id: any) {
    // Fetch the user data based on the id
    const user = this.dataListUser.find(u => u.id === id);
    if (user) {
      this.shareduserService.setData('editUser', user);
      this.router.navigate(['/edituser']);
    }
  }


  formatStUser(k: number) {
    return k === 0 ? 'Inactive' : 'Active';
  }

  formatIDRole(r: number): string {
    switch (r) {
      case 1:
        return 'SuperAdmin';
      case 2:
        return 'Admin';
      case 3:
        return 'Staff';
      default:
        return 'None';
    }
  }

  formatSpanIDRole(k: number): string {
    const styles: { [key: number]: string } = {
      1: 'absolute inset-0 bg-green-200 opacity-50 rounded-full',
      2: 'absolute inset-0 bg-yellow-200 opacity-50 rounded-full',
      3: 'absolute inset-0 bg-blue-200 opacity-50 rounded-full',
      4: 'absolute inset-0 bg-gray-200 opacity-50 rounded-full',
      
    };
    return styles[k] || 'absolute inset-0 bg-black-200 opacity-50 rounded-full';
  }

  getPhoto(user: any): string {
    return user.photo_url; // Return
  }

}
