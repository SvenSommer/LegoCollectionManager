import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { OfferService } from '../services/offer.service';
import {ImagesCellComponent} from '../shared/components/grid/images-cell/images-cell.component';
import {TextCellComponent} from '../shared/components/grid/text-cell/text-cell.component';
import {DescriptionCellComponent} from '../shared/components/grid/description-cell/description-cell.component';
import {DeleteCellComponent} from '../shared/components/grid/delete-cell/delete-cell.component';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  public rows: Array<any> = [];
  public columns = [
    {
      headerName: 'Images', field: 'imageUrls',
      autoHeight: true,
      resizable: true,
      cellRendererFramework: ImagesCellComponent,
      flex: 1,
      minWidth: '200'
    },
    {
      headerName: 'Title',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'offerinfo.title',
      filter: true,
      flex: 1,
      minWidth: '80'
    },
    {
      headerName: 'Description',
      field: 'offerinfo.description',
      autoHeight: true,
      sortable: true,
      filter: true,
      resizable: true,
      cellRendererFramework: DescriptionCellComponent,
      flex: 1,
      minWidth: '120'
    },
    {
      headerName: 'Price',
      cellRendererFramework: TextCellComponent,
      field: 'offerinfo.price',
      flex: 1,
      sortable: true,
      resizable: true,
      filter: 'agNumberColumnFilter',
      minWidth: '50'
    },
    {
      headerName: 'Price Type',
      cellRendererFramework: TextCellComponent,
      field: 'offerinfo.pricetype',
      resizable: true,
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: '70'
    },
    {
      headerName: 'Zip code',
      field: 'offerinfo.zipcode',
      cellRendererFramework: TextCellComponent,
      filter: 'agNumberColumnFilter',
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: '80'
    },
    {
      headerName: 'Locality',
      cellRendererFramework: TextCellComponent,
      field: 'offerinfo.locality',
      filter: true,
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: '90'
    },
    {
      headerName: 'Shipping',
      cellRendererFramework: TextCellComponent,
      field: 'offerinfo.shipping',
      resizable: true,
      filter: true,
      sortable: true,
      flex: 1,
      minWidth: '100'
    },
    {
      headerName: 'Seller',
      cellRendererFramework: TextCellComponent,
      field: 'userinfo.name',
      resizable: true,
      filter: true,
      sortable: true,
      flex: 1, minWidth: '40'
    },
    {
      headerName: 'Category',
      cellRendererFramework: TextCellComponent,
      field: 'userinfo.category',
      resizable: true,
      filter: true,
      sortable: true,
      flex: 1,
      minWidth: '100'
    },
    {
      headerName: 'Offers',
      cellRendererFramework: TextCellComponent,
      field: 'userinfo.sumOffersRecorded',
      resizable: true,
      filter: 'agNumberColumnFilter',
      sortable: true,
      flex: 1,
      minWidth: '75'
    },
    {
      headerName: 'Offer Date',
      field: 'offerinfo.datecreated',
      resizable: true,
      filter: true,
      sortable: true,
      flex: 1,
      minWidth: '95'
    },
    {
      headerName: 'Created',
      field: 'created',
      minWidth: '95',
      filter: true,
      resizable: true,
      sortable: true,
      flex: 1
    },
    {
      headerName: 'Deleted by user',
      field: 'deletedByExtUser',
      resizable: true,
      flex: 1,
      filter: true,
      minWidth: '90'
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRendererFramework: DeleteCellComponent,
      resizable: false,
      width: '60'
    }
  ];

  constructor(private offerService: OfferService,
              private router: Router, private toastr: ToastrService,
              private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

  public data: any;

  ngOnInit(): void {
    this.bindData();
  }

  public bindData() {
    this.offerService.getOffers().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            this.data = data.body.result;
            this.rows = this.data;
            this.rows.forEach(
              row => {
                row.created = this.formatDate(row.created);
                row.offerinfo.datecreated = this.formatDate(row.offerinfo.datecreated);
                row.imageUrls = [];
                row.images.forEach(
                    image => row.imageUrls.push(image.imageurl)
                  );
                console.log(row.imageUrls);
              }
            );
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

  onRowDeleteClick(id) {
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

  onRowClick(data) {
    this.router.navigateByUrl('/offerdetail/' + data.data.id);
  }

  private formatDate(date: string): string {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    return `${month}/${day}/${year}`;
  }

}
