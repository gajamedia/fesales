import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SharedloginService } from '../../services/sharedlogin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjekService } from '../../services/projek.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Bahan, DetailBahan, DetailProjek } from '../../interfaces/global.interface';
import dayjs from 'dayjs';
import { DetailprojekService } from '../../services/detailprojek.service';
import { ShareddetailprojekService } from '../../services/shareddetailprojek.service';
import { DetailbahanService } from '../../services/detailbahan.service';
import { BahanService } from '../../services/bahan.service';

@Component({
  selector: 'app-detailprojek',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [SharedloginService, AuthService, ShareddetailprojekService],
  templateUrl: './detailprojek.component.html',
  styleUrl: './projek.component.scss'
})
export class DetailprojekComponent implements OnInit, OnDestroy {
  @ViewChildren('inputField') inputFields!: QueryList<ElementRef>;
  formRef!: NgForm;

  dataProjek: any = {};
  dataLogin: any = {};
  dataDetailProjek: DetailProjek[] = [];
  expandedRows: { [key: number]: any[] } = {};
  dataBahan: Bahan[] = [];
  dataKebKain: any[] = [];
  dataKebVitrase: any[] = [];
  totKebutuhanKain: any;
  totKebutuhanVitrase: any;

  inputDetailProjek: DetailProjek = this.initDetailProjek();
  isDisabled = true; // atau false tergantung kondisi untukk pembagi

  projectId: string | null = null;
  currentPage = 1;
  totalPages!: number;
  pageSize = 10;
  selectedPageSize = 10;
  search = '';
  visible = false;
  editMode = false;
  editedItemId: string | null = null;
  isNongolMessage = false;
  messageText = '';
  showAddBahanModal = false;
  selectedDetailProjekId: number | null = null;

  listIDProjectDetail:any []=[]
  modeEdit: boolean = false; // kalau false berarti tambah

