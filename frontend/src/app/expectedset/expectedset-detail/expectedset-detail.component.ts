import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { ExpectedSetService } from 'src/app/services/expectedset.service';
import { MissingPartService } from 'src/app/services/missingpart.service';
import { PurchasedPartService } from 'src/app/services/purchasedpart.service';
import { RunnedSetService } from 'src/app/services/runnedset.service';
import { SetdataService } from 'src/app/services/setdata.service';
import { SortedPartService } from 'src/app/services/sortedpart.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';

@Component({
  selector: 'app-expectedset-detail',
  templateUrl: './expectedset-detail.component.html',
  styleUrls: ['./expectedset-detail.component.css']
})
export class ExpectedsetDetailComponent implements OnInit {

  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;


  public setdataDetails;
  public setInfo = {
    title: 'Set Information',
    rowData: [
      { key: 'setinfo.no', name: 'Setno',dataType:{type:'set_detail_link', target: 'no'}},
      { key: 'setinfo.name', name: 'Name',dataType:{type:'set_detail_link', target: 'no'}},
      { key: 'setinfo.year', name: 'Year'},
      { key: 'setinfo.size', name: 'Size'},
      { key: 'setinfo.category_name', name: 'Category'},
      { key: 'setinfo.weight_g', name: 'Weight',dataType:{type:'weight', unit:"g"}},
      { key: 'setinfo.complete_part_count', name: 'Part Count'},
      { key: 'setinfo.complete_minifigs_count', name: 'Minifig Count'},
      { key: 'setproperties.comments', name: 'Comments'},
      { key: 'setproperties.condition', name: 'Condition'},
      { key: 'setproperties.instructions', name: 'Instructions'},
    ]
  }; 
   public priceInfo = {
    title: 'Price Information',
    rowData: [
      { key: 'setinfo.min_price', name: 'BL Min Price', dataType: { type: 'price' }},
      { key: 'setinfo.avg_price', name: 'BL avg Price', dataType: { type: 'price' }},
      { key: 'setinfo.max_price', name: 'BL Max Price', dataType: { type: 'price' }},
      { key: 'setinfo.sumPartsAndMinifigs.sumPartsAndMinifigs_Qty_avg_price_sold', name: 'All Price Sold', dataType: { type: 'price' }},
      { key: 'setinfo.sumPartsAndMinifigs.sumPartsAndMinifigs_Qty_avg_price_stock', name: 'All Price Stock', dataType: { type: 'price' }},
      { key: 'setinfo.sumPartsAndMinifigs.sumPart_Qty_avg_price_sold', name: 'Parts Price Sold', dataType: { type: 'price' }},
      { key: 'setinfo.sumPartsAndMinifigs.sumPart_Qty_avg_price_stock', name: 'Parts Price Stock', dataType: { type: 'price' }},
      { key: 'setinfo.sumPartsAndMinifigs.sumMinifig_Qty_avg_price_sold', name: 'Minifigs Price Sold', dataType: { type: 'price' }},
      { key: 'setinfo.sumPartsAndMinifigs.sumMinifig_Qty_avg_price_stock', name: 'Minifigs Price Stock', dataType: { type: 'price' }},
    ]
  }; 

  public expectedPartData: any;
  public expectedPartSumData: any;
  public expectedPartColumns = [
    { title: 'id', name: 'expectedpart_id', size: '65', minSize: '65'},
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' }},
    { title: 'Part', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Color', name: 'partinfo.color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Avg Price Stock', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg Price Sold', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Exp', name: 'quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Sort', name: 'sorted_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Miss', name: 'missing_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Purch', name: 'purchased_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},


  ];

  public sortedPartData: any;
  public sum_sortedPartData: any;
  public sortedPartColumns = [
    { title: 'Run id', name: 'run_id', size: '30', minSize: '30' },
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Part', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Color', name: 'partinfo.color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Avg Price Stock', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg Price Sold', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },

  ];

