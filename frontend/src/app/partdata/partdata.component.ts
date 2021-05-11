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


    public partcolumns = [
      { title: 'Image', name: 'thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
      { title: 'Number', name: 'partno', size: '5%', minSize: '50'},
      { title: 'Colors', name: 'colorvariants', size: '5%', minSize: '50'},
      { title: 'Used', name: 'usecount', size: '5%', minSize: '50'},
      { title: 'Type', name: 'type', size: '5%', minSize: '50'},
      { title: 'Name', name: 'name', size: '30%', minSize: '120' },
      { title: 'Category', name: 'category_name', size: '30', minSize: '120' },
      { title: 'Year', name: 'year', size: '30', minSize: '50' },
      { title: 'Weight(g)', name: 'weight_g', size: '40', minSize: '40' },
      { title: 'Size', name: 'size', size: '80', minSize: '80' },
      { title: 'Obsolete', name: 'is_obsolete', size: '50', minSize: '50' }
    ]
    public partdata: any;

  ngOnInit(): void {
    this.bindData();
    
  }

  bindData() {
    this.partdataService.getPartdataAggegratedByPartnumberDetails().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.partdata = data.body.result;
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

    this.router.navigateByUrl("/partdetail/" + data.partno).then((bool) => { }).catch()
  }
  


}
