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
  templateUrl: './inputjenisbahan.component.html',
  providers: [JenisbahanService, SharedjenisbahanService ]
})

export class InputjenisbahanComponent implements OnInit, OnDestroy {
  
  jenisBahan: Jenisbahan = {
    id:0,
    NamaJenis:"",
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
    this.dataJenisbahan = this.sharedjenisbahanService.getData('editJenisbahan');
    //console.log( 'tmpval2 on init', this.dataJenisbahan)
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
  trackByFn(index: number, item: any) {
    return item.value;
  }
  
  initFormData(){
    this.jenisBahan.id = this.dataJenisbahan.id
    this.jenisBahan.NamaJenis = this.dataJenisbahan.NamaJenis
  }

  onSimpan(form: any) {
    if (form.valid) {
      const data = {
        'NamaJenis': this.jenisBahan.NamaJenis,
      }
      console.log('res', data)
      this.jenisbahanService.create(data)
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
        'NamaJenis': this.jenisBahan.NamaJenis
      }
      let id = this.jenisBahan.id
      this.jenisbahanService.update(id, data)
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
    this.jenisBahan.NamaJenis =""
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
