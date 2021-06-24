import { HttpErrorResponse } from '@angular/common/http';
import { HostListener, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissingPartService } from 'src/app/services/missingpart.service';
import { PurchasedPartService } from 'src/app/services/purchasedpart.service';
import { OrderService } from 'src/app/services/order.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { PurchasedPartEditComponent } from '../purchasedpart-edit/purchasedpart-edit.component';
import { PurchasedPartModel } from 'src/app/models/purchasedpart-model';

@Component({
  selector: 'app-orderitem-detail',
  templateUrl: './orderitem-detail.component.html',
  styleUrls: ['./orderitem-detail.component.css']
})
export class OrderitemDetailComponent implements OnInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.HandleKeyInput(event.key);
  }
 
  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;
  @ViewChild('purchasedPartEdit') purchasedPartEdit: PurchasedPartEditComponent;

  public  orderitemDetails;

  public orderitemInfo = {
    title: 'Orderitem Infos',
    rowData: [
      { key: 'name', name: 'Partname'},
      { key: 'no', name: 'Partno'},
      { key: 'color_id', name: 'Color Id'},
      { key: 'color_name', name: 'Color Name'},
      { key: 'new_or_used', name: 'New Or Used'},
      { key: 'quantity', name: 'Quantity'},
      { key: 'unit_price', name: 'Price', dataType: { type: 'price' }},
      { key: 'unit_price_final', name: 'Price Final', dataType: { type: 'price' }},
      { key: 'remarks', name: 'Remarks'},
      { key: 'description', name: 'Description'},
      { key: 'id', name: 'Orderitem Id'},
      { key: 'order_id', name: 'Order Id'},
    ]
  };

  public missingColumns = [
    { title: 'Collection id', name: 'collection_id', size: '30', minSize: '30' , datatype: { type: 'number' } },
    { title: 'Set Image', name: 'setinfo.image_url', size: '200', minSize: '200', datatype: { type: 'image' } },
    { title: 'SetName', name: 'setinfo.name', size: '30', minSize: '30' },
    { title: 'Setno', name: 'setinfo.no', size: '30', minSize: '30' },
    { title: 'Quantity Missing', name: 'missing_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Expected Price Stock', name: 'qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Expected Price Sold', name: 'qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Pusher', name: 'pusherinfo.name', size: '30', minSize: '30' },
  ];
  public missingData : any; 
  
  public purchasedColumns = [
    { title: 'Collection id', name: 'collection_id', size: '30', minSize: '30' , datatype: { type: 'number' } },
    { title: 'Set Image', name: 'setinfo.image_url', size: '200', minSize: '200', datatype: { type: 'image' } },
    { title: 'SetName', name: 'setinfo.name', size: '30', minSize: '30' },
    { title: 'Setno', name: 'setinfo.no', size: '30', minSize: '30' },
  
    { title: 'Quantity Sorted', name: 'sorted_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Puchased Sorted', name: 'purchases_and_sorted_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Quantity Missing', name: 'missing_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Quantity Needed', name: 'total_quantity_needed', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Expected Price Stock', name: 'qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Expected Price Sold', name: 'qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Pusher', name: 'pusherinfo.name', size: '30', minSize: '30' },
  ];
  public purchasedData : any; 

  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private missingPartService: MissingPartService,
    private purchasedPartService: PurchasedPartService,
    private router:Router) { }

  public id = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id > 0) {
        this.bindData();
        this.getPurchasedandSortedParts();
      }
    });
  }

  HandleKeyInput(key: string) {
    switch (key) {
      case 'ArrowRight':
        this.onNextPartClick();
        break;
      case 'ArrowLeft':
        this.onPrevoiusPartClick();
        break;

      default:
        break;
    }
  }

  onSetClick(data) {
   // console.log("rowdata",data)
    this.router.navigateByUrl("/expectedsetdetail/" + data.expectedset_id).then((bool) => { }).catch()
  }

  onNextPartClick() {
    this.id++
    this.bindData();
    this.getPurchasedandSortedParts();
  }

  onPrevoiusPartClick() {
    if (this.id > 0) {
      this.id--
      this.bindData();
      this.getPurchasedandSortedParts();
    }
   }


  bindData() {
    this.orderService.getOrderitemsByid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.orderitemDetails = data.body.result[0];
            this.getMissingData();
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

  getMissingData() {
    this.missingPartService.getMissingitemsByPartNoAndColor(this.orderitemDetails.no,this.orderitemDetails.color_id ).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.missingData = data.body.result;
          //  console.log("this.missingData",this.missingData)
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

  getPurchasedandSortedParts() {
    this.purchasedPartService.getPurchasedPartsbyOrderItemId(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.purchasedData = data.body.result;
           // console.log("this.purchasedData",this.purchasedData)
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

  onCreatePurchasedPartClick(data) {

    let purchasedPart = new PurchasedPartModel();
    
    if(data.expectedpart_id > data.missing_quantity)
      purchasedPart.quantity = data.missing_quantity
    else
      purchasedPart.quantity = this.orderitemDetails.quantity;

    purchasedPart.expectedpart_id = data.expectedpart_id;
    purchasedPart.orderitem_id = this.id;
    this.purchasedPartEdit.open(purchasedPart);
  }

  purchasedPartAdded(newData: PurchasedPartModel) {
    this.bindData();
    this.getPurchasedandSortedParts();
  }

}
