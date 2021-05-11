import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-text-cell',
  templateUrl: './text-cell.component.html',
  styleUrls: ['./text-cell.component.css']
})
export class TextCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return true;
  }

  constructor() { }

}
