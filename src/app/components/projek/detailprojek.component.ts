import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedloginService } from '../../services/sharedlogin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjekService } from '../../services/projek.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Bahan, DetailBahan, DetailProjek, Projek } from '../../interfaces/global.interface';
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
  dataProjek: any = {}
  currentPage: number = 1
  totalPages!: number
  page: number = 1
  dataBaris: number[] = [10, 25, 50, 100]
  selectedPageSize: number = this.dataBaris[0]
  pageSize!: number
  search = ''
  dataLogin: any = {}
  isRole: boolean = false

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
  editMode: boolean = false;
  editedItemId: string | null = null;

  mode: boolean = false
  visible: boolean = false
  isNongolMessage: boolean = false
  messageText: string = ""

  dataDetailProjek: DetailProjek[] = [];
  expandedRows: { [key: number]: any[] } = {};
  editedBahan: any

  showAddBahanModal: boolean = false;
  selectedDetailProjekId: number | null = null;
  dataBahan: Bahan[] = []
  dataKebKain: any[] = []
  dataKebVitrase: any[] = []
  totKebutuhanKain: any
  totKebutuhanVitrase: any

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

  ngOnDestroy() {
    this.shareddetailprojekService.clearData('editDetailProjek');
  }

  ngOnInit(): void {
    this.pageSize = this.selectedPageSize
    this.sharedloginService.getProfileData().subscribe(data => {
      this.dataLogin = data;
    });
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.loadDataProjekBy(this.projectId);
      this.loadDataDetailProjek(this.projectId)
    }
  }

  loadDataProjekBy(id: any) {
    this.projekService.getID(id).subscribe({
      next: (res: any) => {
        this.dataProjek = res || {};
      },
      error: (e: any) => {
        console.error(e);
        this.dataProjek = {};
      }
    });
  }

  loadDataDetailProjek(id: any) {
    this.detailprojekService.getbyIdDetailProjek(id).subscribe({
      next: (res: any) => {
        this.dataDetailProjek = res.results
      },
      error: (e: any) => console.error(e)
    })
  }

  onSimpan(form: any) {
    if (form.valid) {
      const d = { ...this.inputDetailProjek, id_project_header: this.projectId };
      this.detailprojekService.create(d).subscribe({
        next: () => {
          this.showMessage('Simpan Data Sukses');
          this.loadDataDetailProjek(this.projectId);
          this.refreshData(form);
        },
        error: () => this.showMessage('Failed to save project!')
      });
    } else {
      this.showMessage('isian wajib diisi Failed to save project!');
    }
  }

  onEdit(id: any): void {
    const item = this.dataDetailProjek.find((d: any) => d.id === id);
    if (item) {
      this.visible = true;
      this.editMode = true;
      this.editedItemId = id;
      this.inputDetailProjek = { ...item };
    }
  }

  onDeleted(id: any): void {
    const d = { is_deleted: 1 };
    this.detailprojekService.deletedby(id, d).subscribe({
      next: () => {
        this.loadDataDetailProjek(this.projectId);
        this.router.navigate(['/main/projek'])
      },
      error: (e: any) => console.log(e)
    });
  }

  onUpdate(form: any) {
    if (form.valid) {
      const d = { ...this.inputDetailProjek };
      let id = this.inputDetailProjek.id;
      this.detailprojekService.update(id, d).subscribe({
        next: () => {
          this.showMessage('Update Data Sukses');
          this.router.navigate(['/main/detailprojek']);
          this.refreshData(form)
        },
        error: (e) => {
          if (e.error) console.error('Backend error:', e.error);
          else console.error('Error', 'Simpan Data Error.');
        }
      })
    }
  }

  onCancel() {
    this.shareddetailprojekService.clearData('editDetailProjek');
    this.router.navigate(['/main/projek'])
  }

  formatTglView(tgl: any) {
    return dayjs(tgl).format('DD/MM/YYYY')
  }

  refreshData(form?: any) {
    this.inputDetailProjek = {
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
  }

  toggleSubtable(id: any) {
    if (this.expandedRows[id]) delete this.expandedRows[id];
    else {
      this.fetchDetailBahan(id);
      this.loadKebutuhanKain(id);
      this.loadKebutuhanVitrase(id);
    }
  }

  trackByFn(index: number, item: any): number {
    return item.item_code;
  }

  fetchDetailBahan(id: any) {
    this.detailbahanService.getbyIdDetailProjek(id).subscribe({
      next: (res: any) => this.expandedRows[id] = res.results,
      error: (error) => console.error("Gagal mengambil data subtable:", error)
    });
  }

  showMessage(t: string): void {
    this.isNongolMessage = true;
    this.messageText = t
    setTimeout(() => this.isNongolMessage = false, 3000);
  }

  loadDataBahan() {
    this.bahanService.getAll("", 1, 100).subscribe({
      next: (res: any) => this.dataBahan = res.results
    })
  }

  addDetailBahan(id: number) {
    this.selectedDetailProjekId = id;
    this.loadDataBahan();
    this.showAddBahanModal = true;
  }

  simpanChecklistBahan(projectDetailId: number | null) {
    if (projectDetailId === null) return;

    const selectedItems = this.dataBahan.filter((b: any) => b.selected);
    for (let item of selectedItems) {
      const newDetail: DetailBahan = {
        item_id: item.id,
        item_code: item.item_code,
        item_name: item.item_name,
        ukuran: item.ukuran,
        harga_beli: item.harga_beli,
        harga_jual: item.harga_jual,
        id_project_detil: projectDetailId
      };
      this.detailbahanService.create(newDetail).subscribe(() => {
        this.loadKebutuhanKain(projectDetailId);
        this.loadKebutuhanVitrase(projectDetailId);
      });
    }

    this.showAddBahanModal = false;
    this.dataBahan.forEach((b: any) => b.selected = false);
  }

  loadKebutuhanKain(id: any) {
    this.detailprojekService.getkain(id).subscribe({
      next: (res: any) => {
        this.dataKebKain = res.details;
        this.totKebutuhanKain = res.total_kebutuhan_kain;
      }
    })
  }

  loadKebutuhanVitrase(id: any) {
    this.detailprojekService.getvitrase(id).subscribe({
      next: (res: any) => {
        this.dataKebVitrase = res.details;
        this.totKebutuhanVitrase = res.total_kebutuhan_vitrase;
      }
    })
  }
}
