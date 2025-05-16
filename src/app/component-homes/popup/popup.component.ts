import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  isVisible:boolean = false;
  message: string = '';
  header: string = '';
  show(message: string) {
    this.header = 'Informasi'; // The title for the modal dialog
    this.message = message;
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
