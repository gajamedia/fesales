import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedloginService } from '../../services/sharedlogin.service';
import { BahanService } from '../../services/bahan.service';
import dayjs from 'dayjs';
import { Bahan } from '../../interfaces/global.interface';
import { Router } from '@angular/router';
import { SharedbahanService } from '../../services/sharedbahan.service';
import { ThousandSeparatorPipe } from '../helpers/thousand-separator.pipe';

@Component({
  selector: 'app-bahan',
  standalone: true,
  imports: [CommonModule, FormsModule, ThousandSeparatorPipe],
  providers: [SharedloginService, BahanService],
  templateUrl: './bahan.component.html',
  styleUrl: './bahan.component.scss'
})
export class BahanComponent implements OnInit{
  dataBahan: Bahan[] = [];
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

  dataLogin: any={}
  isRole:boolean = false


  constructor(
    private bahanService:BahanService, 
    private sharedloginService: SharedloginService,
    private sharedbahanService: SharedbahanService, 
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
    //this.bahanService.getAll(this.page, this.pageSize, this.search)
    this.bahanService.getAll(this.search, this.page, this.pageSize)
    .subscribe({
      next:(res:any) => {
        console.log('response', res);
        this.dataBahan = res.results
        console.log('response this.dataBahan', this.dataBahan);
        this.totalPages = res.count
         //this.count = res.count
        /*
        this.totalPages = Math.ceil(this.count / this.pageSize);
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedData = this.dataBahan.slice(start, end);
        */
      },
      error:(e:any) => {
        console.log(e);
      },
    });  
  }

  onAdd(){
    this.router.navigate(['/main/inputbahan'])
  }
  onEdit(id: any) {
    // Fetch the user data based on the id
    const bhn = this.dataBahan.find(u => u.id === id);
    if (bhn) {
      this.sharedbahanService.setData('editBahan', bhn);
      this.router.navigate(['/main/inputbahan']);
    }
  }
  onDeletedby(r: any) {
    const d={
      
      'is_deleted':1
    }
    this.bahanService.deletedby(r, d)
    .subscribe({
      next:(res:any) => {
        console.log(res);
        this.loadData();
        this.router.navigate(['/main/bahan'])
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
