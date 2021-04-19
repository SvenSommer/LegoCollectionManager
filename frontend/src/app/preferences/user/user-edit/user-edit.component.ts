import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PreferencesService } from 'src/app/services/preferences.service';
import { UserModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {


  constructor(private runSer: PreferencesService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public user:UserModel = new UserModel();
  @Output() userAdded = new EventEmitter<UserModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add User';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Edit User';
      this.isForEdit = true;
      this.user = new UserModel(data);
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(userForm: NgForm) {
    this.isFormSubmitted = true;
    if (!userForm.valid) {
      return;
    }
    var method = "saveUser";
    if (this.isForEdit) {
      method = "updateUser";
    }
    this.runSer[method](this.user).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.userAdded.emit(this.user);
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
