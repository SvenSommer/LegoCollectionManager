import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColorService } from '../services/color.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit {

  constructor(private colorService: ColorService,
    private router: Router) { }

    public colorColumns = [
      { title: 'Id', name: 'color_id', size: '50', minSize: '50', datatype: { type: 'number' } },
      { title: 'Name', name: 'color_name', size: '5%', minSize: '50'},
      { title: 'Code', name: 'color_code', size: '30%', minSize: '120' , datatype: { type: 'color' }},
      { title: 'Type', name: 'color_type', size: '30', minSize: '120' },
      { title: 'Parts Count', name: 'parts_count', size: '30', minSize: '50', datatype: { type: 'number' } },
      { title: 'Year From', name: 'year_from', size: '40', minSize: '40', datatype: { type: 'number' } },
      { title: 'Year to', name: 'year_to', size: '80', minSize: '80' , datatype: { type: 'number' }},
      { title: 'Created', name: 'created', size: '50', minSize: '50' , datatype: { type: 'date' }}
    ]
  
  
    public colorData: any;

    ngOnInit(): void {
      this.bindData();
    }
  
    bindData() {
      this.colorService.getColors().subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code == 200) {
              this.colorData = data.body.result;
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
