import { Component, EventEmitter, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalPopupComponent } from 'src/app/shared/components/popup/modal-popup/modal-popup.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RecognisedPartModel } from 'src/app/models/RecognisedPartModel';
import { RecognisedpartsService } from 'src/app/services/recognisedpart.service';
import { PartimageService } from 'src/app/services/partimage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recognisedpart-edit',
  templateUrl: './recognisedpart-edit.component.html',
  styleUrls: ['./recognisedpart-edit.component.css']
})
export class RecognisedpartEditComponent implements OnInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
     this.HandleKeyInput(event.key);
    }
 

  constructor(private recognisedpartsService: RecognisedpartsService,
    private partimageService: PartimageService,
    private router: Router,
    private toastr: ToastrService) { }

  @ViewChild('modalPopup') modal: ModalPopupComponent;

  
  public recognisedpart:RecognisedPartModel = new RecognisedPartModel();
  @Output() recognisedpartAdded = new EventEmitter<RecognisedPartModel>();

  public isFormSubmitted = false;
  public isForEdit = false;
  public pageTitle = 'Add Recognised Part';

  ngOnInit(): void {
  }

  public recpartid = 0;
  open(data = null) {
    if (data) {
      this.recpartid = data.id;
      this.pageTitle = 'Edit Recognised Part';
      this.isForEdit = true;
      this.recognisedpart = new RecognisedPartModel(data);
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
    var method = "saveRecognisedpart";
    if (this.isForEdit) {
      method = "updatetRecognisedpart";
    }
    this.recognisedpartsService[method](this.recognisedpart).subscribe(
      (data) => {
        if (data.body.code == 201 || data.body.code == 200) {
          this.toastr.success(data.body.message);
          this.recognisedpartAdded.emit(this.recognisedpart);
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

  HandleKeyInput(key: string) {
    switch (key) {
      case "Enter":
        this.recognisedpartAdded.emit(this.recognisedpart);
        this.modal.close();
        break;
        default:
          break;
      }
  }

  onToggleDeleted(partimage){
    if(partimage.deleted==null){ 
      console.log("delete") 
      this.partimageService.markPartimageAsDeletedById(partimage.id).subscribe(
        (data) => {
          this.refreshImages(data);
        },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        }
      ); 
    } else {
      console.log("undelete") 
      this.partimageService.markPartimageAsNotDeletedById(partimage.id).subscribe(
        (data) => {
          this.refreshImages(data);
        },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        }
      ); 
  }

  }

  styleImage(partimage): Object {
    if (partimage.deleted!=null){
        return {'opacity': '0.4', 
        'background-color': '#ad0303',
        'filter': 'alpha(opacity=40)'}
    }
  return {}
  }

  private refreshImages(data: any) {
    if (data) {
      if (data.body && data.body.code == 200) {
        // Message should be data.body.message
        this.Refresh();
      }
      else if (data.body && data.body.code == 403) {
        this.router.navigateByUrl("/login");
      }
    }
  }

  Refresh() {
    this.recognisedpartsService.getRecognisedpartById(this.recpartid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            console.log(data)
            this.recognisedpart = data.body.result[0];

          }
          else if (data.body && data.body.code == 403) {
            this.router.navigateByUrl("/login");
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }



}
