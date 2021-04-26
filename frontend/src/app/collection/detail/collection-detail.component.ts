import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { CollectionModel } from 'src/app/models/collection-model';
import { TaskModel } from 'src/app/models/task-model';
import { RunEditComponent } from 'src/app/run/run-edit/run-edit.component';
import { CollectionService } from 'src/app/services/collection.service';
import { TaskService } from 'src/app/services/task.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { CollectionEditComponent } from '../edit/collection-edit.component';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements OnInit {

  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  @ViewChild('collectionEdit') collectionEdit: CollectionEditComponent;
  @ViewChild('runEdit') runEdit: RunEditComponent;

  public collectionDetails;
  public collectionSummary;
  public uniqueDetails;
  public setDownloadingRequestData = [];
  public requestList = new Array<string>();

  public runsColumns = [
    { title: 'Run #', name: 'run_no', size: '30', minSize: '30' },
    { title: 'Status', name: 'status.name', size: '25%', minSize: '90' },
    { title: 'Parts identified', name: 'identified_parts.sumTotal', size: '25%', minSize: '80' },
    { title: 'Parts unidentified', name: 'unlabeled_parts.sumPartUnlabeled', size: '25', minSize: '25' },
    { title: 'Colors unidentified', name: 'unlabeled_parts.sumColorUnlabeled', size: '25', minSize: '25' },
    { title: 'Sorted Parts', name: 'sorted_parts.detected_parts', size: '50', minSize: '50' },
    { title: 'Sorted (undetected)', name: 'sorted_parts.undetected_parts', size: '50', minSize: '50' },
    { title: 'Created', name: 'created', size: '25%', minSize: '100', datatype: { type: 'date' } },
  ];

  public expSetsColumns = [
    { title: 'Image', name: 'setinfo.thumbnail_url', size: '70', minSize: '70', datatype: { type: 'image' } },
    { title: 'setNo', name: 'setNo', size: '30', minSize: '30' },
    { title: 'Category', name: 'setinfo.category_name', size: '30%', minSize: '50' },
    { title: 'Name', name: 'setinfo.name', size: '70%', minSize: '90' },
    { title: 'year', name: 'setinfo.year', size: '25', minSize: '25' },
    { title: 'weight(g)', name: 'setinfo.weight_g', size: '25', minSize: '25' },
    { title: 'parts', name: 'setinfo.complete_part_count', size: '25', minSize: '25' },
    { title: 'Parts Identified(%)', name: 'partsidentified_percentage', size: '25', minSize: '25' },
    { title: 'Minifigs', name: 'setinfo.complete_minifigs_count', size: '25', minSize: '25' },
    { title: 'Min price(€)', name: 'setinfo.min_price', size: '35', minSize: '35', datatype: { type: 'price' } },
    { title: 'Avg price(€)', name: 'setinfo.avg_price', size: '35', minSize: '35', datatype: { type: 'price' } }
  ];

  public suggSetsColumns = [
    { title: 'Image', name: 'thumbnail_url', size: '70', minSize: '70', datatype: { type: 'image' } },
    { title: 'Set No', name: 'setNo', size: '30', minSize: '30' },
    { title: 'Category', name: 'category_name', size: '50', minSize: '50' },
    { title: 'Name', name: 'name', size: '25%', minSize: '90' },
    { title: 'Year', name: 'year', size: '25', minSize: '25' },
    { title: 'Weight(g)', name: 'weight_g', size: '25', minSize: '25' },
    { title: 'Parts', name: 'parts_existing', size: '25', minSize: '25' },
    { title: 'Complete %', name: 'complete_percentage', size: '25', minSize: '25' },
    { title: 'Minifigs', name: 'complete_minifigs_count', size: '25', minSize: '25' },
    { title: 'Min price (€)', name: 'min_price', size: '25', minSize: '25', datatype: { type: 'price' } },
    { title: 'Max price (€)', name: 'max_price', size: '25', minSize: '25', datatype: { type: 'price' } },
  ];

  public ExpPartsColumns = [
    { title: 'Image', name: 'color_thumbnail_url', size: '70', minSize: '70', datatype: { type: 'image' } },
    { title: 'Part No', name: 'part_no', size: '30', minSize: '30' },
    { title: 'name', name: 'name', size: '25%', minSize: '90' },
    { title: 'Set No', name: 'setNos', size: '30', minSize: '30' },
    { title: 'Total Quantity', name: 'total_quantity', size: '30', minSize: '30' },
    { title: 'Status', name: 'status_name', size: '30', minSize: '30' },
    { title: 'Avg € (sold)', name: 'qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },

  ];

  public UnsettedPartsColumns = [
    { title: 'Image', name: 'thumbnail_url', size: '70', minSize: '70', datatype: { type: 'image' } },
    { title: 'No', name: 'partNo', size: '25%', minSize: '30' },
    { title: 'Color Id', name: 'color_id', size: '25%', minSize: '90' },
    { title: 'Appears in sets', name: 'super_set_count', size: '25%', minSize: '90' },
    { title: 'Downloaded Sets', name: 'downloaded_sets', size: '25%', minSize: '90' },
    { title: 'Part in Sets', name: 'part_in_sets_of_collection', size: '90', minSize: '90' },
    { title: 'Super Set Count', name: 'super_set_count', size: '90', minSize: '90' },


  ];

  public ExpMinifigsColumns = [
    { title: 'Part No', name: 'part_no', size: '35', minSize: '35' },
    { title: 'Image', name: 'thumbnail_url', size: '70', minSize: '70', datatype: { type: 'image' } },
    { title: 'Sets No', name: 'setNos', size: '35', minSize: '35' },
    { title: 'Total Quantity', name: 'total_quantity', size: '25', minSize: '25' },
    { title: 'Description', name: 'name', size: '35%', minSize: '90' },
    { title: 'Status Name', name: 'status_name', size: '25%', minSize: '90' },
    { title: 'Avg € (sold)', name: 'qty_avg_price_sold', size: '50', minSize: '90', datatype: { type: 'price' } },
  ];

  public purchaseInfo = {
    title: 'Purchase Information',
    rowData: [
      { key: 'collectioninfo.origin', name: 'Origin', dataType: { type: 'link', target: 'collectioninfo.origin_url' } },
      { key: 'collectioninfo.seller', name: 'Seller' },
      { key: 'collectioninfo.weight_kg', name: 'Weight', dataType: { type: 'weight' } },
      { key: 'collectioninfo.cost', name: 'Cost(per Weight)', dataType: { type: 'price' } },
      { key: 'collectioninfo.cost_per_kilo', name: 'Cost Per Kilo', dataType: { type: 'price_per_kilo' } },
      { key: 'collectioninfo.porto', name: 'Porto', dataType: { type: 'price' } },
      { key: 'collectioninfo.purchase_date', name: 'Purchased', dataType: { type: 'date' } },
      { key: 'created', name: 'Created', dataType: { type: 'date' } },
    ]
  };

  public setsAndPartsInfo = {
    title: 'Expected Sets & Parts',
    rowData: [
      { key: 'expected_sets.sumSet', name: 'Sets Identified', dataType:{type:'number'}},
      { key: 'expected_sets.sumMin_price', name: 'All Sets Price (Min)', dataType:{type:'price'}},
      { key: 'expected_sets.sumAvg_price', name: 'All Sets Price (Avg)', dataType:{type:'price'}},
      { key: 'expected_sets.sumMax_price', name: 'All Sets Price (Max)', dataType:{type:'price'}},
      { key: 'expected_parts.sumItemsWeight_g', name: 'Sum Parts Weight', dataType:{type:'weight', unit:"g"}},
      { key: 'expected_parts.sumPartsQuantity', name: 'Sum Parts Count'},
      { key: 'expected_parts.sumMinifigQuantity', name: 'Sum Minifigs Count'},
      { key: 'expected_parts.sumItemsQty_avg_price_sold', name: 'All part Price (sold)', dataType:{type:'price'}},
      { key: 'expected_parts.sumItemsQty_avg_price_stock', name: 'All part Price (stock)', dataType:{type:'price'}}
    ]
  };

  public runsData: any;
  public expectedSets: any;
  public suggestedSets: any;
  public expectedParts: any;
  public unsettedParts: any;
  public expectedMinifigs: any;
  public currentTab = '';
  public isMoreFieldOpenForSet = false;
  public newSetDetails = {
    "collectionid": 0,
    "setnumber": "",
    "comments": "",
    "instructions": "",
    "condition": "",
    "download_prices": true,
    "report_progress": true
  };
  public newRunDetail = {
    "id": 0,
    "no": 500,
    "collection_id": 0,
    "sorter_id": 1,
    "imagefolder": "/partimages/collection1/run500/"
  }
  public isSetFormSubmitted = false;


  constructor(private activatedRoute: ActivatedRoute,
    private collectionService: CollectionService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private taskService: TaskService) { }

  public collectionid = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.collectionid = params['id'];
      if (this.collectionid > 0) {
        this.newSetDetails.collectionid = this.collectionid;
        this.newRunDetail.collection_id = this.collectionid;
        this.bindData();
        this.getAllRuns();
        this.getExpectedSets();
      }
    });
  }



  bindData() {
    this.collectionService.getCollectionById(this.collectionid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.collectionDetails = data.body.result[0];
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

  onEditClick() {
    this.collectionEdit.open(this.collectionDetails);
  }

  addNewCollection(newData: CollectionModel) {
    // this.data.push(newData);
    // this.data = Object.assign([],this.data);
    this.bindData();
  }

  getAllRuns() {
    this.collectionService.getRuns(this.collectionid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.runsData = data.body.result;
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

  onCreateNewRunClick() {
    this.collectionService.getRunsNextnoByCollectionid(this.collectionid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.newRunDetail.no = data.body.result[0].next_runno;
            this.runEdit.open(this.newRunDetail);
          }
        }
      }
    );
  }


  onRunCellClick(data) {
    this.router.navigateByUrl("/rundetail/" + data.run_id).then((bool) => { }).catch()
  }


  onExpectedSetCellClick(data){
    console.log(data)
    this.router.navigateByUrl("/setdetail/" + data.setinfo.id).then((bool) => { }).catch()
  }

  getExpectedSets() {
    // this.currentTab = '';

    this.collectionService.getExpectedSets(this.collectionid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedSets = data.body;
            this.currentTab = 'Expected Sets';
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

  getSuggestedSets() {
    this.collectionService.getSuggestedSets(this.collectionid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.suggestedSets = data.body.setsResult;
            this.currentTab = 'Suggested Sets';
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

  getExpectedParts() {

    this.collectionService.getExpectedParts(this.collectionid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedParts = data.body.result;
            this.currentTab = 'Expected Parts';
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

  getUnsettedParts() {

    this.collectionService.getUnsettedParts(this.collectionid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.unsettedParts = data.body.result;
            this.currentTab = 'Unsetted Parts';

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

  getExpectedMinifigs() {

    this.collectionService.getExpectedMinifigs(this.collectionid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedMinifigs = data.body.result;
            this.currentTab = 'Expected Minifigs';
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
    this.newSetDetails.setnumber.replace(/ /g, "");
    var task_origin = {
      collection_id : this.collectionid,
    }

    var setinformation = {
      collectionid : this.collectionid,
      setno : this.newSetDetails.setnumber,
      comments : this.newSetDetails.comments,
      instructions : this.newSetDetails.instructions,
      condition : this.newSetDetails.condition,
      download_prices : this.newSetDetails.download_prices,
      report_progress : this.newSetDetails.report_progress
    }

    var new_task : TaskModel = {
      type_id : 1,
      origin : JSON.stringify(task_origin),
      information :  JSON.stringify(setinformation)
    }

    setInterval(() => {
      this.getProgressDetails();
    }, 1000);

    this.taskService.createNewTask(new_task).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 201) {
            this.requestList.push(data.body.task_id);

            this.toastr.success(data.body.message);

            this.newSetDetails = {
              "collectionid": this.collectionid,
              "setnumber": "",
              "comments": "",
              "instructions": "",
              "condition": "",
              "download_prices": true,
              "report_progress": true
            };
            this.isSetFormSubmitted = false;
            form.reset();
            this.getExpectedSets();
          }
          else if (data.body && data.body.code == 403) {
            this.router.navigateByUrl("/login");
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

  public onImgPopupClose() {
    this.imgPopupURL = '';
    this.imgPopupName = '';

  }

  public onImgClick(row) {
    this.imgPopupURL = row.image_url ?? row.thumbnail_url;
    this.imgPopupName = [row?.no, row?.name, row?.color_name].join(' - ');
    this.imagePopup.open();
  }

  public onExternalClick(data) {
    if (data && data.origin_url) {
      let url: string = '';
      if (!/^http[s]?:\/\//.test(data.origin_url)) {
        url += 'http://';
      }

      url += data.origin_url;
      window.open(url, '_blank');
    }
  }

  public onDeleteClick() {
    let options = {
      title: 'Are you sure you want to delete this collection?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.collectionService.deleteCollection(this.collectionid).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code == 200) {
               // Message should be data.body.message
               this.toastr.success("Record deleted successfully.");
               this.router.navigateByUrl("/collection");
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

  getProgressDetails() {
    if (!this.requestList || this.requestList.length <= 0) {
      return;
    }
    this.taskService.getProgressDetails(this.requestList.join(",")).subscribe(
      (data) => {
        if (data.body && data.body.code == 200) {
          this.setDownloadingRequestData = Object.assign([], data.body.result);
          for (var i = 0; i <= this.setDownloadingRequestData.length - 1; i++) {
            var info = JSON.parse(this.setDownloadingRequestData[i].information)
            this.setDownloadingRequestData[i].setNo = info.setno;
            this.setDownloadingRequestData[i].name = info.name;
            this.setDownloadingRequestData[i].image_url = info.image_url;
            var task_id = this.setDownloadingRequestData[i].task_id;
            if (this.setDownloadingRequestData[i].progress == 100) {
              // Message should be data.body.message
              this.toastr.success(`Set ${info.setno} successfully downloaded.`);
              this.requestList = this.arrayRemove(this.requestList, task_id);
              this.setDownloadingRequestData = [];
              i++;
              this.bindData();
              this.getExpectedSets(); 
            }
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  arrayRemove(arr, value) {

    return arr.filter(function (ele) {
      return ele != value;});
    
    }


  onRowExpectedSetDeleteClick(data){
    let options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {

        this.collectionService.deleteExpectedSetBySetId(data.id).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code == 200) {
               // Message should be data.body.message
               this.toastr.success("Set deleted successfully.");
               this.bindData();
               this.getExpectedSets();
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
}
