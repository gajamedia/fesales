import { Component, OnInit } from '@angular/core';
import { SharedloginService } from '../../services/sharedlogin.service';
import { Router } from '@angular/router';
import { ProjekService } from '../../services/projek.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Projek } from '../../interfaces/global.interface';
import dayjs from 'dayjs';

@Component({
  selector: 'app-projek',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [SharedloginService, AuthService],
  templateUrl: './projek.component.html',
  styleUrl: './projek.component.scss'
})
export class ProjekComponent implements OnInit{
  dataProjek: Projek []= []
  currentPage: number = 1
  totalPages!: number

  page:number=1
  dataBaris:number[] = [10, 25, 50, 100]
  selectedPageSize:number = this.dataBaris[0]
  pageSize!:number
  search=''

  tahunini:any
  tgldel:any
  deletedby:any

  dataLogin: any={}
  isRole:boolean = false

  constructor(
    private sharedloginService: SharedloginService,
    private projekService: ProjekService,
    private router: Router)

    {
      //this.typepayId = this.route.snapshot.paramMap.get('typepayId')!;
    }

  ngOnInit(): void {
    this.pageSize = this.selectedPageSize
    this.sharedloginService.getProfileData().subscribe(data => {
      this.dataLogin = data;
      //console.log('Header received updated profile:', this.dataLogin);
    
    });
  }
  onAdd(){
    this.router.navigate(['/main/inputprojek'])
  }
  handlePageChange(p:any){
    //console.log("page", p)
    this.page = p
    this.refreshList()
  }
  handleSearch(){
    
    //this.loadData()
  }
  handlePageSizeChange() {
    this.pageSize = this.selectedPageSize;
    this.page = 1;
    this.currentPage = this.page;
    //this.loadData()
  }

  handleNext() {
    if (this.currentPage < this.totalPages) {
      this.page = ++this.currentPage;
      //this.loadData()
    }
  }

  handlePrev() {
    if (this.currentPage > 1) {
      this.page = --this.currentPage;
      //this.loadData()
    }
  }

  refreshList(){
    //this.loadData();
  }

  formatSpanStatus(k: any) {
    switch (k) {
      case 0:
        return 'absolute inset-0 bg-green-200 opacity-50 rounded-full';
      case 1:
        return 'absolute inset-0 bg-yellow-200 opacity-50 rounded-full';
      case 2:
        return 'absolute inset-0 bg-blue-200 opacity-50 rounded-full';
      case 3:
        return 'absolute inset-0 bg-amber-200 opacity-50 rounded-full';
      case 4:
        return 'absolute inset-0 bg-lime-200 opacity-50 rounded-full';
      case 5:
        return 'absolute inset-0 bg-emerald-300 opacity-50 rounded-full';
      case 6:
        return 'absolute inset-0 bg-teal-200 opacity-50 rounded-full';
      default:
        return 'absolute inset-0 bg-gray-200 opacity-50 rounded-full';
    }
  }
  
  formatStatus(k: any) {
    switch (k) {
      case 0:
        return 'FU';
      case 1:
        return 'Kontrak';
      case 2:
        return 'Pengerjaan';
      case 3:
        return 'Pemasangan';
      case 4:
        return 'Pengecekan';
      case 5:
        return 'Penagihan';
      case 6:
        return 'Lunas';
      default:
        return 'none';
    }
  }
  formatTglView(tgl: any){
    const date = dayjs(tgl)
    return date.format('DD/MM/YYYY')
  }
}
