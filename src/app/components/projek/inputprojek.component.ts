import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { SharedloginService } from '../../services/sharedlogin.service';
import { Projek } from '../../interfaces/global.interface';
import { ProjekService } from '../../services/projek.service';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { SharedprojekService } from '../../services/sharedprojek.service';



@Component({
  selector: 'app-inputprojek',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent],
  templateUrl: './inputprojek.component.html',
  styleUrl: './projek.component.scss',
  providers: [SharedloginService, SharedprojekService]
})
export class InputprojekComponent implements OnInit, OnDestroy {
  
  dataInputProjek: Projek = {
    id: 0,
    no_project: "", 
    tgl_project: new Date().toISOString(), // Ensure a default date value
    ket_project: "", 
    nama_customer: "", 
    addr_customer: "", 
    contact_customer: "", 
    status_project: "", 
    created_by: "",
    created_date: "",
    updated_by: "",
    updated_date: "",
    is_deleted: 0,
  }

  tahunini:any
  tgldel:any
  deletedby:any
  idrole!: number // 0=None 1=SuperAdmin 2=Admin 3=Guru 4=TU 5=Siswa 6=Satpam 7=Walisiswa

  dataLogin: any={}
  dataProjek:any
  isRole:boolean = false
  messageText: string="";
  isNongolMessage: boolean = false;

  visible:boolean = false
  mode:boolean = false
  submitted:boolean = false

  // Define the options for the select dropdown
  statusProjectOptions = [
    { key: 0, value: 'Fu' },
    { key: 1, value: 'Kontrak' },
    { key: 2, value: 'Pengerjaan' },
    { key: 3, value: 'Pemasangan' },
    { key: 4, value: 'Pengecekan' },
    { key: 5, value: 'Penagihan' },
    { key: 6, value: 'Lunas' }
  ];
  //modal
  constructor(
    private cdr: ChangeDetectorRef,
    private projekService: ProjekService,
    private sharedloginService: SharedloginService,
    private sharedprojekService: SharedprojekService,
    private router: Router)

    {
      //this.typepayId = this.route.snapshot.paramMap.get('typepayId')!;
    }
  ngOnDestroy() {
    this.sharedprojekService.clearData('editProjek');
  }
  ngOnInit(): void {
    this.currentDateTime();
    this.dataProjek = this.sharedprojekService.getData('editProjek');
    if (!this.dataProjek) {
      // Handle case where user is not found, maybe navigate back or show an error
      this.mode = false
      this.visible = false
      this.genKode()
    }
    else{
      this.mode = true
      this.visible = true
      this.initFormData()
      
    }
  }
  
  currentDateTime() {
    const current = new Date();
    const date = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
    const time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    const dateTime = date +' '+ time;
 
    this.tahunini = current.getFullYear()
    //console.log('this.timenow', this.timenow)
    return dateTime;
  }

  onDateSelected(selectedDate: Date) {
    console.log('Selected Date:', selectedDate); // Ensure this is firing
  }
  
  initFormData(){
    this.dataInputProjek.id = this.dataProjek.id
    this.dataInputProjek.no_project = this.dataProjek.no_project
    this.dataInputProjek.tgl_project= this.dataProjek.tgl_project
    this.dataInputProjek.ket_project = this.dataProjek.ket_project
    this.dataInputProjek.nama_customer = this.dataProjek.nama_customer
    this.dataInputProjek.addr_customer = this.dataProjek.addr_customer
    this.dataInputProjek.contact_customer = this.dataProjek.contact_customer
    this.dataInputProjek.status_project = this.dataProjek.status_project
  
  }
  onSimpan(form: any) {
    if (form.valid) {
      const d ={
        'no_project' : this.dataInputProjek.no_project,
        'tgl_project': this.formatTglDB(this.dataInputProjek.tgl_project || ""),
        'ket_project' : this.dataInputProjek.ket_project,
        'nama_customer' : this.dataInputProjek.nama_customer,
        'addr_customer' : this.dataInputProjek.addr_customer,
        'contact_customer' : this.dataInputProjek.contact_customer,
        'status_project' : this.dataInputProjek.status_project
      }
      console.log('simpan', d)
      this.projekService.create(d).subscribe({
        next: () => {
          this.showMessage('Simpan Data Sukses');
          this.refreshData();
        },
        error: () => {
          this.messageText = "Failed to save project!";
          this.isNongolMessage = true;
        }
      });
    } else {
      this.messageText = "Please fill in all required fields!";
      this.isNongolMessage = true;
    }
    
  }
  onUpdate(form: any) {
    if (form.valid) {
      const d ={
        'no_project' : this.dataInputProjek.no_project,
        'tgl_project': this.dataProjek.tgl_project,
        'ket_project' : this.dataProjek.ket_project,
        'nama_customer' : this.dataProjek.nama_customer,
        'addr_customer' :this.dataProjek.addr_customer,
        'contact_customer' : this.dataProjek.contact_customer,
        'status_project' : this.dataProjek.status_project
      }
      let id = this.dataInputProjek.id
      this.projekService.update(id, d)
      .subscribe({
        next:(res)=>{
          this.showMessage('Update Data Sukses');
          this.router.navigate(['/main/projek'])
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
    this.router.navigate(['/main/projek'])
  }
  refreshData(){
    this.dataInputProjek = {
      id: 0,
      no_project: "", 
      tgl_project: "", 
      ket_project: "", 
      nama_customer: "", 
      addr_customer: "", 
      contact_customer: "", 
      status_project: "", 
      created_by: "",
      created_date: "",
      updated_by: "",
      updated_date: "",
      is_deleted: 0,
    }
  }
  genKode(){
    this.projekService.getListAll().subscribe({
      next: (res: any) => {
        console.log('test res getlist', res)
        let nrec = res.count || 0;
        let snol = '0'.repeat(Math.max(0, 3 - nrec.toString().length));
        this.dataInputProjek.no_project = `PROJ.${snol}${nrec + 1}`;
      },
      error: () => {
        this.messageText = "Failed to generate project code!";
        this.isNongolMessage = true;
      }
    });
    
  }
  formatTglDB(tgl:string){
    const date = dayjs(tgl)
    return date.format('YYYY-MM-DD hh:mm:ss')
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
