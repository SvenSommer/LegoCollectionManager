import { HttpErrorResponse } from '@angular/common/http';
import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { OfferService } from 'src/app/services/offer.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { OfferPropertiesModel } from 'src/app/models/offer_properties-model';
import { RawViewData, ViewChartData } from './offer-detail.model';
import { UserCategoryModel } from 'src/app/models/usercategory-model';
import { TaskModel } from 'src/app/models/task-model';
import { TaskService } from 'src/app/services/task.service';
import { MessageTextModel } from 'src/app/models/messagetext-model';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.css']
})
export class OfferDetailComponent implements OnInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.HandleKeyInput(event.key);
  }



  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  public selectedImage: any;
  public isPopupOpen = false;
  public ctx: CanvasRenderingContext2D;
  public img: any;

  public offerDetails;
  public possiblesetDetails;
  public userCategoryList: Array<any>;
  public messageAccountList: Array<MessageTextModel>;
  public messageTextList: Array<any>;
  public offerDescriptionSplitBySets: string[] = [];
  public recognizeSets: Array<any> = [];
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
    { title: 'Parts Price Sold', name: 'setinfo.sumPartsAndMinifigs.sumPart_Qty_avg_price_sold', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Minifigs Price Sold', name: 'setinfo.sumPartsAndMinifigs.sumMinifig_Qty_avg_price_sold', size: '40', minSize: '40', datatype: { type: 'price' } },
   
  ];

  public offerInfo = {
    title: '',
    rowData: [
      { key: 'offerinfo.external_id', name: 'External Id', dataType: {type: 'link', target: 'offerinfo.url'}},
      { key: 'offerinfo.price', name: 'Price', dataType: {type: 'price'}},
      { key: 'offerinfo.pricetype', name: 'Price Type', hide: 'True'},
      { key: 'expectedSets.sumAmount', name: 'Expected Sets', dataType: {type: 'sumAmount'}},
      { key: 'expectedSets.sumMin_price', name: 'Min price', hide: 'True'},
      { key: 'expectedSets.sumAvg_price', name: 'Avg_price', hide: 'True'},
      { key: 'expectedSets.sumComplete_part_count', name: 'Parts', hide: 'True'},
      { key: 'expectedSets.sumComplete_minifigs_count', name: 'Minifigs', hide: 'True'},
      { key: 'offerinfo.locationgroup', name: 'Location Group'},
      { key: 'offerinfo.locality', name: 'Locality'},
      { key: 'offerinfo.zipcode', name: 'Zipcode'},
      { key: 'offerinfo.shipping', name: 'Shipping'},
      { key: 'offerinfo.created', name: 'Created', dataType: {type: 'dateTime'}},
      { key: 'deletedByExtUser', name: 'Deleted By User', dataType: {type: 'dateTime'}}
    ]
  };
  public sellerInfo = {
    title: '',
    rowData: [
      { key: 'userinfo.user_id', name: 'External User Id', dataType: {type: 'external_link', target: 'offerinfo.url'}},
      { key: 'userinfo.name', name: 'Seller', title: 'See details', dataType: {type: 'no_link', target: 'userinfo.id'}},
      { key: 'userinfo.phone', name: 'Phone'},
      { key: 'userinfo.type', name: 'Type'},
      { key: 'usercategory.id', name: 'Category',  dataType: {type: 'select', target: 'SELLER_INFO'}},
      { key: 'userinfo.offerscount', name: 'Available Offers'},
      { key: 'userinfo.sumOffersRecorded', name: 'Recorded Offers', title: 'See details', dataType: {type: 'icon_link', target: 'userinfo.id'}},
      { key: 'userinfo.id', name: 'User Id'},
      { key: 'userinfo.friendliness', name: 'Friendliness'},
      { key: 'userinfo.satisfaction', name: 'Satisfaction'},
      { key: 'userinfo.accountcreated', name: 'Account Created', dataType: {type: 'date'}}
    ]
  };

  public searchPropertiesInfo = {
    title: '',
    rowData: [
      { key: 'searchpropertyinfo.searchterm', name: 'Searchterm'},
      { key: 'searchpropertyinfo.location', name: 'Location'},
      { key: 'searchpropertyinfo.pricemin', name: 'Price (Min)'},
      { key: 'searchpropertyinfo.pricemax', name: 'Price (Max)'},
      { key: 'searchpropertyinfo.onlypickup', name: 'Only Pickup'}
    ]
  };

  public isMoreFieldOpenForSet = false;
  public task_origin = {
     offer_id : 0
  };

  public newMessage = {
    account_id: 2,
    messagetext_id: 2
  };

  public newpossiblesetDetail = {
    offer_id: 0,
    setno: '',
    amount: 1,
    comments: '',
    download_prices: true,
    report_progress: true
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
              private taskService: TaskService,
              private cd: ChangeDetectorRef,
              private router: Router, private toastr: ToastrService,
              private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.offerid = parseInt(params.id, 10);
      if (this.offerid > 0) {
        this.newpossiblesetDetail.offer_id = this.offerid;
        this.task_origin.offer_id = this.offerid;

        this.properties = new OfferPropertiesModel(this.offerid);
        this.bindData();
        this.getAllViews();
        this.getAllImages();
        this.getAllStatus();
        this.getAllPossiblesets();
        this.getUserCategoriesList();
        this.getAccounts();
        this.getMessagetexts();
      }
    });

  }

  bindData() {
    this.offerService.getOfferById(this.offerid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.offerDetails = data.body.result[0];
            this.splitBySets();
            if (this.offerDetails.propertyinfo != null) {
              this.properties = this.offerDetails.propertyinfo;
              console.log(this.properties);
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

  HandleKeyInput(key: string) {
    console.log(key);
    switch (key) {
      case 'ArrowRight':
        if(this.isPopupOpen)
          this.onArrowClick(false);
        else
          this.getOffer(true);
        break;
      case 'ArrowLeft':
        if(this.isPopupOpen)
          this.onArrowClick(true);
        else
          this.getOffer(false);
        break;

      case 'Delete':
        this.onDeleteClick();
        break;

      default:
        break;
    }
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
                this.getOffer(true);
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
            this.imageData.images.forEach(
              image => {
                if (image.detections) {
                  image.detections = image.detections.replace(/[']/g, '"');
                  image.detections = JSON.parse(image.detections).detections;
                  image.detections.forEach(
                    detection => {
                      detection.box.left = detection.box[0];
                      detection.box.top = detection.box[1];
                      detection.box.width = detection.box[2];
                      detection.box.height = detection.box[3];
                    }
                  );
                }
              }
            );
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

  getMessagetexts() {
    this.offerService.getMessagetexts().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            this.messageTextList = data.body.result;
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

  getAccounts() {
    console.log('getting accopunts');
    this.offerService.getAccounts().subscribe(
      (data) => {
        if (data) {
          console.log(data.body);
          if (data.body && data.body.code === 200) {

            this.messageAccountList = data.body.result;
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
    this.addSetToPotentialSets();
    form.reset();
  }

  private addSetToPotentialSets() {
    this.newpossiblesetDetail.setno.replace(/ /g, '');
    const new_task: TaskModel = {
      type_id: 1,
      origin: JSON.stringify(this.task_origin),
      information: JSON.stringify(this.newpossiblesetDetail)
    };
    this.taskService.createNewTask(new_task).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 201) {
            this.requestList.push(data.body.task_id);

            this.toastr.success(data.body.message);
            this.newpossiblesetDetail = {
              offer_id: this.offerid,
              setno: '',
              amount: 1,
              comments: '',
              download_prices: true,
              report_progress: true
            };
            this.isSetFormSubmitted = false;
            this.getAllPossiblesets();

            setInterval(() => {
              this.getProgressDetails();
            }, 1000);

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

  // onUserDetailsClick(user_id) {
  //   console.log(user_id);
  //   if (user_id != null) {
  //     this.router.navigateByUrl('/offeruser/' + user_id).then((bool) => { }).catch();
  //   }
  // }

  getProgressDetails() {
    if (!this.requestList || this.requestList.length <= 0) {
      return;
    }
    this.taskService.getProgressDetails(this.requestList.join(',')).subscribe(
      (data) => {
        if (data.body && data.body.code === 200) {
          this.setDownloadingRequestData = Object.assign([], data.body.result);
          for (let i = 0; i <= this.setDownloadingRequestData.length - 1; i++) {
            const info = JSON.parse(this.setDownloadingRequestData[i].information);
            this.setDownloadingRequestData[i].setNo = info.setno;
            this.setDownloadingRequestData[i].name = info.name;
            this.setDownloadingRequestData[i].image_url = info.image_url;
            this.setDownloadingRequestData[i].min_price = info.min_price;
            this.setDownloadingRequestData[i].max_price = info.max_price;
            this.setDownloadingRequestData[i].avg_price = info.avg_price;
            const task_id = this.setDownloadingRequestData[i].task_id;
            if (this.setDownloadingRequestData[i].progress == 100) {
              // Message should be data.body.message
              this.toastr.success(`Set ${info.setno} successfully downloaded.`);
              this.requestList = this.arrayRemove(this.requestList, task_id);
              this.setDownloadingRequestData = [];
              i++;
              this.bindData();
              this.getAllPossiblesets();
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
    this.isPopupOpen = false;
  }

  disableDetections() {
    if (this.selectedImage && this.selectedImage.detections) {
      this.selectedImage.detections.forEach(
        detection => {
          detection.selected = false;
        }
      );
    }
  }

  public onImgClick(image, index: number) {
    this.disableDetections();
    this.selectedImage = image;
    this.imgPopupURL = image.imageurl;
    this.imgPopupName = image.path;
    this.selectedImageIndex = index;


    if (!this.isPopupOpen) {
      this.imagePopup.open();
      this.isPopupOpen = true;
    }
  }

  afterLoading() {
    const i = this.imageData.images.find(im => im.imageurl === this.imgPopupURL);
    const ctx = this.canvas.nativeElement.getContext('2d');
    const img = new Image();

    img.addEventListener('load', () => {
        const height = img.height * (img.width > 720 ? 720 / img.width : 1);
        const width = img.width > 720 ? 720 : img.width;

        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.drawImage(img, 0, 0, img.width, img.height,
          0, 0, width, height);
        if (i.detections) {
          i.detections.forEach(
            detection => {
              setTimeout(() => {
                ctx.lineWidth = 3;
                ctx.strokeStyle = detection.selected ? 'green' : 'grey';
                ctx.strokeRect(
                  detection.box.left * width,
                  detection.box.top * height,
                  detection.box.width * width,
                  detection.box.height * height);
              }, 500);
            }
          );
        }
      },

      false);

    img.src = this.imgPopupURL;


    this.canvas.nativeElement.removeEventListener('click',  this.onCanvasClick, false);
    this.canvas.nativeElement.addEventListener('click', this.onCanvasClick, false);
  }

  onCanvasClick = (e) => {
    let hasSelected = false;
    const i = this.imageData.images.find(im => im.imageurl === this.imgPopupURL);
    const ctx = this.canvas.nativeElement.getContext('2d');


    if (i.detections) {
      i.detections.forEach(
        detection => {
          const x = detection.box.left * this.canvas.nativeElement.width;
          const y = detection.box.top * this.canvas.nativeElement.height;
          const w = detection.box.width * this.canvas.nativeElement.width;
          const h = detection.box.height * this.canvas.nativeElement.height;
          const canvasPos = this.canvas.nativeElement.getBoundingClientRect();

          if (x <= e.clientX - canvasPos.left &&
            e.clientX - canvasPos.left <= x + w &&
            y <= e.clientY - canvasPos.top &&
            e.clientY - canvasPos.top <= y + h) {
            if (!detection.selected && !hasSelected) {
              ctx.lineWidth = 3;
              ctx.strokeStyle = '#28a745';
              ctx.strokeRect(x, y, w, h);
              detection.selected = true;
              hasSelected = true;
            } else {
              ctx.lineWidth = 3;
              ctx.strokeStyle = 'grey';
              ctx.strokeRect(x, y, w, h);
              detection.selected = false;
            }
          } else {
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'grey';
            ctx.strokeRect(x, y, w, h);
            detection.selected = false;
          }
        }
      );
    }
  }

  onSaveProperties(propertiesForm: NgForm) {
    this.properties.offer_id = this.offerid;

    console.log(this.properties);
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

  onSentMessage(messageForm: NgForm) {
    if (!messageForm.valid) {
      return;
    }

    const messageinfo = {
      offer_id : this.offerid,
      url : this.offerDetails.offerinfo.url,
      account : this.messageAccountList.find(i => i.id == this.newMessage.account_id),
      messagetext : this.messageTextList.find(i => i.id == this.newMessage.messagetext_id)
    };
    const new_task: TaskModel = {
      type_id : 3,
      origin : JSON.stringify(this.task_origin),
      information : JSON.stringify(messageinfo)
    };
    console.log(new_task);
    this.taskService.createNewTask(new_task).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 201) {
            this.requestList.push(data.body.task_id);

            this.toastr.success(data.body.message);
            messageForm.reset();
            setInterval(() => {
              this.getProgressDetails();
            }, 1000);

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

  arrayRemove(arr, value) {

    return arr.filter(function(ele) {
      return ele !== value;
    });
  }

  onArrowClick(isLeft: boolean) {
    this.disableDetections();

    const nextIndex = this.selectedImageIndex + (isLeft ?  -1 : 1);
    const images = this.imageData.images;

    if (images.length > nextIndex - 1 && nextIndex > -1) {
      this.imgPopupURL = images[nextIndex].imageurl;
      this.imgPopupName = images[nextIndex].path;
      this.selectedImageIndex = nextIndex;
      this.selectedImage = images[nextIndex];
    }

  }

  getOffer(isNext: boolean) {
    let offersIds: number[] = [];

    this.offerService.getOffers().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code === 200) {
            offersIds = data.body.result.map(
              offer => offer.id
            );

            const currentOfferIndex = offersIds.indexOf(this.offerid);
            const nextOfferIndex = currentOfferIndex + (isNext ? 1 : -1);

            if (nextOfferIndex < offersIds.length && nextOfferIndex > -1) {
              this.router.navigateByUrl('/offerdetail/' + offersIds[nextOfferIndex]);
            }
          } else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
      }
    );
  }

  splitBySets() {
    this.offerDescriptionSplitBySets = [];
    this.recognizeSets = [];

    const offerDescription: string = this.offerDetails.offerinfo.title + "<br>" +  this.offerDetails.offerinfo.description;
    const splitBySets = offerDescription.substring(4, offerDescription.length - 4)
      .split(/"[^"]*"|'[^']*'|(\d{4,5})/g);
    splitBySets.forEach(((value, index) => {
      if (index % 2 === 0) {
        this.offerDescriptionSplitBySets.push(value);
      } else {
        let set = {
          "value" : value,
          "class" : "badge badge-info"
        }

        if(this.possiblesetData && this.possiblesetData.find(item => item.setno == value)){
          set['class'] = 'badge badge-success';
        }
        this.recognizeSets.push(set);
      }
    }));
  }

  getMessageText(messagetextId: number): string {
    const messageText = this.messageTextList ? this.messageTextList.find(i => i.id == messagetextId) : null;
    return messageText ? messageText.message : '';
  }

  onSetClick(setNumber: string) {
    this.newpossiblesetDetail.setno = setNumber;
    this.addSetToPotentialSets();
  }

  onImageSetClick(i: number) {
    const ctx = this.canvas.nativeElement.getContext('2d');

    for (let index = 0; index < this.selectedImage.detections.length; index++) {
      const x = this.selectedImage.detections[index].box.left * this.canvas.nativeElement.width;
      const y = this.selectedImage.detections[index].box.top * this.canvas.nativeElement.height;
      const w = this.selectedImage.detections[index].box.width * this.canvas.nativeElement.width;
      const h = this.selectedImage.detections[index].box.height * this.canvas.nativeElement.height;
      if (index !== i) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'grey';
        ctx.strokeRect(x, y, w, h);
        this.selectedImage.detections[index].selected = false;

      } else {
        this.selectedImage.detections[index].selected = !this.selectedImage.detections[i].selected;
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.selectedImage.detections[index].selected ? '#28a745' : 'grey';
        ctx.strokeRect(x, y, w, h);
      }
    }
  }
}
