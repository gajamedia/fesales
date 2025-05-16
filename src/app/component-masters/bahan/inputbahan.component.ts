import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedbahanService } from '../../services/sharedbahan.service';
import { BahanService } from '../../services/bahan.service';
import { Bahan, Jenisbahan } from '../../interfaces/global.interface';
import { JenisbahanService } from '../../services/jenisbahan.service';
import { ThousandSeparatorPipe } from '../../component-helpers/helpers/thousand-separator.pipe';



@Component({
  selector: 'app-inputjenisbahan',
  standalone: true,
  imports: [CommonModule, FormsModule, ThousandSeparatorPipe],
  providers: [BahanService, SharedbahanService ],
  templateUrl: './inputbahan.component.html',
  
})

export class InputbahanComponent implements OnInit, OnDestroy {
  
  bahan: Bahan = {
    id:0,
    item_code:"",
    item_name:"",
    id_jenis:0,
    ukuran:"",
    keterangan:"",
    harga_beli:0 ,
    harga_jual: 0,
    created_by:"",
    created_date:"",
    updated_by:"",
    updated_date:"",
    is_deleted:0
  };

  visible:boolean = false
  mode:boolean = false
  submitted:boolean = false

  tahunini:any=""
  dataBahan: any;
  isNongolMessage = false;
  messageText = '';

  selectJenis:any={}
  selectDataJenisBahan: any;

  constructor(
    private bahanService:BahanService,
    private jenisbahanService: JenisbahanService,
    private sharedbahanService: SharedbahanService,
    private router:Router) { }

  ngOnInit(): void {
    this.currentDateTime()
    this.dataBahan = this.sharedbahanService.getData('editBahan');
    //console.log( 'tmpval2 on init', this.dataJenisbahan)
    if (!this.dataBahan) {
      // Handle case where user is not found, maybe navigate back or show an error
      this.mode = false
      this.visible = false
    }
    else{
      this.mode = true
      this.visible = true
      this.initFormData()
    }
    //load data jenis bahan
    this.loadJenisBahan()
  }

  ngOnDestroy() {
    this.sharedbahanService.clearData('editBahan');
  }

  currentDateTime() {
    const current = new Date();
    const date = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
    const time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    const dateTime = date +' '+ time;
    const currentYear = new Date().getFullYear().toString();
    this.tahunini = currentYear
    return dateTime;
  }
  loadJenisBahan(){
    this.jenisbahanService.getListAll().subscribe({
      next:(res:any)=>{
        console.log('res load jenisbahan', res)
        this.selectDataJenisBahan = res
      }
    })
  }
  
  initFormData(){
    this.bahan.id = this.dataBahan.id
    this.bahan.item_name = this.dataBahan.item_name
    this.bahan.item_code = this.dataBahan.item_code
    this.bahan.id_jenis = this.dataBahan.id_jenis
    this.bahan.ukuran = this.dataBahan.ukuran
    this.bahan.keterangan = this.dataBahan.keterangan
    this.bahan.harga_beli = this.dataBahan.harga_beli
    this.bahan.harga_jual = this.dataBahan.harga_jual
    this.bahan.created_by = this.dataBahan.created_by
    this.bahan.created_date = this.dataBahan.created_date
    this.bahan.updated_by = this.dataBahan.updated_by
    this.bahan.updated_date = this.dataBahan.updated_date
    this.bahan.is_deleted = this.dataBahan.is_deleted
  }

  onSimpan(form: any) {
    //let a:any = this.selectedJenisBahan
    //this.bahan.id_jenis = a
    if (form.valid) {
      const data = {
        'item_name': this.bahan.item_name,
        'item_code': this.bahan.item_code,
        'id_jenis': this.bahan.id_jenis,
        'ukuran': this.bahan.ukuran,
        'keterangan': this.bahan.keterangan,
        'harga_beli': this.bahan.harga_beli,
        'harga_jual': this.bahan.harga_jual,
        /*
        'created_by' : this.bahan.created_by,
        'created_date' : this.bahan.created_date,
        'updated_by' : this.bahan.updated_by,
        'updated_date' : this.bahan.updated_date,
        'is_deleted' : this.bahan.is_deleted
        */

      }
      console.log('res', data)
      this.bahanService.create(data)
      .subscribe({
        next:(res)=>{
          this.showMessage('Simpan Data Sukses');
          this.router.navigate(['/main/inputbahan'])
          this.refreshData(form)
        },
        error:(e:any)=>{
          if (e.error) {
            // Display a more readable error message
            console.error('Backend error:', e.error);
          } else {
            console.error('Error', 'Simpan Data Error.');
          }
        }
      })
    }
    
  }

  onUpdate(form: any) {
    //let a:any = this.selectedJenisBahan
    //this.bahan.id_jenis = a
    if (form.valid) {
      const data = {
        'item_name': this.bahan.item_name,
        'item_code': this.bahan.item_code,
        'id_jenis': this.bahan.id_jenis,
        'ukuran': this.bahan.ukuran,
        'keterangan': this.bahan.keterangan,
        'harga_beli': this.bahan.harga_beli,
        'harga_jual': this.bahan.harga_jual,
        /*
        'created_by' : this.bahan.created_by,
        'created_date' : this.bahan.created_date,
        'updated_by' : this.bahan.updated_by,
        'updated_date' : this.bahan.updated_date,
        'is_deleted' : this.bahan.is_deleted
        */
      }
      let id = this.bahan.id
      this.bahanService.update(id, data)
      .subscribe({
        next:(res)=>{
          this.showMessage('Update Data Sukses');
          this.router.navigate(['/main/bahan'])
          this.refreshData(form)
        },
        error: (e) => {
          //console.error('Update error:', e);
          if (e.error) {
              // Display a more readable error message
            console.error('Backend error:', e.error);
          } else {
            console.error('Error', 'Simpan Data Error.');
          }
        }
      })
    }
    
  }
  onCancel(){
    //console.log('tes clik cancel')
    this.router.navigate(['/main/bahan'])
  }
  refreshData(form?: any) {
    this.bahan = {
      id: 0,
      item_code: "",
      item_name: "",
      id_jenis: 0,
      ukuran: "",
      keterangan: "",
      harga_beli: 0,
      harga_jual: 0,
      created_by: "",
      created_date: "",
      updated_by: "",
      updated_date: "",
      is_deleted: 0
    };
  
    if (form) {
      form.reset(); // ✅ Reset form agar validasi kembali normal
    }
  }
  
  showMessage(t:string): void {
    this.isNongolMessage = true;
    this.messageText = t
    // Auto close the message after 3 seconds (3000 ms)
    setTimeout(() => {
      this.isNongolMessage = false;
    }, 3000);
  }
}
