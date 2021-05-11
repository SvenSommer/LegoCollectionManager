import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { RunEditComponent } from '../run-edit/run-edit.component';
import { RunService } from 'src/app/services/run.service';
import { RunModel } from 'src/app/models/run-model';
import { SortedsetEditComponent } from '../sortedset-edit/sortedset-edit.component';
import { SortedSetModel } from 'src/app/models/sortedset-model';
import { IdentifiedpartEditComponent } from '../identifiedpart-edit/identifiedpart-edit.component';
import { IdentifiedpartService } from 'src/app/services/identifiedpart.service';
import { IdentifiedPartModel } from 'src/app/models/identifiedpart-model';

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
  @ViewChild('identifiedpartEdit') identifiedpartEdit: IdentifiedpartEditComponent
  public runDetails;
  public sortedsetDetails;
  public identifiedpartDetails;

  public sortedsetsColumns = [
    { title: 'Pusher', name: 'pusherinfo.name', size: '60', minSize: '60' },
    { title: 'Image', name: 'setinfo.image_url', size: '80', minSize: '80', datatype:{ type: 'image' } },
    { title: 'Set No', name: 'setinfo.no', size: '30', minSize: '30' , datatype:{ type: 'number' }},
    { title: 'Set Name', name: 'setinfo.name', size: '30', minSize: '30' },
    { title: 'Comments', name: 'setproperties.comments', size: '30', minSize: '30' },
    { title: 'Identified', name: 'percentage_identified', label: 'label_identified_parts', size: '180', minSize: '80', datatype:{ type: 'percentage', style: 'info' }},
    { title: 'Sorted (detected)', name: 'percentage_sorted_detected', label: 'label_sorted_detected_parts', size: '180', minSize: '80', datatype:{ type: 'percentage', style: 'success'} },
    { title: 'Sorted (undetected)', name: 'percentage_sorted_undetected',  label: 'label_sorted_undetected_parts', size: '180', minSize: '80', datatype:{ type: 'percentage', style: 'danger'} },
    { title: 'Created', name: 'created', size: '100', minSize: '100', datatype: { type: 'date' } }
  ];

  public identifiedpartsColumns = [
    { title: 'Part Images Recorded', name: 'partimages', size: '65', minSize: '65', maxSize: '30%', datatype:{ type: 'images' } },
    { title: 'Recignised Part', name: 'partinfo.thumbnail_url', size: '65', minSize: '65' , datatype:{ type: 'image' }},
    { title: 'Color', name: 'color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'partinfo.name', size: '120', minSize: '80' },
    { title: 'Color Id', name: 'color_id', size: '80', minSize: '80' },
    { title: 'Partno', name: 'partno', size: '80', minSize: '80' },
    { title: 'Score', name: 'score', size: '80', minSize: '80' },
    { title: 'Identifier', name: 'identifier', size: '30', minSize: '30' },
    { title: 'Created', name: 'created', size: '100', minSize: '100', datatype: { type: 'date' }},
  ];

  public overviewInfo = {
    title: 'Overview',
    rowData: [
      { key: 'name', name: 'Collection'},
      { key: 'sorterinfo.name', name: 'Sorter'},
      { key: 'status.name', name: 'Status'},
      { key: 'parts_identified_by_cnn', name: 'Parts identified By Cnn'},
      { key: 'parts_identified_by_human', name: 'Parts identified By Human'}
    ]
  };

  public newSortedSetDetail = {
    "id":0,
    "run_id":0,
    "expectedset_id":1,
    "pusher_id":1
  }
  public sortedsetsData: any;
  public identifiedpartsData: any;
  constructor(private activatedRoute: ActivatedRoute,
    private runService: RunService,
    private identifiedpartsService: IdentifiedpartService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

  public id = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      if (this.id > 0) {
        this.newSortedSetDetail.run_id = this.id;
        this.bindData();
        this.getAllSortedsets();
        this.getAllIdentifiedparts();
      }
    });
  }

  bindData() {
    this.runService.getRunById(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            console.log(data)
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
    // this.runEdit.open(this.runDetails);
    this.runService.setData(this.runDetails);
    this.router.navigateByUrl("/addRun");
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
    this.sortedsetEdit.open(this.newSortedSetDetail);
  }

  addNewSortedset(newData: SortedSetModel) {
    this.bindData();
    this.getAllSortedsets();
  }

  onEditSortedsetClick(data) {
    this.sortedsetEdit.open(data);
  }

  getAllIdentifiedparts() {

    this.identifiedpartsService.getIdentifiedpartByRunid(this.id).subscribe(
      (data) => {
        if (data) {
          console.log(data)
          if (data.body && data.body.code == 200) {
            console.log("identifiedpartsData", data.body.result)
            this.identifiedpartsData = data.body.result;
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

  editIdentifiedpart(id) {
    this.identifiedpartEdit.open();
  }

  labelparts(id) {
    console.log("label Parts for run id: " + id)
    this.router.navigateByUrl("/labelparts/" + id).then((bool) => { }).catch()
  }

  addNewIdentifiedpart(newData: SortedSetModel) {
    this.bindData();
    this.getAllIdentifiedparts();
  }

  onEditIdentifiedpartClick(data) {
    this.identifiedpartEdit.open(data);
  }

  onRowIdentifiedpartDeleteClick(model) {
    let options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.identifiedpartsService.markIdentifiedpartAsDeletedById(model.id).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code == 200) {
               // Message should be data.body.message
               this.toastr.success("Record Deleted Successfully.");
               this.getAllIdentifiedparts();
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
    this.imgPopupURL = row.thumbnail_url;
    this.imagePopup.open();
  }
}
