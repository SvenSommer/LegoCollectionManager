import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { CollectionModel } from '../models/collection-model';
import { CollectionService } from '../services/collection.service';
import { CollectionEditComponent } from './edit/collection-edit.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  constructor(private collectionService: CollectionService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

  public columns = [
    { title: 'Image', name: 'thumbnail_url', size: '70', minSize: '70', datatype: { type: 'image' } },
    { title: 'Name', name: 'name', size: '35%', minSize: '120' },
    { title: 'Weight(kg)', name: 'weight_kg', size: '25', minSize: '25', datatype: { type: 'number' } },
    { title: 'Origin', name: 'origin', size: '50', minSize: '50' },
    { title: 'Seller', name: 'seller', size: '30%', minSize: '80' },
    { title: 'Description', name: 'description', size: '35%', minSize: '120' },
    { title: 'Purchase Date', name: 'purchase_date', size: '100', minSize: '100', datatype: { type: 'date' } },
    { title: 'Cost', name: 'cost', size: '40', minSize: '40', datatype: { type: 'number' } },
  ];

  public data: any;

  @ViewChild('collectionEdit') collectionEdit: CollectionEditComponent;
  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    this.collectionService.getCollections().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.data = data.body.result;
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

  editCollection(id) {
    this.collectionEdit.open();
  }

  onEditClick(data) {
    this.router.navigateByUrl("/collectiondetail/" + data.id).then((bool) => { }).catch()
  }

  onRowDeleteClick(model) {
    let options = {
      title: 'Are you sure you want to delete this?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.collectionService.deleteCollection(model.id).subscribe(
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

  addNewCollection(newData: CollectionModel) {
    // this.data.push(newData);
    // this.data = Object.assign([],this.data);
    this.bindData();
  }
}
