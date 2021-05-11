import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColorService } from '../services/color.service';
import {TextCellComponent} from "../shared/components/grid/text-cell/text-cell.component";

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit {

  constructor(private colorService: ColorService,
    private router: Router) { }
  public columns = [
    {
      headerName: 'Id',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'color_id',
      filter: 'agNumberColumnFilter',
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'color_name',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Code',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'color_code',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Type',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'color_type',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Parts Count',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'parts_count',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Year From',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'year_from',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Year to',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'year_to',
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

  public rows: Array<any> = [];


    public colorData: any;

    ngOnInit(): void {
      this.bindData();
    }

    bindData() {
      this.colorService.getColors().subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code === 200) {
              this.colorData = data.body.result;
              this.rows = this.colorData;

            }
            else if (data.body && data.body.code === 403) {
              this.router.navigateByUrl('/login');
            }
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        }
      );
    }


}
