import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CollectionModel } from 'src/app/models/collection-model';
import { CollectionService } from 'src/app/services/collection.service';
import { CollectionEditComponent } from '../edit/collection-edit.component';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements OnInit {

  @ViewChild('collectionEdit') collectionEdit: CollectionEditComponent;

  public collectionDetails;
  public collectionSummary;
  public uniqueDetails;

  public runsColumns = [
    { title: 'Run #', name: 'run_id', size: '30', minSize: '30' },
    { title: 'Status', name: 'status_name', size: '25%', minSize: '90' },
    { title: 'Parts unidentified', name: 'parts_unidentified', size: '25', minSize: '25' },
    { title: 'Parts deleted', name: 'parts_deleted', size: '50', minSize: '50' },
    { title: 'Parts identified', name: 'parts_identified', size: '25%', minSize: '80' },
    { title: 'unique Parts identified', name: 'parts_uniquepartsidentified', size: '25%', minSize: '120' },
    { title: 'Created', name: 'created', size: '25%', minSize: '100', datatype: { type: 'date' } },
  ];

  public expSetsColumns = [
    { title: 'Image', name: 'thumbnail_url', size: '50', minSize: '50', datatype: { type: 'image' } },
    { title: 'setNo', name: 'no', size: '30', minSize: '30' },
    { title: 'Category', name: 'category_name', size: '30%', minSize: '50' },
    { title: 'Name', name: 'name', size: '70%', minSize: '90' },
    { title: 'year', name: 'year', size: '25', minSize: '25' },
    { title: 'weight(g)', name: 'weight_g', size: '25', minSize: '25' },
    { title: 'parts', name: 'parts_existing', size: '25', minSize: '25' },
    { title: 'Complete', name: 'complete_percentage', size: '25', minSize: '25' },
    { title: 'Minifigs', name: 'complete_minifigs_count', size: '25', minSize: '25' },
    { title: 'Min price(€)', name: 'min_price', size: '35', minSize: '35', datatype: { type: 'price' } },
    { title: 'Avg price(€)', name: 'avg_price', size: '35', minSize: '35', datatype: { type: 'price' } },
    { title: 'Status', name: 'status_name', size: '25', minSize: '25' },
  ];

  public suggSetsColumns = [
    { title: 'Image', name: 'thumbnail_url', size: '50', minSize: '50', datatype: { type: 'image' } },
    { title: 'Set No', name: 'setNo', size: '30', minSize: '30' },
    { title: 'Category', name: 'category_name', size: '50', minSize: '50' },
    { title: 'Name', name: 'name', size: '25%', minSize: '90' },
    { title: 'Year', name: 'year', size: '25', minSize: '25' },
    { title: 'Weight(g)', name: 'weight_g', size: '25', minSize: '25' },
    { title: 'Parts', name: 'parts_existing', size: '25', minSize: '25' },
    { title: 'Complete %', name: 'complete_percentage', size: '25', minSize: '25' },
    { title: 'Minifigs', name: 'complete_minifigs_count', size: '25', minSize: '25' },
    { title: 'Min price (€)', name: 'min_price', size: '25', minSize: '25', datatype: { type: 'price' } },
    { title: 'Max price (€)', name: 'max_price', size: '25', minSize: '25', datatype: { type: 'price' } },
  ];

  public ExpPartsColumns = [
    { title: 'Image', name: 'thumbnail_url', size: '50', minSize: '50', datatype: { type: 'image' } },
    { title: 'Part No', name: 'part_no', size: '30', minSize: '30' },
    { title: 'name', name: 'name', size: '25%', minSize: '90' },
    { title: 'Set No', name: 'setNos', size: '30', minSize: '30' },
    { title: 'Total Quantity', name: 'total_quantity', size: '30', minSize: '30' },
    { title: 'Status', name: 'status_name', size: '30', minSize: '30' },
    { title: 'Avg € (sold)', name: 'qty_avg_price_sold', size: '30', minSize: '30', datatype: { type: 'price' } },

  ];

  public UnsettedPartsColumns = [
    { title: 'Image', name: 'thumbnail_url', size: '50', minSize: '50', datatype: { type: 'image' } },
    { title: 'No', name: 'partNo', size: '25%', minSize: '30' },
    { title: 'Color Id', name: 'color_id', size: '25%', minSize: '90' },
    { title: 'Appears in sets', name: 'super_set_count', size: '25%', minSize: '90' },
    { title: 'Downloaded Sets', name: 'downloaded_sets', size: '25%', minSize: '90' },
    { title: 'Part in Sets', name: 'part_in_sets_of_collection', size: '90', minSize: '90' },
    { title: 'Super Set Count', name: 'super_set_count', size: '90', minSize: '90' },


  ];

  public ExpMinifigsColumns = [
    { title: 'Part No', name: 'part_no', size: '35', minSize: '35' },
    { title: 'Image', name: 'thumbnail_url', size: '50', minSize: '50', datatype: { type: 'image' } },
    { title: 'Sets No', name: 'setNos', size: '35', minSize: '35' },
    { title: 'Total Quantity', name: 'total_quantity', size: '25', minSize: '25' },
    { title: 'Description', name: 'name', size: '35%', minSize: '90' },
    { title: 'Status Name', name: 'status_name', size: '25%', minSize: '90' },
    { title: 'Avg € (sold)', name: 'qty_avg_price_sold', size: '50', minSize: '90', datatype: { type: 'price' }  },
  ];

  public runsData: any;
  public expectedSets: any;
  public suggestedSets: any;
  public expectedParts: any;
  public unsettedParts: any;
  public expectedMinifigs: any;
  public currentTab = '';
  public isMoreFieldOpenForSet = false;
  public newSetDetails = {
    "collectionid": 0,
    "setnumber": "",
    "comments": "",
    "instructions": "",
    "condition": ""
  };
  public isSetFormSubmitted = false;

  constructor(private activatedRoute: ActivatedRoute,
    private collectionService: CollectionService,
    private router: Router, private toastr: ToastrService) { }

  public id = 0;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id > 0) {
        this.newSetDetails.collectionid = this.id;
        this.bindData();
        this.getAllRuns();
        this.getExpectedSets();
      }
    });
  }

  bindData() {
    this.collectionService.getCollectionById(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.collectionDetails = data.body.general;
            this.collectionSummary = data.body.summarized;
            this.uniqueDetails = data.body.unique;
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

  onEditClick() {
    this.collectionEdit.open(this.collectionDetails);
  }

  addNewCollection(newData: CollectionModel) {
    // this.data.push(newData);
    // this.data = Object.assign([],this.data);
    this.bindData();
  }

  getAllRuns() {
    this.collectionService.getRuns(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.runsData = data.body;
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

  getExpectedSets() {
    this.currentTab = '';

    this.collectionService.getExpectedSets(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedSets = data.body.sets;
            this.currentTab = 'Expected Sets';
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

  getSuggestedSets() {
    this.currentTab = '';
    this.collectionService.getSuggestedSets(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.suggestedSets = data.body.setsResult;
            this.currentTab = 'Suggested Sets';
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

  getExpectedParts() {
    this.currentTab = '';

    this.collectionService.getExpectedParts(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedParts = data.body.result;
            this.currentTab = 'Expected Parts';
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

  getUnsettedParts() {
    this.currentTab = '';

    this.collectionService.getUnsettedParts(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.unsettedParts = data.body.result;
            this.currentTab = 'Unsetted Parts';

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

  getExpectedMinifigs() {
    this.currentTab = '';

    this.collectionService.getExpectedMinifigs(this.id).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.expectedMinifigs = data.body.result;
            this.currentTab = 'Expected Minifigs';
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

  onSubmitAddSets(form: NgForm) {
    this.isSetFormSubmitted = true;
    if (!form.valid) {
      return;
    }
    this.collectionService.saveNewSets(this.newSetDetails).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 201) {
            this.toastr.success(data.body.message);
            this.newSetDetails = {
              "collectionid": this.id,
              "setnumber": "",
              "comments": "",
              "instructions": "",
              "condition": ""
            };
            this.isSetFormSubmitted = false;
            form.reset();
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