import {Component, ViewEncapsulation} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-description-cell',
  templateUrl: './description-cell.component.html',
  styleUrls: ['./description-cell.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DescriptionCellComponent  implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return true;
  }

  constructor() { }

}
