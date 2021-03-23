import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { RunEditComponent } from '../run-edit/run-edit.component';
import { RunService } from 'src/app/services/run.service';
import { RunModel } from 'src/app/models/run-model';
import { SortedsetEditComponent } from '../sortedset-edit/sortedset-edit.component';
import { SortedSetModel } from 'src/app/models/sortedset-model';
import { RecognisedpartEditComponent } from '../recognisedpart-edit/recognisedpart-edit.component';

@Component({
  selector: 'app-run-detail',
  templateUrl: './run-detail.component.html',
  styleUrls: ['./run-detail.component.css']
})
export class RunDetailComponent implements OnInit {

  public imgPopupURL = '';
  @ViewChild('imagePopup') public imagePopup: ModalPopupComponent;

  @ViewChild('runEdit') runEdit: RunEditComponent;
  @ViewChild('sortedsetEdit') sortedsetEdit: SortedsetEditComponent;
  @ViewChild('recognisedpartEdit') recognisedpartEdit: RecognisedpartEditComponent;

  public runDetails;
  public sortedsetDetails;
  public recognisedpartDetails;

  public sortedsetsColumns = [
    { title: 'Pusher', name: 'pusher_number', size: '60', minSize: '60' },
    { title: 'Image', name: 'set_thumbnail_url', size: '25', minSize: '25', datatype:{ type: 'image' } },
    { title: 'Set No', name: 'set_No', size: '30', minSize: '30' , datatype:{ type: 'number' }},
    { title: 'Set Name', name: 'set_Name', size: '30', minSize: '30' },
    { title: 'Comments', name: 'recognisedset_comments', size: '30', minSize: '30' },
    { title: 'Parts', name: 'set_completed_part_count', size: '30', minSize: '30', datatype:{ type: 'number' } },
 //   { title: 'identified', name: 'set_completed_part_count', size: '30', minSize: '30', datatype:{ type: 'number' } },
 //   { title: 'sorted', name: 'set_completed_part_count', size: '30', minSize: '30', datatype:{ type: 'number' } },
    { title: 'Created', name: 'created', size: '100', minSize: '100', datatype: { type: 'date' } },
  ];

  public recognisedpartsColumns = [
    { title: 'Images', name: 'partimages', size: '60', minSize: '60', datatype:{ type: 'images' } },
    { title: 'Number', name: 'no', size: '25', minSize: '25' },
    { title: 'Color id', name: 'color_id', size: '30', minSize: '30' , datatype:{ type: 'number' }},
    { title: 'Name', name: 'name', size: '30', minSize: '30' },
    { title: 'Image', name: 'thumbnail_url', size: '30', minSize: '30' , datatype:{ type: 'image' }},
    { title: 'Identifier', name: 'identifier', size: '30', minSize: '30' },
 //   { title: 'identified', name: 'set_completed_part_count', size: '30', minSize: '30', datatype:{ type: 'number' } },
 //   { title: 'sorted', name: 'set_completed_part_count', size: '30', minSize: '30', datatype:{ type: 'number' } },
    { title: 'Created', name: 'created', size: '100', minSize: '100', datatype: { type: 'date' } },
  ];

  public sortedsetsData: any;
  public recognisedpartsData: any;
  constructor(private activatedRoute: ActivatedRoute,
    private runService: RunService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

  public id = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id > 0) {
        this.bindData();
        this.getAllSortedsets();
        this.getAllRecognisedparts();
      }
    });
  }

  bindData() {
    this.runService.getRunById(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.runDetails = data.body.result[0];
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

  onEditRunClick() {
    this.runEdit.open(this.runDetails);
  }

  addNewRun(newData: RunModel) {
    this.bindData();
  }

    public onDeleteRunClick(){
    let options = {
      title: 'Are you sure you want to delete this run?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.runService.deleteRun(this.id).subscribe(
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

  getAllSortedsets() {

    this.runService.getSortedsetsByRunid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.sortedsetsData = data.body.result;
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

  editSortedset(id) {
    this.sortedsetEdit.open();
  }

  addNewSortedset(newData: SortedSetModel) {
    this.bindData();
    this.getAllSortedsets();
  }

  onEditSortedsetClick(data) {
    this.sortedsetEdit.open(data);
  }

  getAllRecognisedparts() {

    this.runService.getRecognisedpartByRunid(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.recognisedpartsData = data.body.result;
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

  editRecognisedpart(id) {
    this.recognisedpartEdit.open();
  }  
  
  labelparts(id) {
    console.log("label Parts for run id: " + id)
    this.recognisedpartEdit.open();
  }

  addNewRecognisedpart(newData: SortedSetModel) {
    this.bindData();
    this.getAllRecognisedparts();
  }

  onEditRecognisedpartClick(data) {
    this.recognisedpartEdit.open(data);
  }

  onRowRecognisedpartDeleteClick(model) {
    let options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.runService.deletetRecognisedpart(model.id).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code == 200) {
               // Message should be data.body.message
               this.toastr.success("Record Deleted Successfully.");
               this.bindData();
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
