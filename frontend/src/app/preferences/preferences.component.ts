import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { PreferencesService } from '../services/Preferences.service';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserModel } from '../models/user-model';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  constructor(private preferencesService: PreferencesService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {} 

  public userColums = [
    { title: 'User Name', name: 'username', size: '5%', minSize: '50'},
    { title: 'Full Name', name: 'full_name', size: '50', minSize: '50'},
    { title: 'User Group', name: 'usergroup', size: '5%', minSize: '50', datatype: { type: 'number' }},
    { title: 'Created', name: 'created', size: '50', minSize: '50', datatype: { type: 'date' } }
  ]
  public userdata: any;

  @ViewChild('userEdit') userEdit: UserEditComponent;
  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.preferencesService.getUser().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.userdata = data.body.result;
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

  addNewUser(newData: UserModel) {
    this.bindData();
  }

  editUser(id) {
    this.userEdit.open();
  }
  
  onEditUserClick(data) {
    console.log(data)
    this.userEdit.open(data);
  }
  
  onRowDeleteUserClick(model) {
    let options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.preferencesService.deleteUser(model.id).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code == 200) {
               // Message should be data.body.message
               this.toastr.success("Record Deleted Successfully.");
               this.bindData();
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
      } else {
        console.log('Cancel');
      }
    });
  }

}