  public wishlist :any;
  public missingPartData: any;
  public sum_missingPartData: any;
  public missingPartColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Part', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Color', name: 'partinfo.color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Avg Price Sold', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg Price Stock', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Miss', name: 'missing_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Purch', name: 'purchased_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Sum € Sold', name: 'all_qty_avg_price_sold', size: '30', minSize: '30' , datatype: { type: 'price' }},
    { title: 'Sum € Stock', name: 'all_qty_avg_price_stock', size: '30', minSize: '30' , datatype: { type: 'price' }},
  ];


  public expectedMinifigData: any;
  public expectedMinifigSumData: any;
  public expectedMinifigColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '80', minSize: '80', datatype: { type: 'image' } },
    { title: 'Part', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Avg Price Sold', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg Price Stock', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Exp', name: 'quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Sort', name: 'sorted_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Miss', name: 'missing_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Purch', name: 'purchased_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
  ];



  public purchasedPartsSumData: any;
  public purchasedPartsData: any;
  public purchasedPartsColumns = [
    { title: 'Image', name: 'image_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Name', name: 'name', size: '30', minSize: '30' },
    { title: 'Partno', name: 'no', size: '30', minSize: '30' },
    { title: 'Color Id', name: 'color_id', size: '30', minSize: '30'  , datatype: { type: 'number' }},
    { title: 'Color Name', name: 'color_name', size: '30', minSize: '30' },
    { title: 'New Or Used', name: 'new_or_used', size: '30', minSize: '30' },
    { title: 'Quantity', name: 'quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Avg Price Sold', name: 'qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg Price Stock', name: 'qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Price', name: 'unit_price', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Price Final', name: 'unit_price_final', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Remarks', name: 'remarks', size: '30', minSize: '30' },
    { title: 'Description', name: 'description', size: '30', minSize: '30'},

  ];

 public runnedSetsData: any;
  public runnedSetsColumns = [
    { title: 'Sorter', name: 'pusherinfo.sorter', size: '30', minSize: '30' },
    { title: 'Run Name', name: 'runinfo.title', size: '65', minSize: '65'},
    { title: 'Pusher', name: 'pusherinfo.name', size: '30', minSize: '30' },
  ];

  public orderitemData: any; 
  collectionService: any;
  public currentTabExpected = '';
  
  constructor(private activatedRoute: ActivatedRoute,
    private missingpartsService: MissingPartService,
    private expectedsetService: ExpectedSetService,

    private runnedSetService: RunnedSetService,
    private sortedpartsService: SortedPartService,
    private setdataService: SetdataService,
    private purchasedpartsService: PurchasedPartService,
    private router: Router, 
    private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

    public id = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id > 0) {
        this.bindData();
      }
    });
  }

  bindData() {
    this.expectedsetService.getExpectedSetId(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.setdataDetails = data.body.result[0];
            this.getAllPartdataExpected();
            this.getAllPartdataSorted();
            this.getAllPartdataMissing();
            this.getAllPartdataPurchased();
            this.getAllRunnedSets();
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


  getAllPartdataSorted() {
    this.sortedpartsService.getSortedPartsBySetId(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.sortedPartData = data.body.sorted_parts;
            this.sum_sortedPartData = data.body.sum_sorted_parts[0];
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

  getAllPartdataMissing() {
    this.missingpartsService.getMissingPartsBySetId(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.missingPartData = data.body.missing_parts;
            this.sum_missingPartData = data.body.sum_missing_parts[0];
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

  getAllPartdataExpected() {
    this.setdataService.getExpectedPartdataBySetid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedPartData = data.body.expected_parts;
            this.expectedPartSumData = data.body.sum_expected_parts[0];
            this.currentTabExpected = 'Expected Parts';
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

  getAllMinifigsExpected() {
    this.setdataService.getExpectedMinifigdataBySetid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedMinifigData = data.body.expected_minifigs;
            this.expectedMinifigSumData = data.body.sum_expected_minifigs[0];
          
            this.currentTabExpected = 'Expected Minifigs';
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

    getAllPartdataPurchased() {
      this.purchasedpartsService.getPurchasedPartsbyExpectedSetid(this.id).subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code == 200 && data.body.parts.length > 0) {
              this.purchasedPartsData = data.body.parts;
              this.purchasedPartsSumData = data.body.summary[0];
              
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
    
    getAllRunnedSets() {
      this.runnedSetService.getRunnedSetByExpectedSetId(this.id).subscribe(
        (data) => {
          if (data) {
            console.log("data",data)
            if (data.body && data.body.code == 200 && data.body.result.length > 0) {
              this.runnedSetsData = data.body.result;
              console.log("this.runnedSetsData",this.runnedSetsData)
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
      this.imgPopupURL =  row.setinfo.image_url;
      this.imgPopupName = row.no + " - " + row.setinfo.name;
      this.imagePopup.open();
    }

    createBricklinkWishlistFile(){
      var doc  = document.implementation.createDocument("", "", null);
      var inventoryElem = doc.createElement("INVENTORY");
      for (var i = 0; i < this.missingPartData.length; i++) {
          var itemElem = doc.createElement("ITEM");
          var itemTypeElem = doc.createElement("ITEMTYPE");
          if(this.missingPartData[i].type == "PART")
              itemTypeElem.innerHTML = "P"; 
          if (this.missingPartData[i].type == "MINIFIG")
              itemTypeElem.innerHTML = "M";
          itemElem.appendChild(itemTypeElem);
          var itemIdElem = doc.createElement("ITEMID");
          itemIdElem.innerHTML = this.missingPartData[i].partno
          itemElem.appendChild(itemIdElem);
          var itemColorElem = doc.createElement("COLOR");
          itemColorElem.innerHTML = this.missingPartData[i].color_id
          itemElem.appendChild(itemColorElem);
          var itemMinQtyElem = doc.createElement("MINQTY");
          itemMinQtyElem.innerHTML = this.missingPartData[i].missing_quantity
          itemElem.appendChild(itemMinQtyElem);
          var itemMaxPriceElem = doc.createElement("MAXPRICE");
          itemMaxPriceElem.innerHTML = this.missingPartData[i].qty_avg_price_sold
          itemElem.appendChild(itemMaxPriceElem);
          inventoryElem.appendChild(itemElem);
        }
        doc.appendChild(inventoryElem);
      this.wishlist = doc;
      console.log("https://www.bricklink.com/v2/wanted/upload.page", new XMLSerializer().serializeToString(doc))
      //document.open('data:Application/octet-stream,' + encodeURIComponent(doc));
    }

    onRowRunnedSetClick(data) {
      console.log(data)
      this.router.navigateByUrl('/runnedsetdetail/' + data.id).then((bool) => { }).catch();
    }

}
