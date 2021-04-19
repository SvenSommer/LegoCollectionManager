import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkSetnumbers'
})
export class LinkSetnumbersPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/"[^"]*"|'[^']*'|(\d{4,5})/g, function(a,b) {return b ? "<a class='badge badge-info'>+ " + b + "</a>" : a;});
  }

}
