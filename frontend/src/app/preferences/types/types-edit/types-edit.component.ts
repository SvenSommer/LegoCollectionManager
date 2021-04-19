import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PreferencesService } from 'src/app/services/preferences.service';
import { TypeModel } from 'src/app/models/type-model';

@Component({
  selector: 'app-types-edit',
  templateUrl: './types-edit.component.html',
  styleUrls: ['./types-edit.component.css']
})
export class TypesEditComponent implements OnInit {

  constructor(private prefservice: PreferencesService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public type:TypeModel = new TypeModel();
  @Output() typeAdded = new EventEmitter<TypeModel>();
  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Type';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Edit Type';
      this.isForEdit = true;
      this.type = new TypeModel(data);
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(typesForm: NgForm) {
    this.isFormSubmitted = true;
    if (!typesForm.valid) {
      return;
    }
    var method = "saveType";
    if (this.isForEdit) {
      method = "updateType";
    }
    this.prefservice[method](this.type).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.typeAdded.emit(this.type);
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
