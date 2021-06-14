import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private orderService: OrderService,
    private router:Router) { }

  public orderColumns = [
    { title: 'Bricklink Id', name: 'id', size: '65', minSize: '65', datatype: { type: 'number' } },
    { title: 'Date Ordered', name: 'date_ordered', size: '30', minSize: '50' , datatype: { type: 'date' }},
    { title: 'Direction', name: 'direction', size: '5%', minSize: '50'},
    { title: 'Status', name: 'status', size: '5%', minSize: '50' },
    { title: 'Seller Name', name: 'seller_name', size: '30', minSize: '50' },
    { title: 'Store Name', name: 'store_name', size: '40', minSize: '40' },
    { title: 'Buyer Name', name: 'buyer_name', size: '80', minSize: '80' },
    { title: 'Total Count', name: 'total_count', size: '50', minSize: '50', datatype: { type: 'number' } },
    { title: 'Unique Count', name: 'unique_count', size: '50', minSize: '50', datatype: { type: 'number' } },
    { title: 'Price Sub', name: 'cost_subtotal', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Price Total', name: 'cost_grandtotal', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Price Extra per Brick', name: 'cost_extra_per_brick', size: '40', minSize: '40', datatype: { type: 'price' } },
  ]

  public orderData: any;

  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.orderService.getOrders().subscribe(
      (data) => {
        if (data) {
          console.log(data.body)
          if (data.body && data.body.code == 200) {
            this.orderData = data.body.result;
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
    this.router.navigateByUrl("/orderdetail/" + data.id).then((bool) => { }).catch()
  }

}
