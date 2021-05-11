import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import {TextCellComponent} from "../shared/components/grid/text-cell/text-cell.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private categoryService: CategoryService,
    private router: Router) { }

  public columns = [
    {
      headerName: 'Number',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'category_id',
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
      field: 'category_name',
      filter: true,
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Category',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'parent_id',
      filter: 'agNumberColumnFilter',
      flex: 3,
      minWidth: '80'
    },
    {
      headerName: 'Downloaded',
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

  public categoryData: any;

  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.categoryService.getCategories().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.categoryData = data.body.result;
            this.rows = this.categoryData;
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
