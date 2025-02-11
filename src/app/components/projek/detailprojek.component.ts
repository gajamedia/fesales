import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedloginService } from '../../services/sharedlogin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjekService } from '../../services/projek.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DetailBahan, DetailProjek, Projek } from '../../interfaces/global.interface';
import dayjs from 'dayjs';
import { DetailprojekService } from '../../services/detailprojek.service';
import { ShareddetailprojekService } from '../../services/shareddetailprojek.service';
import { ModaldetailbahanComponent } from './modaldetailbahan.component';
import { DetailbahanService } from '../../services/detailbahan.service';

@Component({
  selector: 'app-detailprojek',
  standalone: true,
  imports: [CommonModule, FormsModule, ModaldetailbahanComponent],
  providers: [SharedloginService, AuthService, ShareddetailprojekService],
  templateUrl: './detailprojek.component.html',
  styleUrl: './projek.component.scss'
})
export class DetailprojekComponent implements OnInit, OnDestroy{
  dataProjek: any ={}
  dataListDetailProjek: any
  //dataDetailBahan: any

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
    id_project_header: 0,
    lebar_bahan: 0,
    lantai: "",
    ruangan: "",
    bed: "",
    tipe: "",
    uk_room_l: 0,
    uk_room_p: 0,
    uk_room_t: 0,
    stik: 0,
    elevasi: 0,
    tinggi_vitrase: 0,
    tinggi_lipatan: 0,
    nilai_pembagi: 0,
    created_by: "",
    created_date: "",
    updated_by: "",
    updated_date: "",
    is_deleted: 0,
    dataDetailBahan: undefined,
    expanded: false
  }
    
  projectId: string | null = null;

  mode:boolean = false
  visible:boolean = false
  isNongolMessage:boolean = false
  messageText:string=""
  //modal
  //isModalOpen:boolean=false
  //subtable
  //dataDetailProjek: any[] = [];
  dataDetailProjek: DetailProjek[] = []; // Data utama 
  //expandedRow: number | null = null;
  //dataDetailBahan: { [key: number]: any } = {}; // Deklarasikan sebagai objek
  expandedRows: { [key: number]: any[] } = {};
  editedBahan:any

  constructor(
    private sharedloginService: SharedloginService,
    private projekService: ProjekService,
    private detailprojekService: DetailprojekService,
    private detailbahanService: DetailbahanService,
    private shareddetailprojekService: ShareddetailprojekService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router)

    {
      //this.typepayId = this.route.snapshot.paramMap.get('typepayId')!;
    }

  ngOnDestroy() {
    this.shareddetailprojekService.clearData('editDetailProjek');
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
    
    this.dataListDetailProjek = this.shareddetailprojekService.getData('editDetailProjek');
    if (!this.dataListDetailProjek) {
      //this.mode = false
      this.visible = false
    }
    else{
      //this.mode = true
      this.visible = true
      this.initFormData()
      
    }
      
    //load detail bahan
    //this.loadDetailBahan(this.projectId!)

  }
  
  initFormData(){
    this.inputDetailProjek.id = this.dataListDetailProjek.id
    this.inputDetailProjek.id_project_header = this.dataListDetailProjek.id_project_header
    this.inputDetailProjek.lebar_bahan= this.dataListDetailProjek.lebar_bahan
    this.inputDetailProjek.lantai = this.dataListDetailProjek.lantai
    this.inputDetailProjek.ruangan = this.dataListDetailProjek.ruangan
    this.inputDetailProjek.bed = this.dataListDetailProjek.bed
    this.inputDetailProjek.tipe = this.dataListDetailProjek.tipe
    this.inputDetailProjek.uk_room_l = this.dataListDetailProjek.uk_room_l
    this.inputDetailProjek.uk_room_p = this.dataListDetailProjek.uk_room_p
    this.inputDetailProjek.uk_room_t = this.dataListDetailProjek.uk_room_t
    this.inputDetailProjek.stik = this.dataListDetailProjek.stik
    this.inputDetailProjek.elevasi = this.dataListDetailProjek.elevasi
    this.inputDetailProjek.tinggi_vitrase = this.dataListDetailProjek.tinggi_vitrase
    this.inputDetailProjek.tinggi_lipatan = this.dataListDetailProjek.tinggi_lipatan 
    this.inputDetailProjek.nilai_pembagi = this.dataListDetailProjek.nilai_pembagi
  }

  loadDataProjekBy(id: any) {
    this.projekService.getID(id).subscribe({
      next: (res: any) => {
        console.log('tes res by ID', res);
        if (res) {
          this.dataProjek = res;
        } else {
          console.warn("dataProjek is empty");
        }
      },
      error: (e: any) => { 
        console.error(e);
        this.dataProjek = {}; // Ensure it's not undefined
      },
      complete: () => { 
        console.log('complete');
      }
    });
  }

  loadDataDetailProjek(id:any){
    this.search = id

    this.detailprojekService.getAll(this.search, this.page, this.pageSize).subscribe({
      next:(res:any)=>{
        //console.log('tes res from search', res.results)
        this.dataDetailProjek = res.results
        this.totalPages = res.count
        //this.dataDetailProjek = res.results.map((detail: any) => ({
        //  ...detail,
        //  showSubTable: false,
        //  subItems: [] // Inisialisasi array sub-item
        //}));
      },
      error:(e:any)=>{ console.error(e)},
      complete:()=>{ console.log('complete')}
    })
  }

  onSimpan(form: any){
    if (form.valid) {
      const d ={
        //'id': this.inputDetailProjek.id,
        'id_project_header':this.projectId, //ini saat edit this.inputDetailProjek.id_project_header,
        
        'lebar_bahan':this.inputDetailProjek.lebar_bahan,
        'lantai':this.inputDetailProjek.lantai,
        'ruangan':this.inputDetailProjek.ruangan,
        'bed':this.inputDetailProjek.bed,
        'tipe':this.inputDetailProjek.tipe,
        'uk_room_l':this.inputDetailProjek.uk_room_l,
        'uk_room_p':this.inputDetailProjek.uk_room_p,
        'uk_room_t':this.inputDetailProjek.uk_room_t,
        'stik':this.inputDetailProjek.stik,
        'elevasi':this.inputDetailProjek.elevasi,
        'tinggi_vitrase':this.inputDetailProjek.tinggi_vitrase,
        'tinggi_lipatan':this.inputDetailProjek.tinggi_lipatan,
        'nilai_pembagi':this.inputDetailProjek.nilai_pembagi
        
      }
      console.log('simpan', d)
      this.detailprojekService.create(d).subscribe({
        next: () => {
          this.showMessage('Simpan Data Sukses');
          console.log('saat simpan detail project this.projectId', this.projectId)
          //.refreshData();
        },
        error: () => {
          this.showMessage('Failed to save project!');
        }
      });
    } else {
      this.showMessage('isian wajib diisi Failed to save project!');
    }
    let b:any = this.projectId
    console.log('saat simpan detail project .id_project_header', b)
    this.loadDataDetailProjek(b)
  }
  onEdit(id:any){

  }
  onDeleted(id:any){

  }
  //onDetailBahan(id:any){
  // this.onOpenModal()
  //}
  onUpdate(form: any) {
    if (form.valid) {
      const d ={
        
        'id_project_header':this.inputDetailProjek.id_project_header,
        'lebar_bahan':this.inputDetailProjek.lebar_bahan,
        'lantai':this.inputDetailProjek.lantai,
        'ruangan':this.inputDetailProjek.ruangan,
        'bed':this.inputDetailProjek.bed,
        'tipe':this.inputDetailProjek.tipe,
        'uk_room_l':this.inputDetailProjek.uk_room_l,
        'uk_room_p':this.inputDetailProjek.uk_room_p,
        'uk_room_t':this.inputDetailProjek.uk_room_t,
        'stik':this.inputDetailProjek.stik,
        'elevasi':this.inputDetailProjek.elevasi,
        'tinggi_vitrase':this.inputDetailProjek.tinggi_vitrase,
        'tinggi_lipatan':this.inputDetailProjek.tinggi_lipatan,
        'nilai_pembagi':this.inputDetailProjek.nilai_pembagi
        
      }
      //let id = this.inputDetailProjek.id
      let id:any="tes"
      this.detailprojekService.update(id, d)
      .subscribe({
        next:(res)=>{
          this.showMessage('Update Data Sukses');
          this.router.navigate(['/main/detailprojek'])
          //this.refreshData()
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
    //let b:any = this.inputDetailProjek.id_project_header
    //console.error('b:', this.inputDetailProjek.id_project_header);
    //this.loadDataDetailProjek(b)
  }
  onCancel(){
    //console.log('tes clik cancel')
    this.shareddetailprojekService.clearData('editDetailProjek');
    this.router.navigate(['/main/projek'])
  }
  formatTglView(tgl: any){
    const date = dayjs(tgl)
    return date.format('DD/MM/YYYY')
  }
  showMessage(t:string): void {
    this.isNongolMessage = true;
    this.messageText = t
    // Auto close the message after 3 seconds (3000 ms)
    setTimeout(() => {
      this.isNongolMessage = false;
    }, 3000);
  }
  
  refreshData(){
    this.inputDetailProjek.id = 0
    this.inputDetailProjek.id_project_header = 0
    this.inputDetailProjek.lebar_bahan= 0
    this.inputDetailProjek.lantai = ""
    this.inputDetailProjek.ruangan = ""
    this.inputDetailProjek.bed = ""
    this.inputDetailProjek.tipe = ""
    this.inputDetailProjek.uk_room_l = 0
    this.inputDetailProjek.uk_room_p = 0
    this.inputDetailProjek.uk_room_t = 0
    this.inputDetailProjek.stik = 0
    this.inputDetailProjek.elevasi = 0
    this.inputDetailProjek.tinggi_vitrase = 0
    this.inputDetailProjek.tinggi_lipatan = 0
    this.inputDetailProjek.nilai_pembagi = 0
  }
  toggleSubtable(id: any) {
    if (this.expandedRows[id]) {
      // Jika subtable sudah terbuka, tutup subtable
      delete this.expandedRows[id];
    } else {
      // Ambil data dari API hanya jika subtable belum dibuka
      this.fetchDetailBahan(id);
    }
  }
  trackByFn(index: number, item: any): number {
    return item.item_code; // Gunakan ID unik sebagai referensi
  }
  
  fetchDetailBahan(id: any) {
    this.detailbahanService.getbyIdDetailProjek(id).subscribe({
      next: (res:any) => {
        console.log('res detailbahan getbyidp', res)
        this.expandedRows[id] = res.results; // Simpan data dalam expandedRows
      },
      error:(error) => {
        console.error("Gagal mengambil data subtable:", error);
      }
    });
  }
  addDetailBahan(id: number) {
    console.log("Menambahkan detail bahan untuk ID:", id);
  
    if (!this.expandedRows[id]) {
      this.expandedRows[id] = [];
    }
  
    // Tambahkan data baru dengan item_id null agar terdeteksi sebagai data baru
    const newData = {
      item_code: Date.now(), // ID unik
      item_id: null, // Null agar dianggap data baru
      item_name: '',
      ukuran: '',
      harga_beli: 0,
      harga_jual: 0,
      isEditing: true, // Mode edit langsung
      id_project_detil: id, // Menambahkan id_project_detil
    };
  
    this.expandedRows[id] = [...this.expandedRows[id], newData]; // Spread operator
  
    console.log("Data setelah ditambahkan:", this.expandedRows[id]);
  }
  
  editDetailBahan(ritemId: number, bahan: DetailBahan) {
    // Cari data dalam expandedRows berdasarkan ID
    const existingData = this.expandedRows[ritemId].find((b) => b.item_id === bahan.item_id);
  
    if (existingData) {
      existingData.isEditing = true; // Aktifkan mode edit tanpa membuat row baru
    }
  }
  
  
  saveDetailBahan(ritemId: number, bahan: DetailBahan) {
    if (!bahan.item_name || !bahan.ukuran) {
      alert('Nama bahan dan ukuran harus diisi!');
      return;
    }
  
    if (bahan.item_id && bahan.item_id > 0) {
      // Jika item_id sudah ada, berarti update
      this.detailbahanService.update(bahan.item_id, bahan).subscribe(() => {
        bahan.isEditing = false;
      });
    } else {
      // Jika item_id kosong/null, berarti buat baru
      this.detailbahanService.create(bahan).subscribe((res) => {
        bahan.item_id = res.id; // Simpan ID yang dikembalikan oleh backend
        bahan.isEditing = false;
      });
    }
  }
  
  

  cancelEdit(bahan: any) {
    if (!bahan.id) {
      // Hapus jika baru ditambahkan dan belum tersimpan
      const index = this.dataDetailProjek.findIndex((p) =>
        p.dataDetailBahan.includes(bahan)
      );
      if (index !== -1) {
        this.dataDetailProjek[index].dataDetailBahan = this.dataDetailProjek[
          index
        ].dataDetailBahan.filter((b:any) => b !== bahan);
      }
    } else {
      bahan.isEditing = false;
    }
  }

  deleteDetailBahan(ritem: any, bahan: any) {
    if (!this.expandedRows[ritem.id]) {
      console.warn("expandedRows[id] tidak ditemukan:", ritem.id);
      return;
    }
  
    // Filter untuk menghapus item yang cocok
    this.expandedRows[ritem.id] = this.expandedRows[ritem.id].filter(b => b !== bahan);
  
    // Memicu perubahan deteksi Angular
    this.expandedRows[ritem.id] = [...this.expandedRows[ritem.id]];
  
    console.log("Data setelah dihapus:", this.expandedRows[ritem.id]);
  }
  

}
