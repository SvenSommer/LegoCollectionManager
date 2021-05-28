import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SortedSetService } from '../../services/sortedset.service';
import {ImagesCellComponent} from '../../shared/components/grid/images-cell/images-cell.component';
import {TextCellComponent} from '../../shared/components/grid/text-cell/text-cell.component';

@Component({
  selector: 'app-sortedset',
  templateUrl: './sortedset.component.html',
  styleUrls: ['./sortedset.component.css']
})
export class SortedsetComponent implements OnInit {


  public rows: Array<any> = [];
  public columns = [
    {
      headerName: 'Run',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'runinfo.title',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '95'
    },
    {
      headerName: 'Image', field: 'setinfo.thumbnail_url',
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
      field: 'setinfo.no',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '95'
    },
    {
      headerName: 'Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.name',
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
      field: 'setinfo.category_name',
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
      field: 'setinfo.year',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '60'
    },
    {
      headerName: 'Weight (g)',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.weight_g',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '80'
    },
    {
      headerName: 'Size',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.size',
      filter: true,
      flex: 1,
      minWidth: '75'
    },
    {
      headerName: 'Parts',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.complete_part_count',
      filter: true,
      flex: 1,
      minWidth: '75'
    },
    {
      headerName: 'Minifigs',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.complete_minifigs_count',
      filter: true,
      flex: 1,
      minWidth: '95'
    },
    {
      headerName: 'min Price',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.min_price',
      filter: true,
      flex: 1,
      minWidth: '60'
    },
    {
      headerName: 'max Price',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.max_price',
      filter: true,
      flex: 1,
      minWidth: '60'
    },
    {
      headerName: 'Avg Price',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.avg_price',
      filter: true,
      flex: 1,
      minWidth: '60'
    },
    {
      headerName: 'Unit Quantitiy',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.unit_quantity',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '105'
    },
    {
      headerName: 'Total Quantitiy',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.total_quantity',
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: '105'
    },
    {
      headerName: 'Updated',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'setinfo.created',
      filter: 'agDateColumnFilter',
      flex: 1,
      minWidth: '95'
    }
  ];

  constructor(private sortedSetdataService: SortedSetService,
    private router: Router) { }

  public data: any;

  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.sortedSetdataService.getSetSortedSets().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {

            this.data = data.body.result;

            this.rows = this.data;
            console.log("this.rows:",this.rows)
            console.log("this.columns:",this.columns)
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

  onRowClick(data) {
    this.router.navigateByUrl('/sortedsetdetail/' + data.data.id).then((bool) => { }).catch();
  }

}
