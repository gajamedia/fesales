import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
export class InputprojekComponent implements OnInit {
  
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

  idrole!: number // 0=None 1=SuperAdmin 2=Admin 3=Guru 4=TU 5=Siswa 6=Satpam 7=Walisiswa
  dataLogin: any={}
  isRole:boolean = false
  messageText: string="";
  isNongolMessage: boolean = false;


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

  mode: 'add' | 'edit' = 'add';
  visible:boolean=false
  idProject: string | null = null;

  constructor(
    private projekService: ProjekService,
    private sharedloginService: SharedloginService,
    private route: ActivatedRoute,
    private router: Router)

    {
      //this.typepayId = this.route.snapshot.paramMap.get('typepayId')!;
    }
  
    ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params); // Debugging
      this.mode = params['mode'] === 'edit' ? 'edit' : 'add';
      this.idProject = params['id'] || null;

      console.log('Mode:', this.mode, 'ID Project:', this.idProject); // Debugging

      if (this.mode === 'edit' && this.idProject) {
        this.loadProjectData(this.idProject);
        this.visible = true;
      } else {
        this.resetForm();
        this.visible = false;
      }
    });
  }
  currentDateTime() {
    const current = new Date();
    const date = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
    const time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    const dateTime = date +' '+ time;
 
    //this.tahunini = current.getFullYear()
    //console.log('this.timenow', this.timenow)
    return dateTime;
  }
  loadProjectData(id: any) {
    console.log('Load project with ID:', id);
    this.projekService.getID(id).subscribe({
      next: (res: Projek) => {
        console.log('Data fetched from API:', res); // Debugging
        this.dataInputProjek = {
          id: res.id,
          no_project: res.no_project,
          tgl_project: res.tgl_project ? dayjs(res.tgl_project).format('YYYY-MM-DD') : '',
          ket_project: res.ket_project,
          nama_customer: res.nama_customer,
          addr_customer: res.addr_customer,
          contact_customer: res.contact_customer,
          status_project: res.status_project,
          created_by: res.created_by,
          created_date: res.created_date,
          updated_by: res.updated_by,
          updated_date: res.updated_date,
          is_deleted: res.is_deleted,
        };
      },
      error: (e) => {
        console.error('Error fetching project data:', e);
        this.showMessage('Gagal mengambil data proyek!');
      }
    });
  }
  
  

  resetForm() {
    console.log('Initialize empty form for new project');
    // Inisialisasi form kosong
    this.genKode()
  }
  onDateSelected(selectedDate: Date) {
    console.log('Selected Date:', selectedDate); // Ensure this is firing
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
      const d = {
        'no_project': this.dataInputProjek.no_project,
        'tgl_project': this.formatTglDB(this.dataInputProjek.tgl_project || ""),
        'ket_project': this.dataInputProjek.ket_project,
        'nama_customer': this.dataInputProjek.nama_customer,
        'addr_customer': this.dataInputProjek.addr_customer,
        'contact_customer': this.dataInputProjek.contact_customer,
        'status_project': this.dataInputProjek.status_project
      };
  
      let id = this.dataInputProjek.id;
      this.projekService.update(id, d).subscribe({
        next: () => {
          this.showMessage('Update Data Sukses');
          setTimeout(() => {
            this.router.navigate(['/main/projek']);
            this.refreshData();
          }, 1000); // Tambahkan delay agar user bisa melihat pesan sukses
        },
        error: (e) => {
          console.error('Update error:', e?.error || 'Simpan Data Error.');
        }
      });
    }
  }
  
  onCancel(){
    if (this.router.url !== '/main/projek') {
      this.router.navigate(['/main/projek']);
    }
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
  genKode() {
  this.projekService.getListAll().subscribe({
    next: (res: any) => {
      let nrec = res?.count ?? res?.length ?? 0;
      let snol = '0'.repeat(Math.max(0, 3 - nrec.toString().length));
      this.dataInputProjek.no_project = `PROJ.${snol}${nrec + 1}`;
    },
    error: () => {
      this.showMessage("Failed to generate project code!");
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
