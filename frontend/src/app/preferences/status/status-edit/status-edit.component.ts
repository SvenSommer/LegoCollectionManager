import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PreferencesService } from 'src/app/services/preferences.service';
import { StatusModel } from 'src/app/models/status-model';

@Component({
  selector: 'app-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrls: ['./status-edit.component.css']
})
export class StatusEditComponent implements OnInit {

  constructor(private prefservice: PreferencesService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public status:StatusModel = new StatusModel();
  @Output() statusAdded = new EventEmitter<StatusModel>();
  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Status';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      console.log(data)
      this.pageTitle = 'Edit Status';
      this.isForEdit = true;
      this.status = new StatusModel(data);
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(statusForm: NgForm) {
    this.isFormSubmitted = true;
    if (!statusForm.valid) {
      return;
    }
    var method = "saveStatus";
    if (this.isForEdit) {
      method = "updateStatus";
    }
    this.prefservice[method](this.status).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.statusAdded.emit(this.status);
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
