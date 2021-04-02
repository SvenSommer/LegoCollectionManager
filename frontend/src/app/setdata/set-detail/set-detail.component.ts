import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SetdataService } from 'src/app/services/setdata.service';
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
  public partData: any; 
  
  public minifigColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '80', minSize: '80', datatype: { type: 'image' } },
    { title: 'Part', name: 'partinfo.part_no', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '25%', minSize: '90' },
    { title: 'Quantity', name: 'partinfo.quantity', size: '30', minSize: '30' , datatype: { type: 'number' }},
    { title: 'Avg € (stock)', name: 'partinfo.qty_avg_price_stock', size: '30', minSize: '30', datatype: { type: 'price' } },
    { title: 'Avg € (sold)', name: 'partinfo.qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },

  ];
  public minifigData: any;

  constructor(private activatedRoute: ActivatedRoute,
    private setdataService: SetdataService,
    private router: Router, private toastr: ToastrService) { }

    public id = 0;
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        if (this.id > 0) {
          this.bindData();
          this.getAllPartdata();
          this.getAllMinifigs();
        }
      });
    }

  bindData() {
    this.setdataService.getSetdataById(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.setdataDetails = data.body.result[0];
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

  getAllPartdata() {
    this.setdataService.getPartdataBySetid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.partData = data.body.result;
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

  getAllMinifigs() {
    this.setdataService.getMinifigdataBySetid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200 && data.body.result.length > 0) {
            this.minifigData = data.body.result;
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
