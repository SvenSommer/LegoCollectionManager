import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private categoryService: CategoryService,
    private router: Router) { }

  public categoryColumns = [
    { title: 'Number', name: 'category_id', size: '5%', minSize: '50', datatype: { type: 'number' }},
    { title: 'Name', name: 'category_name', size: '30%', minSize: '120' },
    { title: 'Category', name: 'parent_id', size: '30', minSize: '120', datatype: { type: 'number' } },
    { title: 'Downloaded', name: 'created', size: '30', minSize: '50', datatype: { type: 'date' } }
  ]

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
