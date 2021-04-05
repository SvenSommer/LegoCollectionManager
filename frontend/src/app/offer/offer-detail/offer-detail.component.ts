import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { OfferService } from 'src/app/services/offer.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.css']
})
export class OfferDetailComponent implements OnInit {

  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  public offerDetails;
  public possiblesetDetails;

  public viewColumns = [
    { title: 'Views', name: 'viewcount', size: '65', minSize: '65', datatype: { type: 'number' } },
    { title: 'date', name: 'created', size: '30', minSize: '30', datatype: { type: 'datetime' }  },
  ]

  public possiblesetColumns = [
    { title: 'Amount', name: 'amount', size: '40', minSize: '40' , datatype:{ type: 'number' }},
    { title: 'Image', name: 'setinfo.image_url', size: '80', minSize: '80', datatype:{ type: 'image' } },
    { title: 'Set No', name: 'setno', size: '30', minSize: '30' },
    { title: 'Set Name', name: 'setinfo.name', size: '30', minSize: '30' },
    { title: 'Comments', name: 'comments', size: '30', minSize: '30' },
    { title: 'Year', name: 'setinfo.year', size: '30', minSize: '50', datatype:{ type: 'number' } },
    { title: 'Weight(g)', name: 'setinfo.weight_g', size: '40', minSize: '40' , datatype:{ type: 'number' }},
    { title: 'Size', name: 'setinfo.size', size: '80', minSize: '80' },
    { title: 'Parts', name: 'setinfo.complete_part_count', size: '50', minSize: '50', datatype:{ type: 'number' } },
    { title: 'Minifigs', name: 'setinfo.complete_minifigs_count', size: '50', minSize: '50' , datatype:{ type: 'number' }},
    { title: 'min Price', name: 'setinfo.min_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'max Price', name: 'setinfo.max_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Avg Price', name: 'setinfo.avg_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Identified', name: 'created', size: '100', minSize: '100', datatype: { type: 'date' } }
  ];

  public isMoreFieldOpenForSet = false;
  public newpossiblesetDetail = {
    "offer_id":0,
    "setno":"",
    "amount":1,
    "comments":""
  }
  public newpropertiesDetails ={
    "offer_id": 0,
    "weight_kg": 0,
    "instructions": "",
    "minifigs": "",
    "boxes": "",
    "notes": ""
  }

  public isSetFormSubmitted = false;

  public viewData: any; 
  public possiblesetData: any; 
  public propertiesData: any;
  constructor(private activatedRoute: ActivatedRoute,
    private offerService: OfferService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

    public offerid = 0;
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.offerid = params['id'];
        if (this.offerid > 0) {
          this.newpossiblesetDetail.offer_id = this.offerid;
          this.newpropertiesDetails.offer_id = this.offerid;
          this.bindData();
          this.getAllViews();
          this.getAllPossiblesets();
        }
      });
    }

    bindData() {
      this.offerService.getOfferById(this.offerid).subscribe(
        (data) => {
          if (data) {
            console.log(data)
            if (data.body && data.body.code == 200) {
              this.offerDetails = data.body.result[0];
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

    public onDeleteClick(){
      let options = {
        title: 'Are you sure you want to delete this?',
        confirmLabel: 'Okay',
        declineLabel: 'Cancel'
      }
      this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
        if (res) {
          console.log('Okay');
          this.offerService.deleteOffer(this.offerid).subscribe(
            (data) => {
              if (data) {
                if (data.body && data.body.code == 200) {
                 // Message should be data.body.message
                 this.toastr.success("Record Deleted Successfully.");
                 this.router.navigateByUrl("/offer");
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
        } else {
          console.log('Cancel');
        }
      });
    }

    public onExternalClick(data) {
      if(data && data.url)
      {
        let url: string = '';
        if (!/^http[s]?:\/\//.test(data.url)) {
          url += 'http://';
        }
    
        url += data.url;
        window.open(url, '_blank');
      }
    }

    getAllViews() {
      this.offerService.getViewsByOfferid(this.offerid).subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code == 200) {
              this.viewData = data.body.result;
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


    getAllPossiblesets() {
      this.offerService.getPossiblesetsByOfferid(this.offerid).subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code == 200) {
              this.possiblesetData = data.body.result;
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

  
  


    onSubmitAddSets(form: NgForm) {
      this.isSetFormSubmitted = true;
      if (!form.valid) {
        return;
      }
      this.newpossiblesetDetail.setno.replace(/ /g, "");
      console.log(this.newpossiblesetDetail)
      this.offerService.saveNewPossibleSets(this.newpossiblesetDetail).subscribe(
        (data) => {
          if (data) {
            console.log(data)
            if (data.body && data.body.code == 201) {
              this.toastr.success(data.body.message);
              this.newpossiblesetDetail = {
                "offer_id": this.offerid,
                "setno": "",
                "amount": 0,
                "comments": ""
              };
              this.isSetFormSubmitted = false;
              form.reset();
              this.getAllPossiblesets();
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

    onRowPossibleSetClick(data) {
      console.log(data)
      if(data.id != null)
        this.router.navigateByUrl("/setdetail/" + data.set_id).then((bool) => { }).catch()
    }
   
    onRowPossibleSetDeleteClick(data){
      let options = {
        title: 'Are you sure you want to delete this?',
        confirmLabel: 'Okay',
        declineLabel: 'Cancel'
      }
      this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
        if (res) {
          this.offerService.deletePossibleSetBySetId(data.possibleset_id).subscribe(
            (data) => {
              if (data) {
                if (data.body && data.body.code == 200) {
                 // Message should be data.body.message
                 this.toastr.success("Set Deleted Successfully.");
                 this.bindData();
                 this.getAllPossiblesets();
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
        } else {
          console.log('Cancel');
        }
      });
    }

    public onImgPopupClose() {
      this.imgPopupURL = '';
      this.imgPopupName = '';
     }
  
    public onImgClick(partimage) {
      this.imgPopupURL = partimage.imageurl ;
      this.imgPopupName = partimage.path;
      this.imagePopup.open();
    }
}
