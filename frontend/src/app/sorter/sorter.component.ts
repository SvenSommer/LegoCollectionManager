import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SorterModel } from '../models/sorter-model';
import { SorterService } from '../services/sorter.service';
import { SorterEditComponent } from './edit/sorter-edit.component';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import {ImagesCellComponent} from "../shared/components/grid/images-cell/images-cell.component";
import {TextCellComponent} from "../shared/components/grid/text-cell/text-cell.component";

@Component({
  selector: 'app-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: ['./sorter.component.css']
})
export class SorterComponent implements OnInit {

  constructor(private sorterService: SorterService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {}

  public rows: Array<any> = [];
  public columns = [
    {
      headerName: '#',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'id',
      filter: 'agNumberColumnFilter',
      width: '40'
    }, {
      headerName: 'Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'name',
      filter: true,
      flex: 3,
      minWidth: '80'
    }, {
      headerName: 'Current Run',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'current_run_name',
      filter: true,
      flex: 3,
      minWidth: '80'
    }, {
      headerName: 'Pusher Total Count',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'pusher_total',
      filter: true,
      flex: 3,
      minWidth: '80'
    }, {
      headerName: 'Pusher Planned',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'pusher_planned',
      filter: true,
      flex: 3,
      minWidth: '80'
    }, {
      headerName: 'Pusher Ready',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'pusher_ready',
      filter: true,
      flex: 3,
      minWidth: '80'
    }, {
      headerName: 'Pusher damaged',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'pusher_damaged',
      filter: true,
      flex: 3,
      minWidth: '80'
    }, {
      headerName: 'Pusher removed',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'pusher_removed',
      filter: true,
      flex: 3,
      minWidth: '80'
    }, {
      headerName: 'Status',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'status',
      filter: true,
      flex: 3,
      minWidth: '80'
    }, {
      headerName: 'Created',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'created',
      filter: true,
      flex: 3,
      minWidth: '80'
    }
  ];
    public data: any;

    @ViewChild('sorterEdit') sorterEdit: SorterEditComponent;
    ngOnInit(): void {
      this.bindData();
    }

    bindData() {
      this.sorterService.getSorters().subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code == 200) {
              this.data = data.body.result;
              this.rows = this.data;
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

    editSorter(id) {
      this.sorterEdit.open();
    }

    onEditClick(data) {
      this.router.navigateByUrl("/sortersdetail/" + data.data.id).then((bool) => { }).catch()
    }

    onRowDeleteClick(id) {
      const options = {
        title: 'Are you sure you want to delete this?',
        confirmLabel: 'Okay',
        declineLabel: 'Cancel'
      }
      this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
        if (res) {
          console.log('Okay');
          this.sorterService.deleteSorter(id).subscribe(
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

    addNewSorter(newData: SorterModel) {
      this.bindData();
    }

    onRowEditClick(data) {
      this.sorterEdit.open();
    }

}
