import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { JenisbahanService } from '../../services/jenisbahan.service';
import { SharedloginService } from '../../services/sharedlogin.service';
import { Jenisbahan } from '../../interfaces/global.interface';
import { SharedjenisbahanService } from '../../services/sharedjenisbahan.service';


@Component({
  selector: 'app-jenisbahan',
  standalone:true,
  templateUrl: './jenisbahan.component.html',
  styleUrls: ['./jenisbahan.component.scss'],
  imports: [CommonModule, FormsModule],
  providers: [SharedloginService, JenisbahanService]
})
export class JenisbahanComponent implements OnInit {
  dataJenisbahan: Jenisbahan[] = [];
  currentPage: number = 1;
  totalPages!: number;

  page: number = 1;
  dataBaris: number[] = [10, 25, 50, 100];
  selectedPageSize: number = this.dataBaris[0];
  pageSize!: number;
  search = '';


  tahunini:any
  tgldel:any
  deletedby:any

  isDesktop: boolean = false;
  dataLogin: any={}
  isRole:boolean = false
  isCollapsed:boolean = false

  constructor(
    private jenisbahanService:JenisbahanService, 
    private sharedloginService: SharedloginService,
    private sharedjenisbahanService: SharedjenisbahanService, 
    private router:Router)
  {
    //this.tmp = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    
    this.pageSize = this.selectedPageSize
    this.currentDateTime();
    this.loadData()
    this.sharedloginService.getProfileData().subscribe(data => {
      this.dataLogin = data;
      //console.log('Header received updated profile:', this.dataLogin);
      //this.cekIdKategori();
    });

  }
  
  currentDateTime() {
    const current = new Date();
    const date = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
    const time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    const dateTime = date +' '+ time;
 
    this.tahunini = current.getFullYear()
    this.tgldel = dateTime

    return dateTime;
  }
  loadData() {
    //this.jenisbahanService.getAll(this.page, this.pageSize, this.search)
    this.jenisbahanService.getAll()
    .subscribe({
      next:(res:any) => {
        console.log('response', res);
        this.dataJenisbahan = res
        console.log('response this.dataJenisbahan', this.dataJenisbahan);
        //this.totalPages = res.count
         //this.count = res.count
        /*
        this.totalPages = Math.ceil(this.count / this.pageSize);
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedData = this.dataJenisbahan.slice(start, end);
        */
      },
      error:(e:any) => {
        console.log(e);
      },
    });  
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  onAdd(){
    this.router.navigate(['/main/inputjenisbahan'])
  }
  onEdit(id: any) {
    // Fetch the user data based on the id
    const jns = this.dataJenisbahan.find(u => u.id === id);
    if (jns) {
      this.sharedjenisbahanService.setData('editJenisbahan', jns);
      this.router.navigate(['/main/inputjenisbahan']);
    }
  }
  onDeletedby(r: any) {
    const d={
      tgldel:this.tgldel,
      deletedby:this.deletedby
    }
    this.jenisbahanService.deletedby(JSON.stringify(r), d)
    .subscribe({
      next:(res:any) => {
        //console.log(res);
        this.loadData();
        this.router.navigate(['/main/jenisbahan'])
      },
      error:(e:any) => {
        console.log(e);
      },
    });
  }
  onDelete(r: any) {
    this.jenisbahanService.delete(r)
    .subscribe({
      next:(res:any) => {
        //console.log(res);
        this.loadData();
        this.router.navigate(['/main/jenisbahan'])
      },
      error:(e:any) => {
        console.log(e);
      },
    });
  }
  handlePageChange(p:any){
    //console.log("page", p)
    this.page = p
    this.refreshList()
  }
  handleSearch(){
    this.loadData()
  }
  handlePageSizeChange() {
    this.pageSize = this.selectedPageSize;
    this.page = 1;
    this.currentPage = this.page;
    this.loadData()
  }

  handleNext() {
    if (this.currentPage < this.totalPages) {
      this.page = ++this.currentPage;
      this.loadData()
    }
  }

  handlePrev() {
    if (this.currentPage > 1) {
      this.page = --this.currentPage;
      this.loadData()
    }
  }

  refreshList(){
    this.loadData();
  }

    
}
