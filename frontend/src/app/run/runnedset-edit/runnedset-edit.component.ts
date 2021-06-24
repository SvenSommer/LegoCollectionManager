import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RunnedSetModel } from 'src/app/models/runnedset-model';
import { RunService } from 'src/app/services/run.service';

@Component({
  selector: 'app-runnedset-edit',
  templateUrl: './runnedset-edit.component.html',
  styleUrls: ['./runnedset-edit.component.css']
})
export class RunnedSetEditComponent implements OnInit {

  constructor(private runSer: RunService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public runnedSet:RunnedSetModel = new RunnedSetModel();
  @Output() runnedSetAdded = new EventEmitter<RunnedSetModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Runned Set';

  ngOnInit(): void {
  }

  open(data = null) {
    this.runnedSet = new RunnedSetModel(data);
    if (data && data.id != 0) {
      this.pageTitle = 'Edit Runned Set';
      this.isForEdit = true; 
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(runnedsetform: NgForm) {
    this.isFormSubmitted = true;
    if (!runnedsetform.valid) {
      return;
    }
    console.log(runnedsetform)
    var method = "saveRunnedSet";
    if (this.isForEdit) {
      method = "updateRunnedSet";
    }
    this.runSer[method](this.runnedSet).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.runnedSetAdded.emit(this.runnedSet);
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
