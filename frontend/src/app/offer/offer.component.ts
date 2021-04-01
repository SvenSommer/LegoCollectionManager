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
    { title: 'Image', name: 'images', size: '65', minSize: '65', datatype: { type: 'imagesoffers'}},
    { title: 'Title', name: 'offerinfo.title', size: '20%', minSize: '120' },
    { title: 'Price', name: 'offerinfo.price', size: '20%', minSize: '120', datatype: { type: 'price' } },
    { title: 'Price Type', name: 'offerinfo.pricetype', size: '20%', minSize: '120' },
    { title: 'Zipcode', name: 'offerinfo.zipcode', size: '25', minSize: '25', datatype: { type: 'number' } },
    { title: 'Shipping', name: 'offerinfo.shipping', size: '40', minSize: '40' },
    { title: 'Seller', name: 'userinfo.name', size: '40', minSize: '40' },
    { title: 'Offer Date', name: 'offerinfo.datecreated', size: '100', minSize: '100', datatype: { type: 'date' } },
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

  onRowClick(data) {
    this.router.navigateByUrl("/offerdetail/" + data.id).then((bool) => { }).catch()
  }


}
