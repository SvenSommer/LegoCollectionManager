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
import {TextCellComponent} from "../shared/components/grid/text-cell/text-cell.component";
import {DeleteCellComponent} from "../shared/components/grid/delete-cell/delete-cell.component";
import { TypesEditComponent } from './types/types-edit/types-edit.component';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  constructor(private preferencesService: PreferencesService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {}


  public userColumns = [
    {
      headerName: 'User Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'username',
      filter: true,
      flex: 3,
      minWidth: '50'
    },
    {
      headerName: 'Full Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'full_name',
      filter: true,
      flex: 3,
      minWidth: '50'
    },
    {
      headerName: 'User Group',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'usergroup',
      filter: true,
      flex: 3,
      minWidth: '40'
    },
    {
      headerName: 'Created',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'created',
      filter: true,
      flex: 3,
      minWidth: '50'
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRendererFramework: DeleteCellComponent,
      resizable: true,
      flex: 1,
      minWidth: '60'
    }
  ];

  public userRows: Array<any> = [];

  public userdata: any;

  public userGroupsColumns = [
    {
      headerName: 'id',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'id',
      filter: true,
      flex: 3,
      minWidth: '30'
    },
    {
      headerName: 'Group Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'groupname',
      filter: true,
      flex: 3,
      minWidth: '50'
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRendererFramework: DeleteCellComponent,
      resizable: true,
      flex: 1,
      minWidth: '60'
    }
  ];

  public userGroupsRows: Array<any> = [];


  public usergroupdata: any;

  public statusColumns = [
    {
      headerName: 'Type',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'type_name',
      filter: true,
      flex: 3,
      minWidth: '40'
    },
    {
      headerName: 'Code',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'code',
      filter: true,
      flex: 3,
      minWidth: '40'
    },
    {
      headerName: 'Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'name',
      filter: true,
      flex: 3,
      minWidth: '50'
    },
    {
      headerName: 'Description',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'description',
      filter: true,
      flex: 3,
      minWidth: '50'
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRendererFramework: DeleteCellComponent,
      resizable: true,
      flex: 1,
      minWidth: '60'
    }
  ];

  public statusRows: Array<any> = [];

  public statusdata: any;

  public typeColumns = [
    {
      headerName: 'id',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'id',
      filter: true,
      flex: 3,
      minWidth: '30'
    },
    {
      headerName: 'Name',
      cellRendererFramework: TextCellComponent,
      autoHeight: true,
      sortable: true,
      resizable: true,
      field: 'name',
      filter: true,
      flex: 3,
      minWidth: '50'
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRendererFramework: DeleteCellComponent,
      resizable: true,
      flex: 1,
      minWidth: '60'
    }
  ];

  public typeRows: Array<any> = [];
  public typedata: any;

  @ViewChild('userEdit') userEdit: UserEditComponent;
  @ViewChild('usergroupEdit') usergroupEdit: UsergroupEditComponent;
  @ViewChild('statusEdit') statusEdit: StatusEditComponent;
  @ViewChild('typeEdit') typeEdit: TypesEditComponent;

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
            this.userRows = this.userdata;
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

  editUser() {
    this.userEdit.open();
  }

  onEditUserClick(id) {
    const data = this.userdata.find(type => type.id === id);
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
            this.userGroupsRows = this.usergroupdata;
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

  editUsergroup() {
    this.usergroupEdit.open();
  }

  onEditUsergroupClick(id) {
    const data = this.usergroupdata.find(type => type.id === id);
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
            this.statusRows = this.statusdata;
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

  editStatus() {
    this.statusEdit.open();
  }

  onEditStatusClick(id) {
    const data = this.statusdata.find(type => type.id === id);
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
            this.typeRows = this.typedata;
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

  editType() {
    this.typeEdit.open();
  }

  onEditTypeClick(id) {
    const data = this.typedata.find(type => type.id === id);
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
