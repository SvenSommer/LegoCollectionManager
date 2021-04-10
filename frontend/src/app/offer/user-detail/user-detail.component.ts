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

  public offerColumns = [
    { title: 'Images', name: 'images', size: '120', minSize: '120', datatype: { type: 'imagesoffers'}},
    { title: 'Title', name: 'title', size: '20%', minSize: '120' },
    { title: 'Description', name: 'description', size: '20%', minSize: '120' },
    { title: 'Price', name: 'price', size: '20%', minSize: '120', datatype: { type: 'price' } },
    { title: 'Price Type', name: 'pricetype', size: '20%', minSize: '120' },
    { title: 'Zipcode', name: 'zipcode', size: '25', minSize: '25', datatype: { type: 'number' } },
    { title: 'Locality', name: 'locality', size: '25', minSize: '25' },
    { title: 'Shipping', name: 'shipping', size: '40', minSize: '40' },
    { title: 'Seller', name: 'name', size: '40', minSize: '40' },
    { title: 'Offer Date', name: 'datecreated', size: '100', minSize: '100', datatype: { type: 'date' } },
    { title: 'created', name: 'created', size: '100', minSize: '100', datatype: { type: 'datetime' } },
    { title: 'deletedbyUser', name: 'deletedByExtUser', size: '100', minSize: '100', datatype: { type: 'datetime' } },
  ];
  constructor(private activatedRoute: ActivatedRoute,
    private offerUserService: OfferUserService,
    private router: Router, private toastr: ToastrService) { }


  public userid = 0;
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
          console.log(data)
          if (data.body && data.body.code == 200) {
            this.userDetails = data.body.result[0];
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
