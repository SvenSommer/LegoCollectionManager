import { Component, EventEmitter, Input, Output, OnInit, OnChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalPopupComponent } from '../popup/modal-popup/modal-popup.component';
declare var $: any;

@Component({
  selector: 'ng-table',
  templateUrl: './ng-table.component.html',
  providers: [DatePipe],
  styles: [`
  .wrapper1, .wrapper2 { width: 100%;overflow-x: auto!important ; overflow-y: hidden; }
  .wrapper1 { height: 20px; }
  .div1  { height: 20px; }
  .div2  { overflow: none}
  .table {
    width: 100%;
    margin-bottom: 1rem;
    color: #858796;
  }`]

})

export class NgTableComponent implements OnInit, OnChanges {
  constructor(private datePipe: DatePipe) { }
  public page = 1;
  //   @Input() public itemsPerPage = UserConfigurationService.PageSize;
  @Input() public itemsPerPage = 10;
  public maxSize = 5;
  public numPages = 1;
  public length = 0;

  //Table values
  public rows: Array<any> = [];
  @Input() public data: any = [];
  @Input() public allowPaging = true;
  @Input() public isHeaderVisible = true;
  @Input() public visibleWhenData = false;
  @Input() public isEditVisible = true;
  @Input() public editButtonText = 'Edit';
  @Input() public editClass = 'fas fa-edit';

  //1-Page Complete
  @Input() public isDeleteVisible = false;
  @Input() public isActionVisible = false;

  @Input() public IsPageSizeChangeAllow = true;
  @Input() public maxPaginationSize = 4;
  @Input() public ActionWidth = '';

  // Outputs (Events)
  @Output() public rowEditClick: EventEmitter<any> = new EventEmitter();
  @Output() public rowCellClick: EventEmitter<any> = new EventEmitter();
  @Output() public rowDeleteClick: EventEmitter<any> = new EventEmitter();

  public imgPopupURL = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  @Input()
  public set columns(values: Array<any>) {
    values.forEach((value: any) => {
      const column = this._columns.find((col: any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });

    this.config.paging = this.allowPaging;
  }

  public config: any = {
    paging: this.allowPaging,
    className: ['table-striped', 'table-bordered']
  };

  public ngOnInit(): void {
    this.onChangeTable(this.config);
  }

  public ngOnChanges(changes: any): void {
    if (changes != null && changes.data != null && changes.data.currentValue != null) {
      this.onChangeTable(this.config);
    }
  }

  public get columns(): Array<any> {
    return this._columns;
  }

  private _columns: Array<any> = [];

  public onChangeTable(column: any): void {
    this.rows = this.page && this.config.paging ? this.changePage(this.page, this.data) : this.data;
    this.length = this.data.length;

  }

  public onImgClick(row, column) {
    this.imgPopupURL = row.image_url ?? row.thumbnail_url;
    this.imagePopup.open();
  }

  public getData(row: any, column: any, index: number): any {
    var cellData = column.name.split('.').reduce((prev: any, curr: string) => prev[curr], row);
    if (column.datatype == undefined || column.datatype == null || column.datatype.type == undefined || column.datatype.type == null) {
      return cellData;
    }
    else if (column.datatype.type == 'number') {
      return Number(cellData);
    }
    else if (column.datatype.type == 'price') {
      return cellData.replace('.',',') + ' €';
    }
    else if (column.datatype.type == 'date' && cellData) {
      // return this.datePipe.transform(new Date(cellData), this.sharedService.variables.dateFormat);
      return this.datePipe.transform(new Date(cellData), 'dd.MM.yyyy');
    }
    else if (column.datatype.type == 'datetime' && cellData) {
      return this.datePipe.transform(new Date(cellData), 'dd.MM.yyyy HH:mm');
    }
    else if (column.datatype.type == 'images') {
     // let object =  JSON.parse(cellData);
      return cellData
    }
    else {
      return cellData;
    }
  }


  public changePage(page: any, data: Array<any> = this.data): Array<any> {
    const start = (page - 1) * this.itemsPerPage;
    const end = this.itemsPerPage > -1 ? (start + Number(this.itemsPerPage)) : data.length;
    return data.slice(start, end);
  }

  public onPageNoClick(event: any): void {
    this.page = event;
  }

  public onRowEditClick(event: any): void {
    this.rowEditClick.emit(event);
  }

  public onImgPopupClose() {
    this.imgPopupURL = '';
  }
}