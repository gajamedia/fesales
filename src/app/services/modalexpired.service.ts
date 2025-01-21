import { Injectable } from '@angular/core';
import { ModaltokenexpiredComponent } from '../modals/modaltokenexpired.component';


@Injectable({
  providedIn: 'root'
})
export class ModalExpiredService {
  private modal!: ModaltokenexpiredComponent;

  setModal(modal: ModaltokenexpiredComponent) {
    this.modal = modal;
  }

  showModal() {
    if (this.modal) {
      this.modal.show();
    }
  }

  getModal(): ModaltokenexpiredComponent {
    return this.modal;
  }
}
