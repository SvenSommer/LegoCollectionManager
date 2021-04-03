import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { RunService } from 'src/app/services/run.service';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RunModel } from 'src/app/models/run-model';
import { CollectionService } from 'src/app/services/collection.service';
import { SorterService } from 'src/app/services/sorter.service';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-run-edit',
  templateUrl: './run-edit.component.html',
  styleUrls: ['./run-edit.component.css']
})
export class RunEditComponent implements OnInit {

  public collectionList: Array<any>;
  public sorterList: Array<any>;
  public expectedSets: Array<any> = [];
  public pusherList: Array<any> = [];
  public droppedList: Array<any> = [];

  public setSearch:string;
  public pusherSearch:string;
  public showDragDrop:boolean;

  constructor(private runSer: RunService, private router: Router, private toastr: ToastrService, private collectionService: CollectionService,
    private sorterService: SorterService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public run:RunModel = new RunModel();
  @Output() runAdded = new EventEmitter<RunModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public isFromCollection = false;
  public pageTitle = 'Add new Run';

  ngOnInit(): void {
    this.getCollectionsList();
    this.getSortersList();

  }

  getCollectionsList() {
    this.collectionService.getCollections().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.collectionList = data.body.result;
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



  getSortersList() {
    this.sorterService.getSorters().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.sorterList = data.body.result;
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

  onCollectionChange(collectionId) {
    this.collectionService.getRunsNextnoByCollectionid(collectionId).subscribe(
      (data) => {
        if (data) {
          if(data.body && data.body.code == 200){
            this.run.no = data.body.result[0].next_runno;
            this.run.imagefolder = '/partimages/collection' + collectionId + '/run' + this.run.no;
          }
        }
      }
    );
  }

  getExpectedSets() {
    this.collectionService.getExpectedSets(this.run.collection_id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedSets = data.body.sets;
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

  getAllPushers() {
    this.sorterService.getPushers(this.run.sorter_id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.pusherList = data.body.result;
            this.pusherList.forEach(item => {
              item.sets = [];
            });
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

  toggle(ev:MatSlideToggleChange ){
    this.showDragDrop = ev.checked;
    if(this.run && this.run.sorter_id && this.run.collection_id){
      this.getExpectedSets();
      this.getAllPushers();
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if(event.container.data.length < 1){
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
      }
    }
  }

  open(data = null) {
    this.expectedSets = [];
    this.pusherList = [];
    this.showDragDrop = false;
    this.run = new RunModel(data);
    if (data && data.id != 0) {
      this.pageTitle = 'Edit Run';
      this.isForEdit = true;

    }
    else if(data && data.id == 0) {
      this.isForEdit = false;
      this.isFromCollection = true;
    }else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(runForm: NgForm) {
    this.isFormSubmitted = true;
    if (!runForm.valid) {
      return;
    }
    var method = "saveRun";
    if (this.isForEdit) {
      method = "updateRun";
    }
    this.runSer[method](this.run).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.runAdded.emit(this.run);
          this.modal.close();
        }
        else {
          this.toastr.error(data.body.message);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }


}
