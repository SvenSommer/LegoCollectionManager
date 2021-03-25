import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { PreferencesService } from '../services/preferences.service';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserModel } from '../models/user-model';
import { UsergroupEditComponent } from './usergroup/usergroup-edit/usergroup-edit.component';
import { UsergroupModel } from '../models/usergroup-model';
import { StatusEditComponent } from './status/status-edit/status-edit.component';
import { StatusModel } from '../models/status-model';
import { TypeModel } from '../models/type-model';

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
    { title: 'User Name', name: 'username', size: '20', minSize: '50'},
    { title: 'Full Name', name: 'full_name', size: '50', minSize: '50'},
    { title: 'User Group', name: 'usergroup', size: '5%', minSize: '50', datatype: { type: 'number' }},
    { title: 'Created', name: 'created', size: '50', minSize: '50', datatype: { type: 'date' } }
  ]
  public userdata: any;

  public usergroupcolumns = [
    { title: 'id', name: 'id', size: '5%', minSize: '50'},
    { title: 'Group Name', name: 'groupname', size: '50', minSize: '50'}
  ]
  public usergroupdata: any;

  public statusColumns = [
    { title: 'Type', name: 'type_name', size: '50', minSize: '50'},
    { title: 'Code', name: 'code', size: '50', minSize: '50'}, 
    { title: 'Name', name: 'name', size: '50', minSize: '50'},
    { title: 'Description', name: 'description', size: '50', minSize: '50'},
  ]
  public statusdata: any;

  public typeColumns = [
    { title: 'id', name: 'id', size: '5%', minSize: '50'},
    { title: 'Name', name: 'name', size: '50', minSize: '50'},
  ]
  public typedata: any;

  @ViewChild('userEdit') userEdit: UserEditComponent;
  @ViewChild('usergroupEdit') usergroupEdit: UsergroupEditComponent;
  @ViewChild('statusEdit') statusEdit: StatusEditComponent;
  @ViewChild('typeEdit') typeEdit: StatusEditComponent;
  
  ngOnInit(): void {
    this.GetAllUsers();
    this.getAllUserGroups();
    this.getAllStatus();
    this.getAllTypes();
  }

  GetAllUsers() {
    this.preferencesService.getUsers().subscribe(
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
    this.GetAllUsers();
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
               this.GetAllUsers();
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

  getAllUserGroups() {
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
               this.getAllUserGroups();
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
    this.getAllUserGroups();
  }
  
  onRowEditUsergroupClick(data) {
    this.usergroupEdit.open();
  }

  getAllStatus() {
    this.preferencesService.getStatus().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.statusdata = data.body.result;
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

  addNewStatus(newData: StatusModel) {
    this.getAllStatus();
  }

  editStatus(id) {
    this.statusEdit.open();
  }
  
  onEditStatusClick(data) {
    console.log(data)
    this.statusEdit.open(data);
  }
  
  onRowDeleteStatusClick(model) {
    let options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.preferencesService.deleteStatus(model.id).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code == 200) {
               // Message should be data.body.message
               this.toastr.success("Record Deleted Successfully.");
               this.getAllStatus();
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

  getAllTypes() {
    this.preferencesService.getTypes().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.typedata = data.body.result;
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

  addNewType(newData: TypeModel) {
    this.getAllTypes();
  }

  editType(id) {
    this.typeEdit.open();
  }
  
  onEditTypeClick(data) {
    console.log(data)
    this.typeEdit.open(data);
  }
  
  onRowDeleteTypeClick(model) {
    let options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.preferencesService.deleteType(model.id).subscribe(
          (data) => {
            if (data) {
              if (data.body && data.body.code == 200) {
               // Message should be data.body.message
               this.toastr.success("Record Deleted Successfully.");
               this.getAllTypes();
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
