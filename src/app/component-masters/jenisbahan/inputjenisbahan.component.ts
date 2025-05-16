import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedjenisbahanService } from '../../services/sharedjenisbahan.service';
import { JenisbahanService } from '../../services/jenisbahan.service';
import { Jenisbahan } from '../../interfaces/global.interface';


@Component({
  selector: 'app-inputjenisbahan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [JenisbahanService, SharedjenisbahanService ],
  templateUrl: './inputjenisbahan.component.html',
  
})

export class InputjenisbahanComponent implements OnInit, OnDestroy {
  
  jenisbahan: Jenisbahan = {
    id:0,
    nama_jenis:"",
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
  dataJenisbahan: any;
  isNongolMessage = false;
  messageText = '';

  constructor(
    private jenisbahanService:JenisbahanService, 
    private sharedjenisbahanService: SharedjenisbahanService,
    private router:Router) { }

  ngOnInit(): void {
    this.currentDateTime()
    console.log('Fetching data from shared service...');
  this.dataJenisbahan = this.sharedjenisbahanService.getData('editJenisbahan');
  console.log('Received data:', this.dataJenisbahan);
    if (!this.dataJenisbahan) {
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
    this.sharedjenisbahanService.clearData('editJenisbahan');
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
  
  initFormData(){
    this.jenisbahan.id = this.dataJenisbahan.id
    this.jenisbahan.nama_jenis = this.dataJenisbahan.nama_jenis
  }

  onSimpan(form: any) {
    if (form.valid) {
      const data = {
        'nama_jenis': this.jenisbahan.nama_jenis,
      }
      console.log('res', data)
      this.jenisbahanService.create(data)
      .subscribe({
        next:(res)=>{
          this.showMessage('Simpan Data Sukses');
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
    if (form.valid) {
      const data = {
        'nama_jenis': this.jenisbahan.nama_jenis
      }
      let id = this.jenisbahan.id
      this.jenisbahanService.update(id, data)
      .subscribe({
        next:(res)=>{
          this.showMessage('Update Data Sukses');
          this.router.navigate(['/main/jenisbahan'])
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
    this.router.navigate(['/main/jenisbahan'])
  }
  refreshData(form?:any){
    this.jenisbahan.nama_jenis =""
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
