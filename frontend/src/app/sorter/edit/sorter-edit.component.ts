import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SorterService } from 'src/app/services/sorter.service';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { SorterModel } from 'src/app/models/sorter-model';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sorter-edit',
  templateUrl: './sorter-edit.component.html',
  styleUrls: ['./sorter-edit.component.css']
})
export class SorterEditComponent implements OnInit {

  constructor(private sorterSer: SorterService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public sorter:SorterModel = new SorterModel();
  @Output() sorterAdded = new EventEmitter<SorterModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Sorter';

  ngOnInit(): void {
  }

  open(data = null) {
    if (data) {
      this.pageTitle = 'Edit Sorter';
      this.isForEdit = true;
      this.sorter = new SorterModel(data);
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(sorterForm: NgForm) {
    this.isFormSubmitted = true;
    if (!sorterForm.valid) {
      return;
    }
    var method = "saveSorter";
    if (this.isForEdit) {
      method = "updateSorter";
    }
    this.sorterSer[method](this.sorter).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.sorterAdded.emit(this.sorter);
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
