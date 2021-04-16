import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PriceService } from '../services/prices.service';
@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.css']
})
export class PricesComponent implements OnInit {

  constructor(private priceService: PriceService,
    private router: Router) { }

  public priceColumns = [
    { title: 'Type', name: 'type', size: '5', minSize: '120' },
    { title: 'Number', name: 'no', size: '5%', minSize: '50'},
    { title: 'Color Id', name: 'color_id', size: '30', minSize: '120' },
    { title: 'New or Used', name: 'new_or_used', size: '30', minSize: '120' },
    { title: 'Region', name: 'region', size: '30', minSize: '120' },
    { title: 'Guide Type', name: 'guide_type', size: '30', minSize: '120' },
    { title: 'Currency', name: 'currency_code', size: '30', minSize: '120' },
    { title: 'Min Price', name: 'min_price', size: '30', minSize: '120' , datatype: { type: 'price' }},
    { title: 'Max Price', name: 'max_price', size: '30', minSize: '120' , datatype: { type: 'price' }},
    { title: 'Avg Price', name: 'avg_price', size: '30', minSize: '120' , datatype: { type: 'price' }},
    { title: 'Qty Avg Price', name: 'qty_avg_price', size: '30', minSize: '120' , datatype: { type: 'price' }},
    { title: 'Unit Quantity', name: 'unit_quantity', size: '30', minSize: '120' , datatype: { type: 'number' }},
    { title: 'Total Quantity', name: 'total_quantity', size: '30', minSize: '120' , datatype: { type: 'number' }},
    { title: 'Updated', name: 'created', size: '30', minSize: '50', datatype: { type: 'date' } }
  ]

  public priceData: any;

  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.priceService.getPrices().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.priceData = data.body.result;
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
