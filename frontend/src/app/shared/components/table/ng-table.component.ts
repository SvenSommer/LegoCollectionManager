import { NgFilterPipe } from './ng-filter.pipe';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalPopupComponent } from '../popup/modal-popup/modal-popup.component';
import { NgbdSortableHeader, SortColumn, SortEvent } from './sortable.directive';
import { PartdataService } from 'src/app/services/partdata.service';
import { PartimageService } from 'src/app/services/partimage.service';
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
  constructor(private datePipe: DatePipe, private ngFilterPipe: NgFilterPipe, private partdataService: PartdataService) { }
  public page = 1;
  //   @Input() public itemsPerPage = UserConfigurationService.PageSize;
  @Input() public itemsPerPage = 10;
  public maxSize = 5;
  public numPages = 1;
  public length = 0;
  public searchTerm:string;
  @Input() public inputSearchTerm:string;

  private resultData: Array<any> = [];

  //Table values
  public rows: Array<any> = [];
  @Input() public data: any = [];
  @Input() public allowSearch: boolean;
  @Input() public allowPaging = true;
  @Input() public isHeaderVisible = true;
  @Input() public visibleWhenData = false;
  @Input() public isEditVisible = true;
  @Input() public isAddPartVisible = false;
  @Input() public isRemovePartVisible = false;
  @Input() public isDownloadVisible = false;
  @Input() public editButtonText = 'Edit';
  @Input() public downloadButtonText = 'Download';
  @Input() public editClass = 'fas fa-edit';
  @Input() public downloadClass = 'fas fa-download';

  //1-Page Complete
  @Input() public isDeleteVisible = false;
  @Input() public isActionVisible = false;

  @Input() public IsPageSizeChangeAllow = true;
  @Input() public maxPaginationSize = 4;
  @Input() public ActionWidth = '';

  // Outputs (Events)
  @Output() public rowAddeSortedPartClick: EventEmitter<any> = new EventEmitter();
  @Output() public rowRemoveSortedPartClick: EventEmitter<any> = new EventEmitter();
  @Output() public rowEditClick: EventEmitter<any> = new EventEmitter();
  @Output() public rowCellClick: EventEmitter<any> = new EventEmitter();
  @Output() public rowDownloadClick: EventEmitter<any> = new EventEmitter();
  @Output() public rowDeleteClick: EventEmitter<any> = new EventEmitter();

  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;


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
    this.resultData = this.data;
    this.allowSearch = !this.allowSearch ? this.allowSearch : true;
    this.onChangeTable(this.config);
  }

  public ngOnChanges(changes: any): void {
    if (changes != null && changes.data != null && changes.data.currentValue != null) {
      this.onChangeTable(this.config);
    }
    if(this.inputSearchTerm){
      this.search(this.resultData,this.inputSearchTerm) ;
      this.searchTerm = this.inputSearchTerm
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
    this.imgPopupURL = row.image_url ?? row.thumbnail_url ?? row.setinfo.image_url;
    this.imgPopupName = [row?.no, row?.name, row?.color_name].join(' - ');
    this.imagePopup.open();
  }

  public getValue(row: any, column: any, index: number): any {
    var cellData = column.label.split('.').reduce((prev: any, curr: string) => prev[curr], row);
    return cellData;
  }
  public getData(row: any, column: any, index: number): any {
    var cellData = 'unknown';
    cellData = column.name.split('.').reduce((prev: any, curr: string) => prev[curr], row);
    if (column.datatype == undefined || column.datatype == null || column.datatype.type == undefined || column.datatype.type == null) {
      return cellData;
    }
    else if (column.datatype.type == 'number') {
      return Number(cellData);
    }
    else if (column.datatype.type == 'price') {
      return parseFloat(cellData).toFixed(2).replace(".",",") + ' €';
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
    else if (column.datatype.type == 'percentage') {
      // let object =  JSON.parse(cellData);
       return cellData
     }
    else {
      return cellData;
    }
  }

  public getRes(cellData){
    let object =  JSON.parse(cellData);
    return cellData
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

  public onRowClick($event, ev: any): void {
    if($event.srcElement.nodeName.toLowerCase() == 'td'){
      this.partdataService.rowData.emit(ev);
    }
  }

  public onDownloadClick(event: any): void {
    this.partdataService.downloadData.emit(event);
  }

  public rowRemovePart(event: any): void {
    this.rowRemoveSortedPartClick.emit(event);
  } 

  public rowAddPart(event: any): void {
    this.rowAddeSortedPartClick.emit(event);
  }

  public onImgPopupClose() {
    this.imgPopupURL = '';
    this.imgPopupName = '';
  }

  public onSort({column, direction}: SortEvent, columnType: any) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.rows = this.sort(this.data,column,direction,columnType);
    this.data = this.rows;
    this.onChangeTable(this.config);
  }


  private compare(a: any,b: any, columnType: any){
    if(columnType && columnType.datatype && columnType.datatype.type == 'date'){
        let date1 = new Date(a);
        let date2 = new Date(b);
        if (date1 > date2) { return 1; }
        else if (date1 < date2) { return -1; }
        else { return 0; }
    }
    else{
      if(!isNaN(parseFloat(a))){
        if (a==b){
          return (b-a);
        } else {
          return (a-b);
        }
      }
      else{
        return (a < b ? -1 : (a > b ? 1 : 0));
      }
    }
  }

  private sort(rows: any, column: SortColumn, direction: string, columnType: any): any {
    if (direction === '' || column === '') {
      return this.resultData;
    } else {0
      return [...rows].sort((a, b) => {
        const aVal = this.getKeyValue(a,column ? column : '');
        const bVal = this.getKeyValue(b,column ? column : '');
        const res = this.compare(aVal, bVal,columnType);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  getKeyValue(o, s) {
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, '');           // strip a leading dot
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (k in o) {
              o = o[k];
          } else {
              return;
          }
      }
      return o;
  }

  clear(rows) {
    this.search(rows,'')
  }

  public search(rows: any, searchText: any): any{
    this.onSort({} as SortEvent, '');
    if(searchText){
      this.rows = this.ngFilterPipe.transform(rows,searchText,this.resultData);
      this.data = this.rows;
    }
    else{
      this.data = this.resultData;
    }
    this.onChangeTable(this.config);
  }
}
