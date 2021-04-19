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
      let result = values.filter(
        (v) =>
          v &&
          keys.some((k) => {
            if(v[k] && v[k].constructor && v[k].constructor.name !== 'Object') {
              return v[k] && v[k].toString().toUpperCase().indexOf(filter) >= 0;
            }
            else{
              if(v[k]){
                let b = Object.keys(v[k]).some((e)=>{
                  return v[k] && v[k][e] && v[k][e].toString().toUpperCase().indexOf(filter) >= 0;
                })
                return b;
              }
            }
          })
      );
      return result;
    }
  }
}
