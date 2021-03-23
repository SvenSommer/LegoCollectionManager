import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RunService } from 'src/app/services/run.service';
import { RecognisedPartModel } from 'src/app/models/RecognisedPartModel';

@Component({
  selector: 'app-recognisedpart-edit',
  templateUrl: './recognisedpart-edit.component.html',
  styleUrls: ['./recognisedpart-edit.component.css']
})
export class RecognisedpartEditComponent implements OnInit {

  constructor(private runSer: RunService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  
  public recognisedpart:RecognisedPartModel = new RecognisedPartModel();
  @Output() recognisedpartAdded = new EventEmitter<RecognisedPartModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Recognised Part';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Edit Recognised Part';
      this.isForEdit = true;
      this.recognisedpart = new RecognisedPartModel(data);
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(sortedsetform: NgForm) {
    this.isFormSubmitted = true;
    if (!sortedsetform.valid) {
      return;
    }
    var method = "saveRecognisedpart";
    if (this.isForEdit) {
      method = "updatetRecognisedpart";
    }
    this.runSer[method](this.recognisedpart).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.recognisedpartAdded.emit(this.recognisedpart);
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
