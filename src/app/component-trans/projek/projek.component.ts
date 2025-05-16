import { Component, OnInit } from '@angular/core';
import { SharedloginService } from '../../services/sharedlogin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjekService } from '../../services/projek.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Projek } from '../../interfaces/global.interface';
import dayjs from 'dayjs';
import { SharedprojekService } from '../../services/sharedprojek.service';

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

  dataLogin: any={}
  isRole:boolean = false


  constructor(
    private sharedloginService: SharedloginService,
    private projekService: ProjekService,
    private route :ActivatedRoute,
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
    
    this.loadDataProjek()
  }
  loadDataProjekByID(id:any){
    // Logic to fetch project details by id and populate form fields
    console.log('Loading project data for ID:', id);
    this.projekService.getID(id).subscribe({
      next:(res:any)=>{
        console.log('tes res from search', res)
        //this.dataProjek = res.results
      },
      error:(e:any)=>{ console.error(e)},
      complete:()=>{ console.log('complete')}
    })
  }
  loadDataProjek(){
    this.projekService.getAll(this.search, this.page, this.pageSize).subscribe({
      next:(res:any)=>{
        console.log('tes res from search', res)
        this.dataProjek = res.results
        this.totalPages = res.count
      },
      error:(e:any)=>{ console.error(e)},
      complete:()=>{ console.log('complete')}
    })
  }
  onAdd(){
    this.router.navigate(['/main/inputprojek'])
  }
  onEdit(projek: any) {
    console.log('Klik Edit, ID:', projek); // Debugging
  
    this.router.navigateByUrl(`/main/inputprojek?mode=edit&id=${projek.id}`);
  }
  
  
  onAddDetail(id: any) {
    const projectId = id || this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/main/detailprojek', projectId]);
  }
  onDeleted(id: any) {
    const projectId = id || this.route.snapshot.paramMap.get('id');
    const d = {
      'is_deleted' : 1
    }
    if (confirm('Are you sure you want to delete this project?')) {
      this.projekService.deletedby(projectId, d).subscribe({
        next: (res) => {
          console.log('Project deleted:', res);
          this.loadDataProjek(); // Refresh the list
        },
        error: (err) => console.error(err),
      });
    }
  }
  handlePageChange(p:any){
    //console.log("page", p)
    this.page = p
    this.refreshList()
  }
  handleSearch(){
    this.loadDataProjek()
  }
  handlePageSizeChange() {
    this.pageSize = this.selectedPageSize;
    this.page = 1;
    this.currentPage = this.page;
    this.loadDataProjek()
  }

  handleNext() {
    if (this.currentPage < this.totalPages) {
      this.page = ++this.currentPage;
      this.loadDataProjek()
    }
  }

  handlePrev() {
    if (this.currentPage > 1) {
      this.page = --this.currentPage;
      this.loadDataProjek()
    }
  }

  refreshList(){
    this.loadDataProjek()
  }

  formatSpanStatus(k: any) {
    switch (k) {
      case "0":
        return 'absolute inset-0 bg-green-200 opacity-50 rounded-full';
      case "1":
        return 'absolute inset-0 bg-yellow-200 opacity-50 rounded-full';
      case "2":
        return 'absolute inset-0 bg-blue-200 opacity-50 rounded-full';
      case "3":
        return 'absolute inset-0 bg-amber-200 opacity-50 rounded-full';
      case "4":
        return 'absolute inset-0 bg-lime-200 opacity-50 rounded-full';
      case "5":
        return 'absolute inset-0 bg-emerald-300 opacity-50 rounded-full';
      case "6":
        return 'absolute inset-0 bg-teal-200 opacity-50 rounded-full';
      default:
        return 'absolute inset-0 bg-gray-200 opacity-50 rounded-full';
    }
  }
  
  formatStatus(k: any) {
    switch (k) {
      case "0":
        return 'FU';
      case "1":
        return 'Kontrak';
      case "2":
        return 'Pengerjaan';
      case "3":
        return 'Pemasangan';
      case "4":
        return 'Pengecekan';
      case "5":
        return 'Penagihan';
      case "6":
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
