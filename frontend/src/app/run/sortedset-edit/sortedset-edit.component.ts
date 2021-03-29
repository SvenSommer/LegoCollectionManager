import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SortedSetModel } from 'src/app/models/sortedset-model';
import { RunService } from 'src/app/services/run.service';

@Component({
  selector: 'app-sortedset-edit',
  templateUrl: './sortedset-edit.component.html',
  styleUrls: ['./sortedset-edit.component.css']
})
export class SortedsetEditComponent implements OnInit {

  constructor(private runSer: RunService, private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  public sortedset:SortedSetModel = new SortedSetModel();
  @Output() sortedsetAdded = new EventEmitter<SortedSetModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Sorted Set';

  ngOnInit(): void {
  }

  open(data = null) {
    this.sortedset = new SortedSetModel(data);
    if (data && data.id != 0) {
      this.pageTitle = 'Edit Sorted Set';
      this.isForEdit = true; 
    }
    else {
      this.isForEdit = false;
    }
    this.modal.open();
  }

  onSubmit(sortedsetform: NgForm) {
    this.isFormSubmitted = true;
    if (!sortedsetform.valid) {
      return;
    }
    console.log(sortedsetform)
    var method = "saveSortedset";
    if (this.isForEdit) {
      method = "updateSortedset";
    }
    this.runSer[method](this.sortedset).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.sortedsetAdded.emit(this.sortedset);
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
