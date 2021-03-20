import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RunService } from '../services/run.service';

@Component({
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.css']
})
export class RunComponent implements OnInit {

  constructor(private runService: RunService,
    private router: Router) {} 

  public columns = [
  { title: 'Run #', name: 'no', size: '5%', minSize: '50'},
  { title: 'Collection', name: 'collection_name', size: '50', minSize: '50'},
  { title: 'Collectionid', name: 'collection_id', size: '50', minSize: '50'},
  { title: 'Sorter', name: 'sorter_name', size: '5%', minSize: '50'},
  { title: 'Parts unidentified', name: 'parts_unidentified', size: '5%', minSize: '40' },
  { title: 'Parts deleted', name: 'parts_deleted', size: '30', minSize: '40' },
  { title: 'Parts identified', name: 'parts_identified', size: '30', minSize: '40' },
  { title: 'unique Parts identified ', name: 'parts_uniquepartsidentified', size: '40', minSize: '40' },
  { title: 'Status', name: 'status_name', size: '80', minSize: '80' },
  { title: 'Updated', name: 'status_created', size: '50', minSize: '50', datatype: { type: 'date' } },
  { title: 'Created', name: 'created', size: '50', minSize: '50', datatype: { type: 'date' } }
]
public data: any;

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

}
