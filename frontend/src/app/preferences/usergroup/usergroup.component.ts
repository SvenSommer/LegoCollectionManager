import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { PreferencesService } from 'src/app/services/preferences.service';
import { UsergroupEditComponent } from './usergroup-edit/usergroup-edit.component';
import { UsergroupModel } from 'src/app/models/usergroup-model';

@Component({
  selector: 'app-usergroup',
  templateUrl: './usergroup.component.html',
  styleUrls: ['./usergroup.component.css']
})
export class UsergroupComponent implements OnInit {


  constructor(private preferencesService: PreferencesService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {} 

  public usergroupcolumns = [
    { title: 'id', name: 'id', size: '5%', minSize: '50'},
    { title: 'Groupname', name: 'groupname', size: '50', minSize: '50'}
  ]
  public usergroupdata: any;

  @ViewChild('usergroupEdit') usergroupEdit: UsergroupEditComponent;
  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.preferencesService.getUsergroups().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.usergroupdata = data.body.result;
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
  
  editUsergroup(id) {
    this.usergroupEdit.open();
  }
  
  onEditUsergroupClick(data) {
    this.usergroupEdit.open(data);
  }
  
  onRowDeleteUsergroupClick(model) {
    let options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.preferencesService.deleteUsergroup(model.id).subscribe(
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
  
  addNewUsergroup(newData: UsergroupModel) {
    this.bindData();
  }
  
  onRowEditUsergroupClick(data) {
    this.usergroupEdit.open();
  }
  
  

}
