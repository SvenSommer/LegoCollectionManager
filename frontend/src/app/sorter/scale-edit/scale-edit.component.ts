import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SorterService } from 'src/app/services/sorter.service';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { ScaleModel } from 'src/app/models/scale-model';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-scale-edit',
  templateUrl: './scale-edit.component.html',
  styleUrls: ['./scale-edit.component.css']
})
export class ScaleEditComponent implements OnInit {

  constructor(private sorterSer: SorterService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public scale:ScaleModel = new ScaleModel();
  @Output() scaleAdded = new EventEmitter<ScaleModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Scale';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Edit Scale';
      this.isForEdit = true;
      this.scale = new ScaleModel(data);
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(scaleform: NgForm) {
    this.isFormSubmitted = true;
    if (!scaleform.valid) {
      return;
    }
    var method = "saveScale";
    if (this.isForEdit) {
      method = "updateScale";
    }
    this.sorterSer[method](this.scale).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.scaleAdded.emit(this.scale);
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
