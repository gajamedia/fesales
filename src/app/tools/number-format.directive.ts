import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberFormat]',
  standalone: true
})
export class NumberFormatDirective {
  private regex: RegExp = new RegExp(/^\d+(\.\d{0,2})?$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value.replace(/[\.,]/g, '');
    const position: number = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key, current.slice(position)].join('');

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value.replace(/,/g, '.').replace(/\./g, '');

    this.el.nativeElement.value = this.formatNumber(initialValue);
    this.control.control?.setValue(this.el.nativeElement.value ?? '');

    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  private formatNumber(value: string): string {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
  }
}
