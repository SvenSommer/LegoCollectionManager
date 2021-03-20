import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SetdataService } from '../services/setdata.service';

@Component({
  selector: 'app-set',
  templateUrl: './setdata.component.html',
  styleUrls: ['./setdata.component.css']
})
export class SetdataComponent implements OnInit {

  constructor(private setdataService: SetdataService,
    private router: Router) { }

  public columns = [
    { title: 'Image', name: 'thumbnail_url', size: '50', minSize: '50', datatype: { type: 'image' } },
    { title: 'Number', name: 'no', size: '5%', minSize: '50'},
    { title: 'Name', name: 'name', size: '30%', minSize: '120' },
    { title: 'Category', name: 'category_name', size: '30', minSize: '120' },
    { title: 'Year', name: 'year', size: '30', minSize: '50' },
    { title: 'Weight(g)', name: 'weight_g', size: '40', minSize: '40' },
    { title: 'Size', name: 'size', size: '80', minSize: '80' },
    { title: 'Parts', name: 'complete_part_count', size: '50', minSize: '50' },
    { title: 'Minifigs', name: 'complete_minifigs_count', size: '50', minSize: '50' },
    { title: 'min Price', name: 'min_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'max Price', name: 'max_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Avg Price', name: 'avg_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Unit Quantitiy', name: 'unit_quantity', size: '40', minSize: '40' },
    { title: 'Total Quantitiy', name: 'total_quantity', size: '40', minSize: '40' },
  ]


  public data: any;

  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.setdataService.getSetdata().subscribe(
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