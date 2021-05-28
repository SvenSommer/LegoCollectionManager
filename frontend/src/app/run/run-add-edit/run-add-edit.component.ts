import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { C } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { runInThisContext } from 'node:vm';
import { RunModel } from 'src/app/models/run-model';
import { SortedSetModel } from 'src/app/models/sortedset-model';
import { CollectionService } from 'src/app/services/collection.service';
import { RunService } from 'src/app/services/run.service';
import { SortedSetService } from 'src/app/services/sortedset.service';
import { SorterService } from 'src/app/services/sorter.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';

@Component({
  selector: 'app-run-add-edit',
  templateUrl: './run-add-edit.component.html',
  styleUrls: ['./run-add-edit.component.css']
})
export class RunAddEditComponent implements OnInit {

  public collectionList: Array<any>;
  public sorterList: Array<any>;
  public expectedSets: Array<any> = [];
  public pusherList: Array<any> = [];
  public droppedList: Array<any> = [];

  public setSearch:string;
  public pusherSearch:string;
  public showDragDrop:boolean;

  constructor(private runSer: RunService, 
    private router: Router, 
    private toastr: ToastrService, 
    private collectionService: CollectionService,
    private sorterService: SorterService,
    private sortedSetService : SortedSetService) {}

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

    setTimeout(()=>{
    const runData = this.runSer.getData();
    if(runData){
      this.run = new RunModel(runData);
      this.pageTitle = "Edit Run " + runData.runinfo.title; 
      this.run.imagefolder = runData.runinfo.imagefolder;
      this.run.id = runData.run_id;
      this.run.no = runData.run_no;
      
      this.isForEdit = true;

    }
  }, 1000);
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

  expandPanel(data, panel){    // Expands accordion only when there is data inside
    if(data && data.length == 0){
      panel.close();
    }
  }

  drop(event: CdkDragDrop<any[]>, type: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if(event.container.data.length < 1 || type != 'pusher'){
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
    // this.modal.open();
  }

  onSubmit(runForm: NgForm) {
    // let obj = {
    //   collection_id: null,
    //   sorter_id: null,
    //   sortedsets: []
    // };
    // obj.collection_id = this.run.collection_id;
    // obj.sorter_id = this.run.sorter_id;
    this.run.sortedsets = [];
    for (var i=0; i<this.pusherList.length; i++){
      let pushedSet = {
        expectedset_id: null,
        pusher_id: null
      }
      if (this.pusherList[i] && this.pusherList[i].sets && this.pusherList[i].sets.length > 0) {
          pushedSet.expectedset_id = this.pusherList[i].sets[0].id;
          pushedSet.pusher_id = this.pusherList[i].id;
          this.run.sortedsets.push(pushedSet);
      }
    }
    console.log('this.run:::::::::::',this.run)
    this.isFormSubmitted = true;
    if (!runForm.valid) {
      return;
    }
    var method = "saveRun";
    if (this.isForEdit) {
      method = "updateRun";
    }
    console.log("method",method)
    this.runSer[method](this.run).subscribe(
      (data) => {
        console.log("data",data)
        if (data.body.code == 201 || data.body.code == 200) {
          this.run.sortedsets.forEach(sset => {
            sset["run_id"] = data.body.run_id
            console.log("saving set to sort", sset)
            this.sortedSetService.createSortedSet(sset).subscribe(
              (dataset) => {
                if (dataset.body.code == 201 || dataset.body.code == 200) {
                  this.toastr.success(dataset.body.message);
                }
                else{
                  this.toastr.error(dataset.body.message);
                }
              });
          });
          this.toastr.success(data.body.message);
          this.runAdded.emit(this.run);
          // this.modal.close();
          this.router.navigateByUrl("/rundetail/" + data.body.run_id);
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
