import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OfferUserService } from 'src/app/services/offeruser.service';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {


  public userDetails;
  public offerDetails;

  public offerColumns = [
    { title: 'Images', name: 'images', size: '120', minSize: '120', datatype: { type: 'imagesoffers'}},
    { title: 'Title', name: 'offerinfo.title', size: '20%', minSize: '120' },
    { title: 'Description', name: 'offerinfo.description', size: '20%', minSize: '120' },
    { title: 'Price', name: 'offerinfo.price', size: '20%', minSize: '120', datatype: { type: 'price' } },
    { title: 'Price Type', name: 'offerinfo.pricetype', size: '20%', minSize: '120' },
    { title: 'Zipcode', name: 'offerinfo.zipcode', size: '25', minSize: '25', datatype: { type: 'number' } },
    { title: 'Locality', name: 'offerinfo.locality', size: '25', minSize: '25' },
    { title: 'Shipping', name: 'offerinfo.shipping', size: '40', minSize: '40' },
    { title: 'Seller', name: 'offerinfo.name', size: '40', minSize: '40' },
    { title: 'Offer Date', name: 'offerinfo.datecreated', size: '100', minSize: '100', datatype: { type: 'date' } },
    { title: 'created', name: 'offerinfo.created', size: '100', minSize: '100', datatype: { type: 'datetime' } },
    { title: 'deletedbyUser', name: 'offerinfo.deletedByExtUser', size: '100', minSize: '100', datatype: { type: 'datetime' } },
  ];

   public userInfo = {
    title: '',
    rowData: [
      { key: 'userinfo.user_id', name: 'External User Id', dataType:{type:'external_link', target: 'user_id'}},
      { key: 'userinfo.name', name: 'Seller'},
      { key: 'userinfo.type', name: 'Type'},
      { key: 'userinfo.category', name: 'Category'},
      { key: 'userinfo.offerscount', name: 'Available Offers'},
      { key: 'userinfo.sumOffersRecorded', name: 'Recorded Offers'},
      { key: 'userinfo.friendliness', name: 'Friendliness'},
      { key: 'userinfo.satisfaction', name: 'Satisfaction'},
      { key: 'userinfo.accountcreated', name: 'Account Created', dataType:{type:'date'}}
    ]
  };

  constructor(private activatedRoute: ActivatedRoute,
    private offerUserService: OfferUserService,
    private router: Router, private toastr: ToastrService) { }


  public userid = 0;
  public externaluserid = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userid = params['id'];
      if (this.userid > 0) {
        this.bindData();
      }
    });
  }

  bindData() {
    this.offerUserService.getUserDetail(this.userid).subscribe(
      (data) => {
        if (data) {

          if (data.body && data.body.code == 200) {
            this.userDetails = data.body.result[0];
            console.log(this.userDetails)
            this.externaluserid = this.userDetails.user_id;
            this.getOffers();
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

  getOffers() {
    this.offerUserService.getOffersByUserId(this.externaluserid).subscribe(
      (data) => {
        if (data) {

          if (data.body && data.body.code == 200) {
            this.offerDetails = data.body.result;
            console.log(this.offerDetails)
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

  onOfferRowClick(data) {
    this.router.navigateByUrl("/offerdetail/" + data.offerinfo.id).then((bool) => { }).catch()
  }
}
