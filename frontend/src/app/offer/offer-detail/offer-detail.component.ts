import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { OfferService } from 'src/app/services/offer.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { OfferPropertiesModel } from 'src/app/models/offer_properties-model';
import { RawViewData, ViewChartData } from './offer-detail.model';
import { UserCategoryModel } from 'src/app/models/usercategory-model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
  public userCategoryList: Array<any>;

  public viewColumns = [
    { title: 'Views', name: 'viewcount', size: '65', minSize: '65', datatype: { type: 'number' } },
    { title: 'date', name: 'created', size: '30', minSize: '30', datatype: { type: 'datetime' } },
  ];

  public statusColumns = [
    { title: 'Status', name: 'status', size: '65', minSize: '65' },
    { title: 'date', name: 'created', size: '30', minSize: '30', datatype: { type: 'datetime' } },
  ];

  public possiblesetColumns = [
    { title: 'Amount', name: 'amount', size: '40', minSize: '40', datatype: { type: 'number' } },
    { title: 'Image', name: 'setinfo.image_url', size: '80', minSize: '80', datatype: { type: 'image' } },
    { title: 'Set No', name: 'setno', size: '30', minSize: '30' },
    { title: 'Set Name', name: 'setinfo.name', size: '30', minSize: '30' },
    { title: 'Comments', name: 'comments', size: '30', minSize: '30' },
    { title: 'Year', name: 'setinfo.year', size: '30', minSize: '50', datatype: { type: 'number' } },
    { title: 'Weight(g)', name: 'setinfo.weight_g', size: '40', minSize: '40', datatype: { type: 'number' } },
    { title: 'Size', name: 'setinfo.size', size: '80', minSize: '80' },
    { title: 'Parts', name: 'setinfo.complete_part_count', size: '50', minSize: '50', datatype: { type: 'number' } },
    { title: 'Minifigs', name: 'setinfo.complete_minifigs_count', size: '50', minSize: '50', datatype: { type: 'number' } },
    { title: 'min Price', name: 'setinfo.min_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'max Price', name: 'setinfo.max_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Avg Price', name: 'setinfo.avg_price', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Identified', name: 'created', size: '100', minSize: '100', datatype: { type: 'date' } }
  ];

  public isMoreFieldOpenForSet = false;
  public newpossiblesetDetail = {
    offer_id: 0,
    setno: '',
    amount: 1,
    comments: '',
    request_id: ''
  };

  public setDownloadingRequestData = [];
  public requestList = new Array<string>();
  public user_category: UserCategoryModel = new UserCategoryModel();

  public properties: OfferPropertiesModel = new OfferPropertiesModel();
  public isSetFormSubmitted = false;
  public viewChartData: ViewChartData;
  public statusData: any;
  public imageData: any;
  public possiblesetData: any;
  public propertiesData: any;
  public offerid = 0;
  public selectedImageIndex = -1;

  constructor(private activatedRoute: ActivatedRoute,
              private offerService: OfferService,
              private modalService: NgbModal,
              private router: Router, private toastr: ToastrService,
              private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.offerid = params.id;
      if (this.offerid > 0) {
        this.newpossiblesetDetail.offer_id = this.offerid;

        this.properties = new OfferPropertiesModel(this.offerid);
        this.bindData();
        this.getAllViews();
        this.getAllImages();
        this.getAllStatus();
        this.getAllPossiblesets();
        this.getUserCategoriesList();
      }
    });

  }

  bindData() {
    this.offerService.getOfferById(this.offerid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.offerDetails = data.body.result[0];
            if (this.offerDetails.propertyinfo != null) {
              this.properties = this.offerDetails.propertyinfo;
            }
            this.user_category.id = this.offerDetails.userinfo.id;
          }
          else if (data.body && data.body.code == 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  public onDeleteClick() {
    const options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.offerService.deleteOffer(this.offerid).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code == 200) {
                // Message should be data.body.message
                this.toastr.success('Record Deleted Successfully.');
                this.router.navigateByUrl('/offer');
              }
              else if (data.body && data.body.code == 403) {
                this.router.navigateByUrl('/login');
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
    if (data && data.url) {
      let url = '';
      if (!/^http[s]?:\/\//.test(data.url)) {
        url += 'http://';
      }

      url += data.url;
      window.open(url, '_blank').focus();
    }
  }

  getAllViews() {
    this.offerService.getViewsByOfferid(this.offerid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            const result = data.body.result as RawViewData[];
            const viewCounts = result.map(rawDataNode => rawDataNode.viewcount);
            this.viewChartData = {
              yScaleMin: Math.min(...viewCounts),
              yScaleMax: Math.max(...viewCounts) * 1.01,
              collection: [{
                name: 'views',
                series: result.map(rawDataNode => ({
                  name: new Date(rawDataNode.created),
                  value: rawDataNode.viewcount
                }))
              }]
            };
          }
          else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  getAllStatus() {
    this.offerService.getStatusByOfferid(this.offerid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            this.statusData = data.body.result;
          }
          else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  getAllImages() {
    this.offerService.getImagesbyOfferId(this.offerid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            this.imageData = data.body.result[0];
          }
          else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
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
          if (data.body && data.body.code === 200) {
            this.possiblesetData = data.body.result;
          }
          else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  getUserCategoriesList() {
    this.offerService.getUserCategories().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            this.userCategoryList = data.body.result;
          }
          else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  callUserCategory(value) {
    this.user_category.category_id = value;
    console.log(this.user_category);
    this.offerService.updateUserCategory(this.user_category).subscribe(
      (data) => {
        if (data.body.code === 201 || data.body.code === 200) {
          this.toastr.success(data.body.message);
          this.router.navigateByUrl('/offer');
        }
        else {
          this.toastr.error(data.body.message);
        }
      },
      (error: HttpErrorResponse) => {
        // console.log('[getUSers] error : ', error);
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  onSubmitAddSets(form: NgForm) {
    this.isSetFormSubmitted = true;
    if (!form.valid) {
      return;
    }
    this.newpossiblesetDetail.setno.replace(/ /g, '');
    this.newpossiblesetDetail.request_id = Date.now().toString() + '_' + this.newpossiblesetDetail.setno;
    this.requestList.push(this.newpossiblesetDetail.request_id);
    console.log(this.newpossiblesetDetail);

    setInterval(() => {
      this.getProgressDetails();

    }, 1000);

    this.offerService.saveNewPossibleSets(this.newpossiblesetDetail).subscribe(
      (data) => {

        if (data) {
          if (data.body && data.body.code === 201) {
            this.toastr.success(data.body.message);
            this.newpossiblesetDetail = {
              offer_id: this.offerid,
              setno: '',
              amount: 0,
              comments: '',
              request_id: ''
            };
            this.isSetFormSubmitted = false;
            form.reset();
            this.getAllPossiblesets();
          }
          else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
          }
          else if (data.body && data.body.message) {
            this.toastr.error(data.body.message);
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  onRowPossibleSetClick(data) {
    console.log(data);
    if (data.id != null) {
      this.router.navigateByUrl('/setdetail/' + data.set_id).then((bool) => { }).catch();
    }
  }

  onUserDetailsClick(user_id) {
    console.log(user_id);
    if (user_id != null) {
      this.router.navigateByUrl('/offeruser/' + user_id).then((bool) => { }).catch();
    }
  }

  getProgressDetails() {
    if (!this.requestList || this.requestList.length <= 0) {
      return;
    }

    this.offerService.getProgressDetails(this.requestList.join(',')).subscribe(
      (data) => {
        if (data.body && data.body.code === 200) {
          this.setDownloadingRequestData = Object.assign([], data.body.result);


          for (let i = 0; i <= this.setDownloadingRequestData.length - 1; i++) {
            const setNo = this.setDownloadingRequestData[i].request_id.lastIndexOf('_');
            this.setDownloadingRequestData[i].setNo = this.setDownloadingRequestData[i].request_id.substr(setNo + 1);

            if (this.setDownloadingRequestData[i].progress === 100) {
              // var index = this.setDownloadingRequestData.filter(m=>m.progress <= this.newpossiblesetDetail.request_id);
              this.requestList = this.arrayRemove(this.requestList, this.setDownloadingRequestData[i].request_id);
              this.setDownloadingRequestData.splice(i, 1);
              i++;
            }
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  onRowPossibleSetDeleteClick(data) {
    const options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.offerService.deletePossibleSetBySetId(data.id).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code === 200) {
                // Message should be data.body.message
                this.toastr.success('Set Deleted Successfully.');
                this.bindData();
                this.getAllPossiblesets();
              }
              else if (data.body && data.body.code === 403) {
                this.router.navigateByUrl('/login');
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

  public onImgClick(image, index: number) {
    this.imgPopupURL = image.imageurl;
    this.imgPopupName = image.path;
    this.selectedImageIndex = index;

    if (!this.modalService.hasOpenModals()) {
      this.imagePopup.open();
    }
  }

  onSaveProperties(propertiesForm: NgForm) {
    if (!propertiesForm.valid) {
      return;
    }
    this.properties.offer_id = this.offerid;


    this.offerService.upsertProperties(this.properties).subscribe(
      (data) => {
        if (data.body.code === 201 || data.body.code === 200) {
          this.toastr.success(data.body.message);
        }
        else {
          this.toastr.error(data.body.message);
        }
      },
      (error: HttpErrorResponse) => {
        // console.log('[getUSers] error : ', error);
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  arrayRemove(arr, value) {

    return arr.filter(function(ele) {
      return ele !== value;
    });
  }

  onArrowClick(isLeft: boolean) {
    const nextIndex = this.selectedImageIndex + (isLeft ?  -1 : 1);
    const images = this.imageData.images;

    if (images.length > nextIndex - 1 && nextIndex > -1) {
      this.imgPopupURL = images[nextIndex].imageurl;
      this.imgPopupName = images[nextIndex].path;
      this.selectedImageIndex = nextIndex;
    }

  }
}
