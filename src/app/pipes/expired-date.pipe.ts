import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expiredDate',
  standalone: false
})
export class ExpiredDatePipe implements PipeTransform {

  constructor (private date: DatePipe) {}

  transform(value: Date | null): string | null {
    if (!value) {
      return 'Nessuna data di scadenza';
    } 
    return `Scadenza ${this.date.transform(value)}`;
  }

}
