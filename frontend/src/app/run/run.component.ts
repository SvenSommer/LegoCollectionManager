import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RunModel } from '../models/run-model';
import { RunService } from '../services/run.service';
import { RunEditComponent } from './run-edit/run-edit.component';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';

@Component({
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.css']
})
export class RunComponent implements OnInit {

  constructor(private runService: RunService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {} 

  public columns = [
  { title: 'Run #', name: 'run_no', size: '5%', minSize: '50'},
  { title: 'Collection', name: 'name', size: '50', minSize: '50'},
  { title: 'Collectionid', name: 'collection_id', size: '50', minSize: '50'},
  { title: 'Sorter', name: 'sorterinfo.name', size: '5%', minSize: '50'},
  { title: 'Status', name: 'status.name', size: '80', minSize: '80' },
  { title: 'Updated', name: 'status.created', size: '50', minSize: '50', datatype: { type: 'datetime' } },
  { title: 'Created', name: 'created', size: '50', minSize: '50', datatype: { type: 'date' } }
]
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
  this.runEdit.open();
}

onEditClick(data) {
  this.router.navigateByUrl("/rundetail/" + data.run_id).then((bool) => { }).catch()
}

onRowDeleteClick(model) {
  let options = {
    title: 'Are you sure you want to delete this?',
    confirmLabel: 'Okay',
    declineLabel: 'Cancel'
  }
  this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
    if (res) {
      console.log('Okay');
      this.runService.deleteRun(model.id).subscribe(
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

onRowEditClick(data) {
  this.runEdit.open();
}

}
