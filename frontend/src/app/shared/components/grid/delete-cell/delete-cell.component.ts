import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-delete-cell',
  templateUrl: './delete-cell.component.html',
  styleUrls: ['./delete-cell.component.css']
})
export class DeleteCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return true;
  }

  constructor() { }

  rowDeleteClick() {
    this.params.context.onRowDeleteClick(this.params.data.id);
  }
}
