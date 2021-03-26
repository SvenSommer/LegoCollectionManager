import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SorterModel } from '../models/sorter-model';
import { SorterService } from '../services/sorter.service';
import { SorterEditComponent } from './edit/sorter-edit.component';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';

@Component({
  selector: 'app-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: ['./sorter.component.css']
})
export class SorterComponent implements OnInit {

  constructor(private sorterService: SorterService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {} 

    public columns = [
      { title: '#', name: 'id', size: '5%', minSize: '50'},
      { title: 'Name', name: 'name', size: '50', minSize: '50'},
      { title: 'Current Run', name: 'current_run_name', size: '50', minSize: '50'},
      { title: 'Pusher Total Count', name: 'pusher_total', size: '50', minSize: '50', datatype: { type: 'number' } },
      { title: 'Pusher Planned', name: 'pusher_planned', size: '50', minSize: '50', datatype: { type: 'number' }},
      { title: 'Pusher Ready', name: 'pusher_ready', size: '50', minSize: '50', datatype: { type: 'number' }},
      { title: 'Pusher damaged', name: 'pusher_damaged', size: '50', minSize: '50', datatype: { type: 'number' }},
      { title: 'Pusher removed', name: 'pusher_removed', size: '50', minSize: '50', datatype: { type: 'number' }},
      { title: 'Status', name: 'status', size: '50', minSize: '50'},
      { title: 'Created', name: 'created', size: '50', minSize: '50', datatype: { type: 'date' } }
    ]
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
      this.router.navigateByUrl("/sortersdetail/" + data.id).then((bool) => { }).catch()
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
          this.sorterService.deleteSorter(model.id).subscribe(
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

    addNewSorter(newData: SorterModel) {
      this.bindData();
    }

    onRowEditClick(data) {
      this.sorterEdit.open();
    }

}
