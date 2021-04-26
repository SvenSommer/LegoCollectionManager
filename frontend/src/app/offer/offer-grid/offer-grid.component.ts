import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {OfferService} from '../../services/offer.service';
import {Router} from '@angular/router';
import {ImagesCellComponent} from './images-cell/images-cell.component';
import {TitleCellComponent} from './title-cell/title-cell.component';
import {DescriptionCellComponent} from './description-cell/description-cell.component';
import {ToastrService} from 'ngx-toastr';
import {DeleteCellComponent} from './delete-cell/delete-cell.component';
import {NgFilterPipe} from '../../shared/components/table/ng-filter.pipe';

@Component({
  selector: 'app-offer-grid',
  templateUrl: './offer-grid.component.html',
  styleUrls: ['./offer-grid.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OfferGridComponent implements OnInit, AfterViewInit {
  @ViewChild('offerGrid') offerGrid;
  constructor(private offerService: OfferService,
              private toastr: ToastrService,
              private ngFilterPipe: NgFilterPipe,
              private router: Router) {
  }


  public data: any;
  public rows: Array<any> = [];


  public columns = [
    {
      headerName: 'Images', field: 'offerinfo.images',
      autoHeight: true,
      resizable: true,
      cellRendererFramework: ImagesCellComponent,
      flex: 3,
      minWidth: '230'
    },
    {
      headerName: 'Title',
      cellRendererFramework: TitleCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'offerinfo.title',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Description2',
      field: 'offerinfo.description',
      autoHeight: true,
      sortable: true,
      resizable: true,
      cellRendererFramework: DescriptionCellComponent,
      flex: 3,
      minWidth: '120'
    },
    {
      headerName: 'Price',
      field: 'offerinfo.price',
      flex: 1,
      sortable: true,
      resizable: true,
      minWidth: '80'
    },
    {
      headerName: 'Price Type',
      field: 'offerinfo.pricetype',
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: '100'
    },
    {
      headerName: 'Zipcode',
      field: 'offerinfo.zipcode',
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: '80'
    },
    {
      headerName: 'Locality',
      field: 'offerinfo.locality',
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: '60'
    },
    {
      headerName: 'Shipping',
      field: 'offerinfo.shipping',
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: '40'
    },
    {
      headerName: 'Seller',
      field: 'userinfo.name',
      resizable: true,
      sortable: true,
      flex: 1, minWidth: '40'
    },
    {
      headerName: 'Category',
      field: 'userinfo.category',
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: '40'
    },
    {
      headerName: 'Offers',
      field: 'userinfo.sumOffersRecorded',
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: '40'
    },
    {
      headerName: 'Offer Date',
      field: 'offerinfo.datecreated',
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: '60'
    },
    {
      headerName: 'created',
      field: 'created',
      minWidth: '60',
      resizable: true,
      sortable: true,
      flex: 1
    },
    {
      headerName: 'deletedbyUser',
      field: 'deletedByExtUser',
      resizable: true,
      flex: 1,
      minWidth: '60'
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRendererFramework: DeleteCellComponent,
      resizable: true,
      flex: 1,
      minWidth: '60'
    },
  ];

  ngOnInit(): void {
    this.bindData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.offerGrid.api.resetRowHeights(), 3000);
  }

  public onRowDeleteClick = (id) => {
    this.offerService.deleteOffer(id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            // Message should be data.body.message
            this.toastr.success('Record Deleted Successfully.');
            this.bindData();
          }
          else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  public bindData() {
    this.offerService.getOffers().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            this.data = data.body.result;
            this.rows = this.data;
          } else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  onRowClick(data) {
    if (data.column.colId !== 'action') {
      this.router.navigateByUrl('/offerdetail/' + data.data.id);
    }}

  clear() {
    this.rows = this.data;
  }

  public search(rows: any, searchText: any): any{
    if (searchText){
      this.rows = this.ngFilterPipe.transform(rows, searchText, this.data);
    } else {
      this.rows = this.data;
    }
  }

}
