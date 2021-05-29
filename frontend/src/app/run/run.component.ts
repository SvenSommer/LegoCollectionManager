import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RunModel } from '../models/run-model';
import { RunService } from '../services/run.service';
import { RunEditComponent } from './run-edit/run-edit.component';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import {ImagesCellComponent} from "../shared/components/grid/images-cell/images-cell.component";
import {TextCellComponent} from "../shared/components/grid/text-cell/text-cell.component";

@Component({
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.css']
})
export class RunComponent implements OnInit {

  constructor(private runService: RunService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {}

  public rows: Array<any> = [];
  public columns = [
    {
      headerName: 'Run #',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'run_no',
      filter: 'agNumberColumnFilter',
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Collection',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'name',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Collectionid',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'collection_id',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Sorter',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'sorterinfo.name',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Status',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'status.name',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Updated',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'status.created',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
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

@ViewChild('runEdit') runEdit: RunEditComponent;
ngOnInit(): void {
  this.bindData();
}

bindData() {
  this.runService.getRuns().subscribe(
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

editRun(id) {
  // this.runEdit.open();
  this.router.navigateByUrl("/addRun");
}

onEditClick(id) {
  this.router.navigateByUrl('/rundetail/' + id).then((bool) => { }).catch()
}

onRowDeleteClick(id) {
  let options = {
    title: 'Are you sure you want to delete this?',
    confirmLabel: 'Okay',
    declineLabel: 'Cancel'
  }
  this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
    if (res) {
      console.log('Okay');
      this.runService.deleteRun(id).subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code == 200) {
             // Message should be data.body.message
             this.toastr.success("Record Deleted Successfully.");
             this.bindData();
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
    } else {
      console.log('Cancel');
    }
  });
}

addNewRun(newData: RunModel) {
  this.bindData();
}

onRowClick(data) {
  // this.router.navigateByUrl('/rundetail/' + data.data.run_id);
  this.router.navigateByUrl('/label/' + data.data.run_id);
}

onRowEditClick(data) {
  this.runEdit.open();
}

}
