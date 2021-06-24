import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RunnedSetService } from '../services/runnedset.service';

@Component({
  selector: 'app-runnedset',
  templateUrl: './runnedset.component.html',
  styleUrls: ['./runnedset.component.css']
})
export class RunnedSetComponent implements OnInit {

  public data: any;
  public columns = [
    { title: 'Run', name: 'runinfo.title', size: '65', minSize: '65' },
    { title: 'Image', name: 'setinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Number', name: 'setinfo.no', size: '5%', minSize: '50'},
    { title: 'Name', name: 'setinfo.name', size: '30%', minSize: '120' },
    { title: 'Category', name: 'setinfo.category_name', size: '30', minSize: '120' },
    { title: 'Year', name: 'setinfo.year', size: '30', minSize: '50' },
    { title: 'Weight(g)', name: 'setinfo.weight_g', size: '40', minSize: '40' },
    { title: 'Size', name: 'setinfo.size', size: '80', minSize: '80' },
    { title: 'Parts', name: 'setinfo.complete_part_count', size: '50', minSize: '50' },
    { title: 'Minifigs', name: 'setinfo.complete_minifigs_count', size: '50', minSize: '50' },
    { title: 'min Price', name: 'setinfo.min_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'max Price', name: 'setinfo.max_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Avg Price', name: 'setinfo.avg_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Unit Quantitiy', name: 'setinfo.unit_quantity', size: '40', minSize: '40' },
    { title: 'Total Quantitiy', name: 'setinfo.total_quantity', size: '40', minSize: '40' },
    { title: 'Updated', name: 'setinfo.created', size: '40', minSize: '40', datatype: { type: 'date' } },
  ]

  constructor(private runnedSetdataService: RunnedSetService,
    private router: Router) { }



  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.runnedSetdataService.getSetRunnedSets().subscribe(
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

  onRowClick(data) {
    this.router.navigateByUrl('/runnedsetdetail/' + data.id).then((bool) => { }).catch();
  }

}
