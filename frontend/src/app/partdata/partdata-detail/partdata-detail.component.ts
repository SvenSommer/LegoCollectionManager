import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PartdataService } from 'src/app/services/partdata.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';


@Component({
  selector: 'app-partdata-detail',
  templateUrl: './partdata-detail.component.html',
  styleUrls: ['./partdata-detail.component.css']
})
export class PartdataDetailComponent implements OnInit {

  public imgPopupURL = '';
  public imgPopupName = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  public partdataDetails;
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

  constructor(private activatedRoute: ActivatedRoute,
    private partdataService: PartdataService,
    private router: Router, private toastr: ToastrService) { }
   
    public partno = 0;
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.partno = params['partno'];
        if (this.partno > 0) {
          this.bindData();
        }
      });
    }

  bindData() {
    this.partdataService.getPartdataDetail(this.partno).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.partdataDetails = data.body.result[0];
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
