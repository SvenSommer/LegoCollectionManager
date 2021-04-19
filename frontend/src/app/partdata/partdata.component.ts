import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartdataService } from '../services/partdata.service';

@Component({
  selector: 'app-partdata',
  templateUrl: './partdata.component.html',
  styleUrls: ['./partdata.component.css']
})
export class PartdataComponent implements OnInit {

  constructor(private partdataService: PartdataService,
    private router: Router) { }


    public columns = [
      { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
      { title: 'Number', name: 'partno', size: '5%', minSize: '50'},
      { title: 'Colorid', name: 'color_id', size: '5%', minSize: '50'},
      { title: 'Type', name: 'type', size: '5%', minSize: '50'},
      { title: 'Name', name: 'partinfo.name', size: '30%', minSize: '120' },
      { title: 'Category', name: 'partinfo.category_name', size: '30', minSize: '120' },
      { title: 'Year', name: 'partinfo.year', size: '30', minSize: '50' },
      { title: 'Weight(g)', name: 'partinfo.weight_g', size: '40', minSize: '40' },
      { title: 'Size', name: 'partinfo.size', size: '80', minSize: '80' },
      { title: 'Obsolete', name: 'partinfo.is_obsolete', size: '50', minSize: '50' },
      { title: 'avg Price (stock)', name: 'partinfo.qty_avg_price_stock', size: '40', minSize: '40', datatype: { type: 'price' } },
      { title: 'avg Price (sold)', name: 'partinfo.qty_avg_price_sold', size: '40', minSize: '40', datatype: { type: 'price' } },
      { title: 'Avg Price', name: 'partinfo.avg_price', size: '40', minSize: '40', datatype: { type: 'price' } }
    ]
    public data: any;

  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.partdataService.getPartdata().subscribe(
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
