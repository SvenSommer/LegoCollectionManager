import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-images-cell',
  templateUrl: './images-cell.component.html',
  styleUrls: ['./images-cell.component.css']
})
export class ImagesCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
    if (params.value instanceof Array) {
    } else {
      params.value = [params.value];
    }
  }

  refresh(): boolean {
    return true;
  }

  constructor() { }

}
