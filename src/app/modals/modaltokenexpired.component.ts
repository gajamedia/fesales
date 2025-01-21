import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modaltokenexpired',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modaltokenexpired.component.html',
  //styleUrls: ['./modalexpiredtoken.component.css']
})
export class ModaltokenexpiredComponent {
  isVisible = false;

  @Output() confirm = new EventEmitter<void>();

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  onConfirm() {
    this.confirm.emit();
    this.hide();
  }
}
