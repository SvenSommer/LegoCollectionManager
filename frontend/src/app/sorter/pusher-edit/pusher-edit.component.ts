import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PusherModel } from 'src/app/models/pusher-model';
import { SorterService } from 'src/app/services/sorter.service';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pusher-edit',
  templateUrl: './pusher-edit.component.html',
  styleUrls: ['./pusher-edit.component.css']
})
export class PusherEditComponent implements OnInit {

  constructor(private sorterSer: SorterService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public pusher:PusherModel = new PusherModel();
  @Output() pusherAdded = new EventEmitter<PusherModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Pusher';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Edit Pusher';
      this.isForEdit = true;
      this.pusher = new PusherModel(data);
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(pusherform: NgForm) {
    this.isFormSubmitted = true;
    if (!pusherform.valid) {
      return;
    }
    var method = "savePusher";
    if (this.isForEdit) {
      method = "updatePusher";
    }
    this.sorterSer[method](this.pusher).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.pusherAdded.emit(this.pusher);
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
