import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartdataService } from '../services/partdata.service';
import {ImagesCellComponent} from '../shared/components/grid/images-cell/images-cell.component';
import {TextCellComponent} from '../shared/components/grid/text-cell/text-cell.component';

@Component({
  selector: 'app-partdata',
  templateUrl: './partdata.component.html',
  styleUrls: ['./partdata.component.css']
})
export class PartdataComponent implements OnInit {

  public rows: Array<any> = [];
  public columns = [
    {
      headerName: 'Image', field: 'partinfo.thumbnail_url',
      autoHeight: true,
      resizable: true,
      cellRendererFramework: ImagesCellComponent,
      flex: 1,
      minWidth: '140'
    },
    {
      headerName: 'Number',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partno',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '95'
    },
    {
      headerName: 'Colorid',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'color_id',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '95'
    },
    {
      headerName: 'Type',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'type',
      filter: true,
      flex: 1,
      minWidth: '75'
    },
    {
      headerName: 'Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partinfo.name',
      filter: true,
      flex: 1,
      minWidth: '75'
    },
    {
      headerName: 'Category',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partinfo.category_name',
      filter: true,
      flex: 1,
      minWidth: '105'
    },
    {
      headerName: 'Year',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partinfo.year',
      filter: true,
      flex: 1,
      minWidth: '70'
    },
    {
      headerName: 'Weight(g)',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partinfo.weight_g',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '100'
    },
    {
      headerName: 'Size',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partinfo.size',
      filter: true,
      flex: 1,
      minWidth: '75'
    },
    {
      headerName: 'Obsolete',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partinfo.is_obsolete',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '105'
    },
    {
      headerName: 'avg Price (stock)',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partinfo.qty_avg_price_stock',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '80'
    },
    {
      headerName: 'avg Price (sold)',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partinfo.qty_avg_price_sold',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '80'
    },
    {
      headerName: 'Avg Price',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'partinfo.avg_price',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '80'
    }
  ];

  constructor(private partdataService: PartdataService,
              private router: Router) { }

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
            this.rows = this.partdata;
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
    this.router.navigateByUrl('/partdetail/' + data.partno).then((bool) => { }).catch()
  }



}
