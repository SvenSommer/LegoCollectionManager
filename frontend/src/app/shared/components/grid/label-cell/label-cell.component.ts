import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-label-cell',
  templateUrl: './label-cell.component.html',
  styleUrls: ['./label-cell.component.css']
})
export class LabelCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return true;
  }

  constructor() { }

  rowLabelClick() {
    this.params.context.onRowLabelIconClick(this.params.data);
  }

}
