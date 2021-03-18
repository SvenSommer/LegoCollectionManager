import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CollectionModel } from 'src/app/models/collection-model';
import { CollectionService } from 'src/app/services/collection.service';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';

@Component({
  selector: 'app-collection-edit',
  templateUrl: './collection-edit.component.html',
  styleUrls: ['./collection-edit.component.css']
})
export class CollectionEditComponent implements OnInit {

  constructor(private collectionSer: CollectionService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public collection: CollectionModel = new CollectionModel();
  @Output() collectionAdded = new EventEmitter<CollectionModel>();

  public isFormSubmitted = false;
  public pickerDate;
  public isForEdit = false;
  public pageTitle = 'Collection Add';
  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Collection Edit';
      this.isForEdit = true;
      this.collection = new CollectionModel(data);
      if (data.purchase_date) {
        let oldDate = new Date(data.purchase_date);
        this.pickerDate = new NgbDate(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate());
      }
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(collectionForm: NgForm) {
    this.isFormSubmitted = true;
    if (!collectionForm.valid) {
      return;
    }

    let selectedDate = new Date();
    selectedDate.setDate(this.pickerDate.day);
    selectedDate.setMonth(this.pickerDate.month - 1);
    selectedDate.setFullYear(this.pickerDate.year);

    this.collection.purchase_date = selectedDate.toISOString().slice(0, 19).replace('T', ' ');

    var method = "saveCollection";
    if (this.isForEdit) {
      method = "updateCollection";
    }
    this.collectionSer[method](this.collection).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.collectionAdded.emit(this.collection);
          this.modal.close();
        }
        else {
          this.toastr.error(data.body.message);
        }
      },
      (error: HttpErrorResponse) => {
        //console.log('[getUSers] error : ', error);
        console.log(error.name + ' ' + error.message);
      }
    );
  }
}
