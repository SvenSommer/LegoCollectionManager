import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { OfferService } from '../services/offer.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  constructor(private offerService: OfferService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }


  public columns = [
    { title: 'Images', name: 'offerinfo.images', size: '10%', minSize: '10%', datatype: { type: 'imagesoffers'}},
    { title: 'Title', name: 'offerinfo.title', size: '30', minSize: '30' },
    { title: 'Description2', name: 'offerinfo.description', size: '120', minSize: '120' },
    { title: 'Price', name: 'offerinfo.price', size: '10', minSize: '20', datatype: { type: 'price' } },
    { title: 'Price Type', name: 'offerinfo.pricetype', size: '10', minSize: '20' },
    { title: 'Zipcode', name: 'offerinfo.zipcode', size: '25', minSize: '25', datatype: { type: 'number' } },
    { title: 'Locality', name: 'offerinfo.locality', size: '25', minSize: '25' },
    { title: 'Shipping', name: 'offerinfo.shipping', size: '40', minSize: '40' },
    { title: 'Seller', name: 'userinfo.name', size: '40', minSize: '40' },
    { title: 'Category', name: 'userinfo.category', size: '40', minSize: '40' },
    { title: 'Offers', name: 'userinfo.sumOffersRecorded', size: '40', minSize: '40' },
    { title: 'Offer Date', name: 'offerinfo.datecreated', size: '80', minSize: '80', datatype: { type: 'date' } },
    { title: 'created', name: 'created', size: '80', minSize: '80', datatype: { type: 'datetime' } },
    { title: 'deletedbyUser', name: 'deletedByExtUser', size: '80', minSize: '80', datatype: { type: 'datetime' } },
  ];

  public data: any;

  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.offerService.getOffers().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.data = data.body.result;
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

  onRowDeleteClick(model) {
      this.offerService.deleteOffer(model.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            // Message should be data.body.message
            this.toastr.success("Record Deleted Successfully.");
            this.bindData();
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
    this.router.navigateByUrl("/offerdetail/" + data.id).then((bool) => { }).catch()
  }


}
