import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedbahanService } from '../../services/sharedbahan.service';
import { BahanService } from '../../services/bahan.service';
import { Bahan } from '../../interfaces/global.interface';



@Component({
  selector: 'app-inputjenisbahan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inputbahan.component.html',
  providers: [BahanService, SharedbahanService ]
})

export class InputbahanComponent implements OnInit, OnDestroy {
  
  bahan: Bahan = {
    id:0,
    itemcode:"",
    itemname:"",
    idjenis:0,
    created_by:"",
    created_date:"",
    updated_by:"",
    updated_date:""
  };

  visible:boolean = false
  mode:boolean = false
  submitted:boolean = false

  tahunini:any=""
  dataBahan: any;
  isNongolMessage = false;
  messageText = '';

  constructor(
    private bahanService:BahanService, 
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
  }

  ngOnDestroy() {
    this.sharedbahanService.clearData('editJenisbahan');
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
  trackByFn(index: number, item: any) {
    return item.value;
  }
  
  initFormData(){
    this.bahan.id = this.dataBahan.id
    this.bahan.itemname = this.dataBahan.itemname
    this.bahan.itemcode = this.dataBahan.itemcode
    this.bahan.idjenis = this.dataBahan.idjenis
    this.bahan.created_by = this.bahan.created_by
    this.bahan.created_date = this.bahan.created_date
    this.bahan.updated_by = this.bahan.updated_by
    this.bahan.updated_date = this.bahan.updated_date
    this.bahan.is_deleted = this.bahan.is_deleted
  }

  onSimpan(form: any) {
    if (form.valid) {
      const data = {
        'ItemName': this.bahan.itemname,
        'ItemCode': this.bahan.itemcode,
        'IdJenis': this.bahan.idjenis,
        'created_by' : this.bahan.created_by,
        'created_date' : this.bahan.created_date,
        'updated_by' : this.bahan.updated_by,
        'updated_date' : this.bahan.updated_date,
        'is_deleted' : this.bahan.is_deleted


      }
      console.log('res', data)
      this.bahanService.create(data)
      .subscribe({
        next:(res)=>{
          this.showMessage('Simpan Data Sukses');
          this.refreshData()
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
    if (form.valid) {
      const data = {
        'ItemName': this.bahan.itemname,
        'ItemCode': this.bahan.itemcode,
        'IdJenis': this.bahan.idjenis,
        'created_by' : this.bahan.created_by,
        'created_date' : this.bahan.created_date,
        'updated_by' : this.bahan.updated_by,
        'updated_date' : this.bahan.updated_date,
        'is_deleted' : this.bahan.is_deleted
      }
      let id = this.bahan.id
      this.bahanService.update(id, data)
      .subscribe({
        next:(res)=>{
          this.showMessage('Update Data Sukses');
          this.router.navigate(['/jenisbahan'])
          this.refreshData()
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
    this.router.navigate(['/jenisBahan'])
  }
  refreshData(){
    this.bahan.itemname = ""
    this.bahan.itemcode = ""
    this.bahan.idjenis = 0
    this.bahan.created_by = ""
    this.bahan.created_date = ""
    this.bahan.updated_by = ""
    this.bahan.updated_date = ""
    this.bahan.is_deleted = 0
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
