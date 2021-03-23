import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { RunService } from 'src/app/services/run.service';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RunModel } from 'src/app/models/run-model';

@Component({
  selector: 'app-run-edit',
  templateUrl: './run-edit.component.html',
  styleUrls: ['./run-edit.component.css']
})
export class RunEditComponent implements OnInit {

  constructor(private runSer: RunService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public run:RunModel = new RunModel();
  @Output() runAdded = new EventEmitter<RunModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Run';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Edit Run';
      this.isForEdit = true;
      this.run = new RunModel(data);
    }
    else {
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
