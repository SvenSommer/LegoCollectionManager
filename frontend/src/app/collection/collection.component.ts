import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { CollectionModel } from '../models/collection-model';
import { CollectionService } from '../services/collection.service';
import { CollectionEditComponent } from './edit/collection-edit.component';
import {ImagesCellComponent} from '../shared/components/grid/images-cell/images-cell.component';
import {TextCellComponent} from '../shared/components/grid/text-cell/text-cell.component';
import {DeleteCellComponent} from '../shared/components/grid/delete-cell/delete-cell.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  public rows: Array<any> = [];
  public columns = [
    {
      headerName: 'Images', field: 'collectioninfo.thumbnail_url',
      autoHeight: true,
      resizable: true,
      cellRendererFramework: ImagesCellComponent,
      flex: 1,
      minWidth: '160'
    },
    {
      headerName: 'Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'collectioninfo.name',
      filter: true,
      flex: 1,
      minWidth: '80'
    },
    {
      headerName: 'Description',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'collectioninfo.description',
      filter: true,
      flex: 2,
      minWidth: '80'
    },
    {
      headerName: 'Weight (kg)',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'collectioninfo.weight_kg',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '45'
    },
    {
      headerName: 'Cost',
      field: 'collectioninfo.cost',
      cellRendererFramework: TextCellComponent,
      flex: 1,
      sortable: true,
      resizable: true,
      filter: 'agNumberColumnFilter',
      minWidth: '40'
    },
    {
      headerName: 'Cost per Kilo',
      field: 'collectioninfo.cost_per_kilo',
      cellRendererFramework: TextCellComponent,
      flex: 1,
      sortable: true,
      resizable: true,
      filter: 'agNumberColumnFilter',
      minWidth: '60'
    },
    {
      headerName: 'Seller',
      field: 'collectioninfo.seller',
      cellRendererFramework: TextCellComponent,
      flex: 1,
      sortable: true,
      resizable: true,
      filter: true,
      minWidth: '80'
    },
    {
      headerName: 'Suggested Sets',
      field: 'suggested_sets.sumSet',
      cellRendererFramework: TextCellComponent,
      flex: 1,
      sortable: true,
      resizable: true,
      filter: 'agNumberColumnFilter',
      minWidth: '80'
    },
    {
      headerName: 'Expected Sets',
      field: 'expected_sets.sumSet',
      cellRendererFramework: TextCellComponent,
      flex: 1,
      sortable: true,
      resizable: true,
      filter: 'agNumberColumnFilter',
      minWidth: '80'
    },
    {
      headerName: 'Purchase Date',
      field: 'collectioninfo.purchase_date',
      cellRendererFramework: TextCellComponent,
      minWidth: '60',
      filter: true,
      resizable: true,
      sortable: true,
      flex: 1
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRendererFramework: DeleteCellComponent,
      resizable: false,
      width: '60'
    },
  ];

  constructor(private collectionService: CollectionService,
              private router: Router, private toastr: ToastrService,
              private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

  public data: any;

  @ViewChild('collectionEdit') collectionEdit: CollectionEditComponent;
  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.collectionService.getCollections().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            this.data = data.body.result;
            this.rows = this.data;
            this.rows.forEach(
              row => {
                row.collectioninfo.purchase_date = this.formatDate(row.collectioninfo.purchase_date);
              }
            );
          }
          else if (data.body && data.body.code == 403) {
            this.router.navigateByUrl("/login");
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  editCollection(id) {
    this.collectionEdit.open();
  }

  onRunEditClick(data) {
    this.router.navigateByUrl("/rundetail/" + data.id).then((bool) => { }).catch()
  }

  onRowClick(data) {
    console.log("data.collectioninfo",data.data.collectioninfo)
    this.router.navigateByUrl('/collectiondetail/' + data.data.collectioninfo.id);
  }

  onRowDeleteClick(id) {
    const options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.collectionService.deleteCollection(id).subscribe(
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
      } else {
        console.log('Cancel');
      }
    });
  }

  addNewCollection(newData: CollectionModel) {
    // this.data.push(newData);
    // this.data = Object.assign([],this.data);
    this.bindData();
  }

  private formatDate(date: string): string {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    return `${month}/${day}/${year}`;
  }
}
