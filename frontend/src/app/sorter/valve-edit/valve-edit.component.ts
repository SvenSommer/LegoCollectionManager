import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SorterService } from 'src/app/services/sorter.service';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { ValveModel } from 'src/app/models/valve-model';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-valve-edit',
  templateUrl: './valve-edit.component.html',
  styleUrls: ['./valve-edit.component.css']
})
export class ValveEditComponent implements OnInit {

  constructor(private sorterSer: SorterService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public valve:ValveModel = new ValveModel();
  @Output() valveAdded = new EventEmitter<ValveModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Valve';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Edit Valve';
      this.isForEdit = true;
      this.valve = new ValveModel(data);
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(valveform: NgForm) {
    this.isFormSubmitted = true;
    if (!valveform.valid) {
      return;
    }
    var method = "saveValve";
    if (this.isForEdit) {
      method = "updateValve";
    }
    this.sorterSer[method](this.valve).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.valveAdded.emit(this.valve);
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
