import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-text-cell',
  templateUrl: './title-cell.component.html',
  styleUrls: ['./title-cell.component.css']
})
export class TitleCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return true;
  }

  constructor() { }

}
