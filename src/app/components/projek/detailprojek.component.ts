import { Component, OnInit } from '@angular/core';
import { SharedloginService } from '../../services/sharedlogin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjekService } from '../../services/projek.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DetailProjek, Projek } from '../../interfaces/global.interface';
import dayjs from 'dayjs';
import { DetailprojekService } from '../../services/detailprojek.service';

@Component({
  selector: 'app-detailprojek',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [SharedloginService, AuthService],
  templateUrl: './detailprojek.component.html',
  styleUrl: './projek.component.scss'
})
export class DetailprojekComponent implements OnInit{
  dataProjek: any
  dataDetailProjek: DetailProjek []= []

  currentPage: number = 1
  totalPages!: number

  page:number=1
  dataBaris:number[] = [10, 25, 50, 100]
  selectedPageSize:number = this.dataBaris[0]
  pageSize!:number
  search=''

  dataLogin: any={}
  isRole:boolean = false

  inputDetailProjek: DetailProjek = {
    id: 0,
    id_project_header:0,
    lebar_bahan:0,
    lantai:"",
    ruangan:"",
    bed:"",
    tipe:"",
    uk_room_l:0,
    uk_room_p:0,
    uk_room_t:0,
    stik:0,
    elevasi:0,
    tinggi_vitrase:0,
    tinggi_lipatan:0,
    nilai_pembagi:0,
    created_by: "",
    created_date: "",
    updated_by: "",
    updated_date: "",
    is_deleted: 0,
  }
  projectId: string | null = null;
  constructor(
    private sharedloginService: SharedloginService,
    private projekService: ProjekService,
    private detailprojekService: DetailprojekService,
    private route: ActivatedRoute,
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
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.loadDataProjekBy(this.projectId);
      this.loadDataDetailProjek(this.projectId)
    }
  
  }
  loadDataProjekBy(id:any){
    this.projekService.getID(id).subscribe({
      next:(res:any)=>{
        console.log('tes res by ID', JSON.stringify(res))
        this.dataProjek = res
      },
      error:(e:any)=>{ console.error(e)},
      complete:()=>{ console.log('complete')}
    })
  }
  loadDataDetailProjek(id:any){
    this.search = id

    this.detailprojekService.getAll(this.search, this.page, this.pageSize).subscribe({
      next:(res:any)=>{
        console.log('tes res from search', res)
        this.dataDetailProjek = res.results
        this.totalPages = res.count
      },
      error:(e:any)=>{ console.error(e)},
      complete:()=>{ console.log('complete')}
    })
  }
  onAdd(){
    this.router.navigate(['/main/inputprojek'])
  }
  onEdit(id:any){

  }
  onDeleted(id:any){

  }
  formatTglView(tgl: any){
    const date = dayjs(tgl)
    return date.format('DD/MM/YYYY')
  }
}
