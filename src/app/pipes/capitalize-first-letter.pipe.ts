import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter',
  standalone: false
})
export class CapitalizeFirstLetterPipe implements PipeTransform {

  transform(value: string | null): string | null | undefined {
    if (!value) {
      return;
    }
    return value?.charAt(0).toUpperCase() + value?.substring(1, value.length);
  }

}
