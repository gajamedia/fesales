import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible" class="fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 bg-gray-800 text-white rounded-md shadow-lg max-w-sm text-center flex items-center justify-between"
      [ngClass]="{
        'bg-green-500': type === 'success',
        'bg-red-500': type === 'error',
        'bg-blue-500': type === 'info'
      }"
      (click)="dismiss()">
      <span>{{ message }}</span>
      <button class="ml-4 bg-transparent text-white hover:text-gray-300" (click)="dismiss()">&times;</button>
    </div>
  `,
  styles: []
})
export class SnackbarComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() duration: number = 3000;

  isVisible: boolean = false;

  ngOnInit(): void {
    this.show();
  }

  show() {
    this.isVisible = true;
    setTimeout(() => this.dismiss(), this.duration);
  }

  dismiss() {
    this.isVisible = false;
  }
}