  constructor(
    private sharedloginService: SharedloginService,
    private projekService: ProjekService,
    private detailprojekService: DetailprojekService,
    private detailbahanService: DetailbahanService,
    private shareddetailprojekService: ShareddetailprojekService,
    private bahanService: BahanService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.loadDataProjekBy(this.projectId);
      this.loadDataDetailProjek(this.projectId);
    }
    this.sharedloginService.getProfileData().subscribe(data => this.dataLogin = data);
  }
  ngAfterViewInit() {
    // Access the QueryList and focus the first input element after the view is initialized
    const inputElements = this.inputFields.toArray(); // Convert the QueryList to an array
    if (inputElements.length > 0) {
      inputElements[0].nativeElement.focus(); // Focus on the first element
    }
  }
  ngOnDestroy(): void {
    this.shareddetailprojekService.clearData('editDetailProjek');
  }

  loadDataProjekBy(id: any): void {
    this.projekService.getID(id).subscribe({
      next: (res: any) => this.dataProjek = res || {},
      error: () => this.dataProjek = {}
    });
  }

  loadDataDetailProjek(id: any): void {
    this.detailprojekService.getbyIdDetailProjek(id).subscribe({
      next: (res: any) => this.dataDetailProjek = res.results,
      error: (e: any) => console.error(e)
    });
  }

  onLebarBahanChange(value: string): void {
    const lebar = parseInt(value, 10);
    this.inputDetailProjek.nilai_pembagi = {150: 75, 140: 70, 120: 60}[lebar] || 0;
  }

  onSimpan(form: NgForm): void {
    this.formRef = form;
    if (form.valid) {
      const payload = { ...this.inputDetailProjek, id_project_header: this.projectId };
      this.detailprojekService.create(payload).subscribe({
        next: () => {
          this.showMessage('Simpan Data Sukses');
          this.loadDataDetailProjek(this.projectId);
          this.refreshData(form);
        },
        error: () => this.showMessage('Gagal menyimpan data')
      });
    } else {
      this.showMessage('Isian wajib diisi!');
    }
  }

  onEdit(id: number): void {
    const item = this.dataDetailProjek.find(d => d.id === id);
    if (item) {
      this.visible = true;
      this.editMode = true;
      this.editedItemId = id.toString();
      this.inputDetailProjek = { ...item };
    }
  }

  onDeleted(id: number): void {
    this.detailprojekService.deletedby(id, { is_deleted: 1 }).subscribe({
      next: () => {
        this.loadDataDetailProjek(this.projectId);
        this.router.navigate(['/main/projek']);
      },
      error: (e: any) => console.error(e)
    });
  }

  onUpdate(form: NgForm): void {
    if (form.valid) {
      this.detailprojekService.update(this.inputDetailProjek.id, this.inputDetailProjek).subscribe({
        next: () => {
          this.showMessage('Update Data Sukses');
          this.router.navigate(['/main/detailprojek']);
          this.refreshData(form);
        },
        error: (e) => console.error('Error update:', e)
      });
    }
  }

  onCancel(): void {
    this.shareddetailprojekService.clearData('editDetailProjek');
    this.router.navigate(['/main/projek']);
  }

  refreshData(form?: NgForm): void {
    this.inputDetailProjek = this.initDetailProjek();
    form?.resetForm();
  }

  formatTglView(tgl: any): string {
    return dayjs(tgl).format('DD/MM/YYYY');
  }

  showMessage(text: string): void {
    this.messageText = text;
    this.isNongolMessage = true;
    setTimeout(() => this.isNongolMessage = false, 3000);
  }

  toggleSubtable(id: number): void {
    if (this.expandedRows[id]) delete this.expandedRows[id];
    else {
      this.fetchDetailBahan(id);
      this.loadKebutuhanKain(id);
      this.loadKebutuhanVitrase(id);
    }
  }

  fetchDetailBahan(id: number): void {
    this.detailbahanService.getbyIdDetailProjek(id.toString()).subscribe({
      next: (res: any) => this.expandedRows[id] = res.results,
      error: (e) => console.error('Gagal mengambil subtable:', e)
    });
  }

  loadDataBahan(callback?: () => void): void {
    this.bahanService.getAll('', 1, 100).subscribe({
      next: (res: any) => {
        this.dataBahan = res.results;
        if (callback) {
          callback(); // <-- ini dipanggil kalau ada callback
        }
      }
    });
  }
  

  addDetailBahan(id: number): void {
    this.selectedDetailProjekId = id;
    this.editMode = false; // <-- Mode tambah
    this.loadDataBahan();
    this.showAddBahanModal = true;
  }
  
  editDetailBahan(id: number): void {
    this.selectedDetailProjekId = id;
    this.showAddBahanModal = true;
    this.editMode = true; // <-- Mode edit
    this.loadDataBahan(() => {
      if (id) {
        this.loadSelectedBahanForProjectDetail(id);
      }
    });
  }
  

  loadSelectedBahanForProjectDetail(projectDetailId: number): void {
    this.detailbahanService.getbyIdDetailProjek(projectDetailId.toString()).subscribe({
      next: (response: any) => {
        const selected = response.results;
        this.dataBahan.forEach(bahan => {
          bahan.selected = selected.some((s: any) => s.item_id === bahan.id);
        });
      }
    });
  }

  updateChecklistBahan(projectDetailId: number | null): void {
    if (!projectDetailId) return;
    console.log('Saat simpan edit', projectDetailId);
  
    // Step 1: ambil semua ID bahan lama
    this.detailbahanService.getbyIdDetailProjek(projectDetailId.toString()).subscribe({
      next: (res: any) => {
        console.log('Res dari findByIdDetail', res);
  
        const idList = res.results.map((item: any) => item.id); // Ambil array id
        console.log('List ID Project Detail:', idList);
  
        if (idList.length > 0) {
          // Step 2: hapus semua berdasarkan list ID
          // kalau delete harus per id:
          let deleteCounter = 0;
          idList.forEach((id:any) => {
            this.detailbahanService.deletedbyidprojdet(id).subscribe({
              next: () => {
                deleteCounter++;
                if (deleteCounter === idList.length) {
                  console.log('Semua data lama sudah dihapus');
  
                  // Step 3: Insert data baru
                  this.insertSelectedBahan(projectDetailId);
                }
              },
              error: (err) => console.error('Gagal hapus ID:', id, err)
            });
          });
        } else {
          // Kalau tidak ada data lama, langsung insert saja
          this.insertSelectedBahan(projectDetailId);
        }
      }
    });
  }
  
  insertSelectedBahan(projectDetailId: number): void {
    const selectedItems = this.dataBahan.filter(b => b.selected);
  
    if (selectedItems.length === 0) {
      console.log('Tidak ada bahan yang dipilih.');
      this.showAddBahanModal = false;
      return;
    }
  
    let insertCounter = 0;
    selectedItems.forEach(item => {
      const newDetail: DetailBahan = { ...item, id_project_detil: projectDetailId };
      this.detailbahanService.create(newDetail).subscribe({
        next: () => {
          insertCounter++;
          if (insertCounter === selectedItems.length) {
            console.log('Semua bahan berhasil di-insert');
            this.loadKebutuhanKain(projectDetailId);
            this.loadKebutuhanVitrase(projectDetailId);
            
            // Reset form
            this.showAddBahanModal = false;
            this.dataBahan.forEach(b => b.selected = false);
          }
        },
        error: (err) => console.error('Gagal insert bahan:', item, err)
      });
    });
  }
  

  simpanChecklistBahan(projectDetailId: number | null): void {
    if (!projectDetailId) return;
    console.log('saat simpan edit', projectDetailId)
    this.detailbahanService.getbyIdDetailProjek(projectDetailId.toString()).subscribe({
      next:(res:any)=>{
        console.log('res dari findbyiddetail', res)
        
        this.listIDProjectDetail = res.results
        console.log('res dari id findbyiddetail', this.listIDProjectDetail)
        // Hapus semua dulu berdasarkan projectDetailId
        this.detailbahanService.deletedbyidprojdet(projectDetailId).subscribe({
          next: (res: any) => {
            // setelah hapus, baru insert data baru
            const selectedItems = this.dataBahan.filter(b => b.selected);
            selectedItems.forEach(item => {
              const newDetail: DetailBahan = { ...item, id_project_detil: projectDetailId };
              this.detailbahanService.create(newDetail).subscribe(() => {
                this.loadKebutuhanKain(projectDetailId);
                this.loadKebutuhanVitrase(projectDetailId);
              });
            });
      
            // setelah semua selesai
            this.showAddBahanModal = false;
            this.dataBahan.forEach(b => b.selected = false);
          }
        });
      }
    })
    
  }
  
  loadKebutuhanKain(id: number): void {
    this.detailprojekService.getkain(id).subscribe({
      next: (res: any) => {
        this.dataKebKain = res.details;
        this.totKebutuhanKain = res.total_kebutuhan_kain;
      }
    });
  }

  loadKebutuhanVitrase(id: number): void {
    this.detailprojekService.getvitrase(id).subscribe({
      next: (res: any) => {
        this.dataKebVitrase = res.details;
        this.totKebutuhanVitrase = res.total_kebutuhan_vitrase;
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.focusNextInput();
      event.preventDefault();
    }
    if (event.key === 'Insert') {
      if (this.formRef) {
        this.onSimpan(this.formRef);
        event.preventDefault();
      }
    }
  }

  focusNextInput(): void {
    const inputs = this.inputFields.toArray();
    const activeIndex = inputs.findIndex(input => input.nativeElement === document.activeElement);
    const nextInput = inputs[(activeIndex + 1) % inputs.length];
    nextInput?.nativeElement.focus();
    nextInput?.nativeElement.select();
  }

  private initDetailProjek(): DetailProjek {
    return {
      id: 0,
      id_project_header: 0,
      lebar_bahan: 0,
      lantai: '',
      ruangan: '',
      bed: '',
      tipe: '',
      uk_room_l: 0,
      uk_room_p: 0,
      uk_room_t: 0,
      stik: 0,
      elevasi: 0,
      tinggi_vitrase: 0,
      tinggi_lipatan: 0,
      nilai_pembagi: 0,
      created_by: '',
      created_date: '',
      updated_by: '',
      updated_date: '',
      is_deleted: 0,
      dataDetailBahan: undefined,
      expanded: false
    };
  }
}
