import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngFilter',
})
export class NgFilterPipe implements PipeTransform {
  transform(values: any[], filter: string, data: any[]): any {
    values = [];
    values = data;
    if (!values || !values.length) return [];
    if (!filter) return values;

    filter = filter.toUpperCase();
    if (filter && Array.isArray(values)) {
      const keys = Object.keys(values[0]);

      return values.filter(
        (v) =>
          v &&
          keys.some(
            (k) => v[k] && v[k].toString().toUpperCase().indexOf(filter) >= 0
          )
      );
    }
  }
}
