import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PreferencesService } from 'src/app/services/preferences.service';
import { UsergroupModel } from 'src/app/models/usergroup-model';

@Component({
  selector: 'app-usergroup-edit',
  templateUrl: './usergroup-edit.component.html',
  styleUrls: ['./usergroup-edit.component.css']
})
export class UsergroupEditComponent implements OnInit {

  constructor(private preferencesSer: PreferencesService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public usergroup:UsergroupModel = new UsergroupModel();
  @Output() usergroupAdded = new EventEmitter<UsergroupModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add User Group';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Edit User Group';
      this.isForEdit = true;
      this.usergroup = new UsergroupModel(data);
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(usergroupForm: NgForm) {
    this.isFormSubmitted = true;
    if (!usergroupForm.valid) {
      return;
    }
    var method = "saveUsergroup";
    if (this.isForEdit) {
      method = "updateUsergroup";
    }
    this.preferencesSer[method](this.usergroup).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.usergroupAdded.emit(this.usergroup);
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
