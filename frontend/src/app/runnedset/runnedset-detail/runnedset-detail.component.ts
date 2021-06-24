import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SortedPartModel } from 'src/app/models/sortedpart-model';
import { MissingPartService } from 'src/app/services/missingpart.service';
import { SetdataService } from 'src/app/services/setdata.service';
import { SortedPartService } from 'src/app/services/sortedpart.service';
import { RunnedSetService } from 'src/app/services/runnedset.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';

@Component({
  selector: 'app-runnedset-detail',
  templateUrl: './runnedset-detail.component.html',
  styleUrls: ['./runnedset-detail.component.css']
})
export class RunnedSetDetailComponent implements OnInit {

  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  public setdataDetails;
  public runInfo = {
    title: 'Run Information',
    rowData: [
      { key: 'runinfo.title', name: 'Run'},
      { key: 'collection_id', name: 'Collection id'},
      { key: 'pusherinfo.name', name: 'Pusher'}
    ]
  };
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
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Part', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Color', name: 'partinfo.color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Avg € (stock)', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg € (sold)', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Exp', name: 'quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Sort', name: 'sorted_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Mis', name: 'missing_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Purch', name: 'purchased_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
  ];

  public sortedPartData: any;
  public sum_sortedPartData: any;
  public sortedPartColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Part', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Color', name: 'partinfo.color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Avg € (stock)', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg € (sold)', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },

  ];

  public wishlist :any;
  public missingPartData: any;
  public sum_missingPartData: any;
  public missingPartColumns = [
    { title: 'exp id', name: 'expectedpart_id', size: '65', minSize: '65', datatype: { type: 'number' } },
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Part', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Color', name: 'partinfo.color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Avg € (stock)', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg € (sold)', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Mis', name: 'missing_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Purch', name: 'purchased_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Sum € Stock', name: 'all_qty_avg_price_stock', size: '30', minSize: '30' , datatype: { type: 'price' }},
    { title: 'Sum € Sold', name: 'all_qty_avg_price_sold', size: '30', minSize: '30' , datatype: { type: 'price' }},
  ];


  public expectedMinifigData: any;
  public expectedMinifigSumData: any;
  public expectedMinifigColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '80', minSize: '80', datatype: { type: 'image' } },
    { title: 'Part', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Avg € (stock)', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg € (sold)', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Exp', name: 'quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Sort', name: 'sorted_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Mis', name: 'missing_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Purch', name: 'purchased_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
  ];
  

  collectionService: any;
  public currentTabExpected = '';

  constructor(private activatedRoute: ActivatedRoute,
    private missingpartsService: MissingPartService,
    private runnedsetdataService: RunnedSetService,
    private sortedpartsService: SortedPartService,
    private setdataService: SetdataService,
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

  getAllPartdataSorted() {
    this.sortedpartsService.getSortedPartsBySetId(this.setdataDetails.expectedset_id).subscribe(
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
    this.missingpartsService.getMissingPartsBySetId(this.setdataDetails.expectedset_id).subscribe(
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

  bindData() {
    this.runnedsetdataService.getRunnedSetdataById(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.setdataDetails = data.body.result[0];
            this.getAllPartdataExpected();
            this.getAllPartdataSorted();
            this.getAllPartdataMissing();
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

  public onExternalClick(data) {
    if(data && data.origin_url)
    {
      let url: string = '';
      if (!/^http[s]?:\/\//.test(data.origin_url)) {
        url += 'http://';
      }

      url += data.origin_url;
      window.open(url, '_blank');
    }
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

  getAllPartdataExpected() {
    this.setdataService.getExpectedPartdataBySetid(this.setdataDetails.expectedset_id).subscribe(
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
    
  onAddSortedPartClick(rowdata){
    if((rowdata.sorted_quantity + rowdata.purchased_quantity) < rowdata.quantity) {  
      rowdata.sorted_quantity = rowdata.sorted_quantity + 1
      let sortedpart : SortedPartModel = new SortedPartModel
      sortedpart.expectedpart_id = rowdata.expectedpart_id;
      sortedpart.run_id = this.setdataDetails.run_id;
      sortedpart.detected = 1;
      this.sortedpartsService.createSortedPart(sortedpart).subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code == 201) {
            
            this.toastr.success(data.body.message);
            this.getAllPartdataExpected();
            this.getAllPartdataSorted();
            this.getAllPartdataMissing();
            }
            else if (data.body && data.body.code == 403) {
              this.router.navigateByUrl("/login");
            }
            else
            {
              this.toastr.error(data.body.message);
            }
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        }
      );
    }
    else
    {
      this.toastr.info("needed quantity already sorted/purchased");
    }
  }

  onRemoveSortedPartClick(rowdata){
    if(rowdata.sorted_quantity > 0) {  
      this.sortedpartsService.DeleteSortedPart(rowdata.expectedpart_id).subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code == 201) {
              this.toastr.success("Removed Sorted Part successfully.");
              this.getAllPartdataExpected();
              this.getAllPartdataSorted();
              this.getAllPartdataMissing();
            }
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        }
      );
    }
    else
    {
      this.toastr.info("sorted/purchased quantity alreday 0.");
    }
  }

  getAllMinifigsExpected() {
    this.setdataService.getExpectedMinifigdataBySetid(this.setdataDetails.expectedset_id).subscribe(
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

    
  checkallExpectedParts(){

    const options = {
      title: 'Are you sure you want add all parts as sorted parts?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.expectedPartData.forEach(part => {
          var i;
          for (i = 1; i <= (part.quantity - part.sorted_quantity); i++) {
            let sortedpart : SortedPartModel = new SortedPartModel
            sortedpart.expectedpart_id = part.expectedpart_id;
            sortedpart.run_id = this.setdataDetails.run_id;
            sortedpart.detected = 1;
            this.sortedpartsService.createSortedPart(sortedpart).subscribe( (data) => {
              if (data) {
                if (data.body && data.body.code != 201) {
                  this.toastr.error(data.body.message);
                }}});
            }
        });
        this.getAllPartdataExpected();
        this.getAllPartdataSorted();
        this.getAllPartdataMissing();
      } else {
        console.log('Cancel');
      }
    });
  }



}
