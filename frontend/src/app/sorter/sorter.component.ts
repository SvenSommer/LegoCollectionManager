import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SorterModel } from '../models/sorter-model';
import { SorterService } from '../services/sorter.service';
import { SorterEditComponent } from './edit/sorter-edit.component';

@Component({
  selector: 'app-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: ['./sorter.component.css']
})
export class SorterComponent implements OnInit {

  constructor(private runService: SorterService,
    private router: Router) {} 

    public columns = [
      { title: '#', name: 'id', size: '5%', minSize: '50'},
      { title: 'Name', name: 'name', size: '50', minSize: '50'},
      { title: 'Pusher Total Count', name: 'pusher_total', size: '50', minSize: '50'},
      { title: 'Pusher Planned', name: 'pusher_planned', size: '50', minSize: '50'},
      { title: 'Pusher Planned', name: 'pusher_ready', size: '50', minSize: '50'},
      { title: 'Pusher Planned', name: 'pusher_damaged', size: '50', minSize: '50'},
      { title: 'Pusher Planned', name: 'pusher_removed', size: '50', minSize: '50'},
      { title: 'Status', name: 'status', size: '50', minSize: '50'},
      { title: 'Created', name: 'created', size: '50', minSize: '50', datatype: { type: 'date' } }
    ]
    public data: any;

    @ViewChild('sorterEdit') sorterEdit: SorterEditComponent;
    ngOnInit(): void {
      this.bindData();
    }
    
    bindData() {
      this.runService.getSorters().subscribe(
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

    addNewSorter(newData: SorterModel) {
      this.bindData();
    }

    onRowEditClick(data) {
      this.sorterEdit.open();
    }

}
