import { HttpErrorResponse } from '@angular/common/http';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IdentifiedPartDBModel } from 'src/app/models/identifiedpartdb-model';
import { SortedPartModel } from 'src/app/models/sortedpart-model';
import { IdentifiedpartService } from 'src/app/services/identifiedpart.service';
import { SetdataService } from 'src/app/services/setdata.service';
import { SortedPartService } from 'src/app/services/sortedpart.service';
import { SortedSetService } from 'src/app/services/sortedset.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';

@Component({
  selector: 'app-sortedset-detail',
  templateUrl: './sortedset-detail.component.html',
  styleUrls: ['./sortedset-detail.component.css']
})
export class SortedsetDetailComponent implements OnInit {

  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  public setdataDetails;

  public expectedPartData: any;
  public expectedPartColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Partno - Color Id', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Color', name: 'partinfo.color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Quantity', name: 'quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Extra Quantity', name: 'partinfo.extra_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},

    { title: 'Avg € (stock)', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg € (sold)', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },

  ];

  public sortedPartData: any;
  public sortedPartColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Partno - Color Id', name: 'partinfo.partnocolid', size: '30', minSize: '30' },
    { title: 'Color', name: 'partinfo.color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Quantity', name: 'quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Extra Quantity', name: 'partinfo.extra_quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Avg € (stock)', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg € (sold)', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },

  ];


  public expectedMinifigData: any;
  public expectedMinifigColumns = [
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
    private identifiedpartService: IdentifiedpartService,
    private sortedsetdataService: SortedSetService,
    private sortedpartsService: SortedPartService,
    private setdataService: SetdataService,
    private router: Router, private toastr: ToastrService) { }

    public id = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id > 0) {
        this.bindData();
        this.getAllPartdataSorted();
      }
    });
  }

  getAllPartdataSorted() {
    this.sortedpartsService.getSortedPartsBySetId(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.sortedPartData = data.body.result;
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
    this.sortedsetdataService.getSortedSetdataById(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.setdataDetails = data.body.result[0];
            this.getAllPartdataExpected(this.setdataDetails.setinfo.id);
            this.getAllMinifigsExpected(this.setdataDetails.setinfo.id);
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

  getAllPartdataExpected(setid) {
    this.setdataService.getPartdataBySetid(setid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedPartData = data.body.result;
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

  onRemoveSortedPartClick(rowdata){
    // Make new REcognised Part for partinfo
    console.log(rowdata.partinfo)
    // Store with sortedset_id
    console.log("sortedsetid:", this.id)
  } 
  
  onAddSortedPartClick(rowdata){
    let part: IdentifiedPartDBModel = new IdentifiedPartDBModel();
     part.run_id =  this.setdataDetails.run_id;
     part.no = rowdata.partinfo.no;
     part.color_id = rowdata.partinfo.color_id;
     part.score = 100;
     part.identifier = "manual";
    console.log("part",part)
    this.identifiedpartService.createIdentifiedpart(part).subscribe(
      (data) => {
        
        if (data) {
          if (data.body && data.body.code == 201) {
            let sortedpart : SortedPartModel = new SortedPartModel
            sortedpart.identifiedpart_id = data.body.identifiedparts_id;
            sortedpart.sortedset_id = this.id;
            sortedpart.detected = 1;
            this.sortedpartsService.createSortedPart(sortedpart).subscribe(
              (data) => {
                if (data) {
                  if (data.body && data.body.code == 201) {
                  
                   this.toastr.success("Added Sorted Part successfully.");
                   this.getAllPartdataSorted()
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
          else if (data.body && data.body.code == 403) {
            this.router.navigateByUrl("/login");
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
    console.log(rowdata.partinfo)
    console.log("sortedsetid:", this.id)
  }

  getAllMinifigsExpected(setid) {
    this.setdataService.getMinifigdataBySetid(setid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200 && data.body.result.length > 0) {
            this.expectedMinifigData = data.body.result;
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
