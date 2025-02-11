import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedloginService } from '../../services/sharedlogin.service';
import { DetailprojekService } from '../../services/detailprojek.service';
import { ProjekService } from '../../services/projek.service';
import { ShareddetailbahanService } from '../../services/shareddetailbahan.service';
import { DetailbahanService } from '../../services/detailbahan.service';
import { DetailprojekComponent } from './detailprojek.component';




@Component({
  selector: 'app-modaldetailbahan',
  standalone: true,
  imports: [CommonModule, FormsModule, DetailprojekComponent],
  templateUrl: './modaldetailbahan.component.html',
  providers: [SharedloginService, DetailprojekService, ProjekService, DetailbahanService]
})
export class ModaldetailbahanComponent implements OnInit{
  @Output() closeModal = new EventEmitter<void>();
  @Input() dataDetailBahan: any;
  //@Input() dataDetailProjek: any

  dataLogin:any={}
  inputDetailBahan = {
    id_project_detil: 0,
    item_id : 0,
    item_code:0,
    item_name:"",
    ukuran:"",
    harga_beli:0,
    harga_jual:0
  }
  detailbahanId:any
  visible:boolean=false

  constructor(
    private projectService:ProjekService,
    private detailbahanService:DetailbahanService,
    private detailprojekService:DetailprojekService,
    private sharedloginService: SharedloginService,
    private shareddetailbahanService: ShareddetailbahanService,
    //private route: ActivatedRoute, // Add this
    private router:Router){}

  ngOnInit(): void {
    this.sharedloginService.getProfileData().subscribe(data => {
      this.dataLogin = data;
      //console.log('Header received updated profile:', this.dataLogin);
    });
    /*
    this.detailbahanId = this.route.snapshot.paramMap.get('id');
    if (this.detailbahanId) {
      this.loadDataDetailProjek(this.detailbahanId)
    }
    this.dataDetailBahan = this.shareddetailbahanService.getData('editDetailProjek');
    if (!this.dataDetailBahan) {
      // Handle case where user is not found, maybe navigate back or show an error
      //this.mode = false
      this.visible = false
    }
    else{
      //this.mode = true
      this.visible = true
      this.initFormData()
      
    }
      */
  }
  loadDataDetailProjek(detprojID:any){
    this.detailprojekService.getID(detprojID).subscribe({
      next:(res:any)=>{

      }
    })
  }
  confirm() {
    /*
    const formData = new FormData() 
    formData.append('id_project_detil', this.inputDetailBahan.id_project_detil.toString())
    formData.append('item_id', this.inputDetailBahan.item_id.toString()) 
    formData.append('item_code', this.inputDetailBahan.item_code.toString())
    formData.append('item_name', this.inputDetailBahan.item_name)
    formData.append('ukuran', this.inputDetailBahan.ukuran)
    formData.append('harga_beli', this.inputDetailBahan.harga_beli.toString())
    formData.append('harga_jual', this.inputDetailBahan.harga_jual.toString())
    //console.log('formData Modal Bayar', this.stbayar)
    */
    const d = {
      'id_project_detil' : this.inputDetailBahan.id_project_detil,
      'item_id': this.inputDetailBahan.item_id,
      'item_code': this.inputDetailBahan.item_code,
      'item_name': this.inputDetailBahan.item_name,
      'ukuran': this.inputDetailBahan.ukuran,
      'harga_beli': this.inputDetailBahan.harga_beli,
      'harga_jual': this.inputDetailBahan.harga_jual,
    }
    this.detailbahanService.create(d)
    .subscribe({
      next:(res:any)=>{
        this.router.navigate(['/main/detailprojek'])
      },
      error:(e:any)=>{
        if (e.error) {
          // Display a more readable error message
        } else {
         
        }
      }
    })
    
    this.closeModal.emit();
  }
  cancel() {
    console.log('iki tes cancel modal')
    this.closeModal.emit();
  }

}
