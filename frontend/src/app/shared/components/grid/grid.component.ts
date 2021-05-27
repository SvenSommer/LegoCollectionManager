import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-offer-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnInit, AfterViewInit {
  @Input() rows: any;
  @Input() columnDef: any;
  @ViewChild('offerGrid') offerGrid;
  @Output() rowClick = new EventEmitter<number>();
  @Output() rowClickid = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<number>();

  ngOnInit(): void {
    //console.log('init');
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.offerGrid.api.resetRowHeights(), 3000);
  }

  public onRowDeleteClick = (id) => {
    this.deleteClick.emit(id);
  }

  onRowClick(data) {
    if (data.column.colId !== 'action') {
      this.rowClick.emit(data);
    }
  }
}
