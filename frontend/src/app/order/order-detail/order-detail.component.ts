import { HttpErrorResponse } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  public orderDetails;

  public orderDetailsInfo = {
    title: 'Order Infos',
    rowData: [
      { key: 'id', name: 'Bricklink Order',dataType:{type:'order_detail_link', target: 'no'}},
      { key: 'direction', name: 'Direction'},
      { key: 'status', name: 'Status'},
      { key: 'date_ordered', name: 'Ordered', dataType: { type: 'date' }},
      { key: 'seller_name', name: 'Seller'},
      { key: 'store_name', name: 'Store'},
      { key: 'buyer_name', name: 'Buyer'},
      { key: 'total_count', name: 'Total Count'},
      { key: 'unique_count', name: 'Unique Count'},
      { key: 'cost_subtotal', name: 'Price Sub', dataType: { type: 'price' }},
      { key: 'cost_grandtotal', name: 'Price Total', dataType: { type: 'price' }},
      { key: 'cost_extra_per_brick', name: 'Price Extra per Brick', dataType: { type: 'price' }},
    ]
  };

  public orderitemColumns = [
    { title: 'Image', name: 'image_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Name', name: 'name', size: '30', minSize: '30' },
    { title: 'Partno', name: 'no', size: '30', minSize: '30' },
    { title: 'Color Id', name: 'color_id', size: '30', minSize: '30'  , datatype: { type: 'number' }},
    { title: 'Color Name', name: 'color_name', size: '30', minSize: '30' },
    { title: 'New Or Used', name: 'new_or_used', size: '30', minSize: '30' },
    { title: 'Quantity', name: 'quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Price', name: 'unit_price', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Price Final', name: 'unit_price_final', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Remarks', name: 'remarks', size: '30', minSize: '30' },
    { title: 'Description', name: 'description', size: '30', minSize: '30'},

  ];
  public orderitemData: any; 

  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private router: Router) { }

  public id = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id > 0) {
        this.bindData();
        this.getAllOrderItems();
      }
    });
  }

  bindData() {
    this.orderService.getOrderById(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.orderDetails = data.body.result[0];
            console.log("this.orderDetails",this.orderDetails)
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

  public onImgPopupClose() {
    this.imgPopupURL = '';
    this.imgPopupName = '';
   }

  public onImgClick(row) {
    this.imgPopupURL =  row.image_url;
    this.imgPopupName = row.name;
    this.imagePopup.open();
  }

  getAllOrderItems() {
    this.orderService.getOrderitemsByOrderid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.orderitemData = data.body.result;
            console.log("this.orderitemData",this.orderitemData)
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
    this.router.navigateByUrl("/orderitemdetail/" + data.id).then((bool) => { }).catch()
  }
}
