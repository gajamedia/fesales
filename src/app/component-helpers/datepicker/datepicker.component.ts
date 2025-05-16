import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements OnInit {
  @Output() dateChange = new EventEmitter<Date>();
  
  MONTH_NAMES: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  showDatepicker = false;
  datepickerValue = '';
  month = 0;
  year = 0;
  no_of_days: number[] = [];
  blankdays: number[] = [];

  ngOnInit(): void {
    this.initDate();
  }
  toggleDatepicker() {
    this.showDatepicker = !this.showDatepicker;
    console.log('Datepicker visibility:', this.showDatepicker);
  }
  initDate(): void {
    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.datepickerValue = today.toDateString();
    this.getNoOfDays();
  }

  isToday(date: number): boolean {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString();
  }

  getDateValue(date: number): void {
    const selectedDate = new Date(this.year, this.month, date);
    this.datepickerValue = selectedDate.toDateString();
    this.dateChange.emit(selectedDate); // Ensure this line is emitting the event
    this.showDatepicker = false;
  }

  getNoOfDays(): void {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const dayOfWeek = new Date(this.year, this.month).getDay();

    this.blankdays = Array.from({ length: dayOfWeek }, (_, i) => i + 1);
    this.no_of_days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }
  onDateChange(event: any) {
    const selectedDate = new Date(event.target.value);
    this.dateChange.emit(selectedDate);
  }
  value: string = ''; // Internal value of the datepicker
  onChange = (value: any) => {};
  onTouched = () => {};

  // Called when the form control value is written to the component
  writeValue(value: any): void {
    this.value = value;
  }

  // Registers a callback function to handle value changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registers a callback function to handle touch interactions
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Called when the user changes the input
  onInputChange(value: string) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
  
  handleOutsideClick(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.relative');
    if (!clickedInside) {
      this.showDatepicker = false;
    }
  }
}
