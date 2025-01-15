import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeparator',
  standalone: true
})
export class ThousandSeparatorPipe implements PipeTransform {
  transform(value: number | string | undefined): string {
    if (value === null || value === undefined || value === '') {
      return ''; // or return '0' or another default value if preferred
    }

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) {
      return value.toString();
    }

    return numberValue.toLocaleString('en-US'); // Adjust locale if needed
  }
}
