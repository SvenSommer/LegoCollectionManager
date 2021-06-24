import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SetdataService } from 'src/app/services/setdata.service';
import { RunnedSetService } from 'src/app/services/runnedset.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';

@Component({
  selector: 'app-set-detail',
  templateUrl: './set-detail.component.html',
  styleUrls: ['./set-detail.component.css']
})
export class SetDetailComponent implements OnInit {

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

   public runnedSetsData: any;
  public runnedSetsColumns = [
    { title: 'Collection', name: 'collection_id', size: '65', minSize: '65', datatype: { type: 'number' } },
    { title: 'Run', name: 'runinfo.title', size: '65', minSize: '65' },
    { title: 'Expectedset ', name: 'expectedset_id', size: '65', minSize: '65', datatype: { type: 'number' } },
  ];
 

  public partData: any;
  public partSumData: any;
  public partColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Partno - Color Id', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Color', name: 'partinfo.color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Quantity', name: 'quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Extra Quantity', name: 'partinfo.extra_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Avg € (stock)', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg € (sold)', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },
  ];

  public minifigData: any;
  public minifigSumData: any;
  public minifigColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '80', minSize: '80', datatype: { type: 'image' } },
    { title: 'Part', name: 'partinfo.part_no', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Quantity', name: 'partinfo.quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Avg € (stock)', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg € (sold)', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },

  ];

  public purchaseInfo = {
    title: 'Purchase Information',
    rowData: [
      { key: 'setinfo.no', name: 'Setno',dataType:{type:'set_detail_link', target: 'no'}},
      { key: 'setinfo.year', name: 'Year'},
      { key: 'setinfo.weight_g', name: 'Weight',dataType:{type:'weight', unit:"g"}},
      { key: 'setinfo.size', name: 'Size'},
      { key: 'setinfo.min_price', name: 'Min Price', dataType: { type: 'price' }},
      { key: 'setinfo.max_price', name: 'Max Price', dataType: { type: 'price' }},
      { key: 'setinfo.avg_price', name: 'avg Price', dataType: { type: 'price' }},
      { key: 'created', name: 'Created', dataType: { type: 'date' }}
    ]
  };




  constructor(private activatedRoute: ActivatedRoute,
    private setdataService: SetdataService,
    private runnedSetService : RunnedSetService,
    private router: Router, private toastr: ToastrService) { }

    public id = 0;
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        if (this.id > 0) {
          this.bindData();
          this.getAllSubsetPartdata();
          this.getAllSubsetMinifigs();
         
        }
      });
    }

  bindData() {
    this.setdataService.getSetdataById(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.setdataDetails = data.body.result[0];
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

  getAllRunnedSets() {
    this.runnedSetService.getRunnedSetsBySetno(this.setdataDetails.setinfo.no).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
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

  onRunnedSetCellClick(data){
    this.router.navigateByUrl("/runnedsetdetail/" + data.id).then((bool) => { }).catch()
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

  getAllSubsetPartdata() {
    this.setdataService.getSubsetPartdataBySetid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.partData = data.body.parts;
            this.partSumData = data.body.sum_parts;
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

  getAllSubsetMinifigs() {
    this.setdataService.getSubsetMinifigdataBySetid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200 && data.body.minifigs.length > 0) {
            this.minifigData = data.body.minifigs;
            this.minifigSumData = data.body.sum_minifigs;
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
