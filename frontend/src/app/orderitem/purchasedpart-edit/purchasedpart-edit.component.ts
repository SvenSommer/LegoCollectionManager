import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PurchasedPartModel } from 'src/app/models/purchasedpart-model';
import { PurchasedPartService } from 'src/app/services/purchasedpart.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';

@Component({
  selector: 'app-purchasedpart-edit',
  templateUrl: './purchasedpart-edit.component.html',
  styleUrls: ['./purchasedpart-edit.component.css']
})
export class PurchasedPartEditComponent implements OnInit {

  constructor(private purchasedPartService: PurchasedPartService, private toastr: ToastrService) { }

  
  @ViewChild('modalPopup') modal: ModalPopupComponent;
  
  public purchasedPart: PurchasedPartModel = new PurchasedPartModel();
  @Output() purchasedPartAdded = new EventEmitter<PurchasedPartModel>();
  
  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Sort purchased Parts';

  ngOnInit(): void {
  }

  open(purchasedPart) {
    this.purchasedPart = purchasedPart;
    this.modal.open();
  }

  onSubmit(purchasedPartForm: NgForm) {
    this.isFormSubmitted = true;
    if (!purchasedPartForm.valid) {
      return;
    }
    this.purchasedPartService.UpsertPurchasedPart(this.purchasedPart).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.purchasedPartAdded.emit(this.purchasedPart);
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
