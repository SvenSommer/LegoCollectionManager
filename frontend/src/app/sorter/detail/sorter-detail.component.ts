import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SorterService } from 'src/app/services/sorter.service';
import { SorterEditComponent } from '../edit/sorter-edit.component';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { HttpErrorResponse } from '@angular/common/http';
import { SorterModel } from 'src/app/models/sorter-model';
import { PusherModel } from 'src/app/models/pusher-model';
import { PusherEditComponent } from '../pusher-edit/pusher-edit.component';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { ValveEditComponent } from '../valve-edit/valve-edit.component';
import { ScaleEditComponent } from '../scale-edit/scale-edit.component';

@Component({
  selector: 'app-sorter-detail',
  templateUrl: './sorter-detail.component.html',
  styleUrls: ['./sorter-detail.component.css']
})
export class SorterDetailComponent implements OnInit {

  public imgPopupURL = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  @ViewChild('sorterEdit') sorterEdit: SorterEditComponent;
  @ViewChild('pusherEdit') pusherEdit: PusherEditComponent;
  @ViewChild('valveEdit') valveEdit: ValveEditComponent;
  @ViewChild('scaleEdit') scaleEdit: ScaleEditComponent;

  public sorterDetails;
  public pusherDetails;
  public valveDetails;
  public scaleDetails;

  public pushersColumns = [
    { title: '#', name: 'number', size: '30', minSize: '30' },
    { title: 'Valve', name: 'valve_name', size: '60', minSize: '60' },
    { title: 'Scale', name: 'scale_name', size: '60', minSize: '60' },
    { title: 'Distance From Origin (mm)', name: 'distanceFromOrigin_mm', size: '25', minSize: '25', datatype:{ type: 'number' } },
    { title: 'Status', name: 'status', size: '60', minSize: '120' },
    { title: 'Created', name: 'created', size: '100', minSize: '100', datatype: { type: 'date' } },
  ];

  public valvesColumns = [
    { title: '#', name: 'number', size: '30', minSize: '30', datatype: { type: 'number' } },
    { title: 'Name', name: 'name', size: '30', minSize: '30' },
    { title: 'Ip', name: 'ip', size: '30', minSize: '30', datatype: { type: 'ip' } },
    { title: 'Valve Count', name: 'valvesCount', size: '30', minSize: '30', datatype: { type: 'number' } },
    { title: 'Status', name: 'status', size: '60', minSize: '60' },
    { title: 'Created', name: 'created', size: '100', minSize: '60', datatype: { type: 'date' } },
  ];

  public scalesColumns = [
    { title: '#', name: 'number', size: '30', minSize: '30', datatype: { type: 'number' } },
    { title: 'Name', name: 'name', size: '30', minSize: '30' },
    { title: 'Ip', name: 'ip', size: '30', minSize: '30', datatype: { type: 'ip' } },
    { title: 'Status', name: 'status', size: '60', minSize: '60' },
    { title: 'Created', name: 'created', size: '100', minSize: '60', datatype: { type: 'date' } },
  ];

  public pushersData: any;
  public valvesData: any;
  public scalesData: any;

  constructor(private activatedRoute: ActivatedRoute,
  private sorterService: SorterService,
  private router: Router, private toastr: ToastrService,
  private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

  public id = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id > 0) {
        this.bindData();
        this.getAllPushers();
        this.getAllValves();
        this.getAllScales();
      }
    });
  }

  bindData() {
    this.sorterService.getSorterById(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.sorterDetails = data.body.result[0];
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

  onEditSorterClick() {
    this.sorterEdit.open(this.sorterDetails);
  }

  addNewSorter(newData: SorterModel) {
    this.bindData();
  }

  getAllPushers() {
    this.sorterService.getPushers(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.pushersData = data.body;
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

  editPusher(id) {
    this.pusherEdit.open();
  }

  addNewPusher(newData: PusherModel) {
    this.bindData();
    this.getAllPushers();
  }

  onEditPusherClick(data) {
    this.pusherEdit.open(data);
  }

  getAllValves() {
    this.sorterService.getValves(this.id).subscribe(
      (data) => {
        console.log(data)
        if (data) {
          if (data.body && data.body.code == 200) {
            this.valvesData = data.body.result;
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

  editValve(id) {
    this.valveEdit.open();
  }

  addNewValve(newData: PusherModel) {
    this.bindData();
    this.getAllValves();
  }

  onEditValveClick(data) {
    this.valveEdit.open(data);
  }

  getAllScales() {
    this.sorterService.getScales(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.scalesData = data.body.result;
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

  editScale(id) {
    this.scaleEdit.open();
  }

  addNewScale(newData: PusherModel) {
    this.bindData();
    this.getAllScales();
  }

  onEditScaleClick(data) {
    this.scaleEdit.open(data);
  }


  public onDeleteSorterClick(){
    let options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.sorterService.deleteSorter(this.id).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code == 200) {
               // Message should be data.body.message
               this.toastr.success("Record Deleted Successfully.");
               this.router.navigateByUrl("/sorters");
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
  }

  public onImgClick(row) {
    this.imgPopupURL = row.image_url ?? row.thumbnail_url;
    this.imagePopup.open();
  }


}
