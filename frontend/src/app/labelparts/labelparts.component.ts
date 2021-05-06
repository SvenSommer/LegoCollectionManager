import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { HttpErrorResponse } from '@angular/common/http';
import { IdentifiedpartService } from '../services/identifiedpart.service';
import { PartimageService } from '../services/partimage.service';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { PartdataService } from '../services/partdata.service';

@Component({
  selector: 'app-labelparts',
  templateUrl: './labelparts.component.html',
  styleUrls: ['./labelparts.component.css'],
})
export class LabelpartsComponent implements OnInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.HandleKeyInput(event.key);
  }

  disablePartCount = false;
  disableMinYear = false;
  disableMaxYear = false;

  selectedPartCount: any;
  selectedMinYear: any;
  selectedMaxYear: any;

  yearFromList: any;
  yearToList: any;

  imagePath: string;
  selectedColor: any;
  rowData: any;

  public identifiedpartsData: any;
  public defaultPartsCount = 1000;
  public partCountsRange = [50,100,200,300,500,1000];

  constructor(
    private overlayContainer: OverlayContainer,
    private activatedRoute: ActivatedRoute,
    private identifiedpartsService: IdentifiedpartService,
    private partimageService: PartimageService,
    private router: Router,
    private toastr: ToastrService,
    private partdataService: PartdataService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService
  ) {}

  public runid = 0;
  public currentpart_of_run = 0;
  public current_partid = 1;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.runid = params['runid'];
      if (this.runid > 0) {
        this.getAllIdentifiedpartsByRunid();
        this.getAllPartdata();
        this.getAllColordata();
      }
    });
    this.selectedPartCount = 1000;
    this.disablePartCount = true;

    this.partdataService.rowData.subscribe((data) => {
      this.rowData = data;
    });
  }

  public identifiedpartsColumns = [
    {
      title: 'Part Images Recorded',
      name: 'partimages',
      size: '65',
      minSize: '65',
      maxSize: '30%',
      datatype: { type: 'images' },
    },
    {
      title: 'Recignised Part',
      name: 'thumbnail_url',
      size: '65',
      minSize: '65',
      datatype: { type: 'image' },
    },
    { title: 'Color', name: 'color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'name', size: '120', minSize: '80' },
    { title: 'Color Id', name: 'color_id', size: '80', minSize: '80' },
    { title: 'Partno', name: 'no', size: '80', minSize: '80' },
    { title: 'Identifier', name: 'identifier', size: '30', minSize: '30' },
    {
      title: 'Created',
      name: 'created',
      size: '100',
      minSize: '100',
      datatype: { type: 'date' },
    },
  ];

  public partColumns = [
    {
      title: 'Image',
      name: 'partinfo.thumbnail_url',
      size: '65',
      minSize: '65',
      datatype: { type: 'image' },
    },
    { title: 'Number', name: 'partno', size: '5%', minSize: '50' },
    { title: 'Colorid', name: 'color_id', size: '5%', minSize: '50' },
    { title: 'Type', name: 'type', size: '5%', minSize: '50' },
    { title: 'Name', name: 'partinfo.name', size: '30%', minSize: '120' },
    {
      title: 'Category',
      name: 'partinfo.category_name',
      size: '30',
      minSize: '120',
    },
    { title: 'Year', name: 'partinfo.year', size: '30', minSize: '50' },
    {
      title: 'Weight(g)',
      name: 'partinfo.weight_g',
      size: '40',
      minSize: '40',
    },
    { title: 'Size', name: 'partinfo.size', size: '80', minSize: '80' },
    {
      title: 'Obsolete',
      name: 'partinfo.is_obsolete',
      size: '50',
      minSize: '50',
    },
    {
      title: 'avg Price (stock)',
      name: 'partinfo.qty_avg_price_stock',
      size: '40',
      minSize: '40',
      datatype: { type: 'price' },
    },
    {
      title: 'avg Price (sold)',
      name: 'partinfo.qty_avg_price_sold',
      size: '40',
      minSize: '40',
      datatype: { type: 'price' },
    },
    {
      title: 'Avg Price',
      name: 'partinfo.avg_price',
      size: '40',
      minSize: '40',
      datatype: { type: 'price' },
    },
  ];
  public partData: any;

  public colorColumns = [
    { title: 'Name', name: 'color_name', size: '5%', minSize: '50' },
    {
      title: 'Code',
      name: 'color_code',
      size: '30%',
      minSize: '120',
      datatype: { type: 'color' },
    },
    { title: 'Type', name: 'color_type', size: '30', minSize: '120' },
    {
      title: 'Parts Count',
      name: 'parts_count',
      size: '30',
      minSize: '50',
      datatype: { type: 'number' },
    },
    {
      title: 'Year From',
      name: 'year_from',
      size: '40',
      minSize: '40',
      datatype: { type: 'number' },
    },
    {
      title: 'Year to',
      name: 'year_to',
      size: '80',
      minSize: '80',
      datatype: { type: 'number' },
    },
  ];

  public colorData: any;
  public errorMsg: any;
  public colorsList = [];
  public colorsListCopy = [];

  onNextPartClick() {
    this.currentpart_of_run++;
    this.refreshCurrentPartid();
  }

  onPrevoiusPartClick() {
    this.currentpart_of_run--;
    this.refreshCurrentPartid();
  }

  HandleKeyInput(key) {
    console.log(key);

    switch (key) {
      case 'ArrowRight':
        this.onNextPartClick();
        break;
      case 'ArrowLeft':
        this.onPrevoiusPartClick();
        break;

      case 'Delete':
        this.onDeleteIdentifiedPartClick(this.current_partid);
        break;
      case '0':
        this.onToogleAllDeleted(
          this.identifiedpartsData[this.currentpart_of_run]
        );
        break;

      default:
        break;
    }
  }

  preventCloseOnClickOut() {
    this.overlayContainer.getContainerElement().classList.add('disable-backdrop-click');
  }

  allowCloseOnClickOut() {
    this.overlayContainer.getContainerElement().classList.remove('disable-backdrop-click');
  }

  styleImage(partimage): Object {
    if (partimage.deleted != null) {
      return {
        opacity: '0.4',
        'background-color': '#ad0303',
        filter: 'alpha(opacity=40)',
      };
    }
    return {};
  }

  onDeleteIdentifiedPartClick(id) {
    let options = {
      title: 'Are you sure you want to delete part?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.identifiedpartsService
          .markIdentifiedpartAsDeletedById(id)
          .subscribe(
            (data) => {
              this.refreshImages(data);
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

  sortBy(color: any, limit: number) {
    return this.getColorsByPartCount(color, limit).sort((a, b) => {
      if (a.parts_count > b.parts_count) { return -1; }
      if (a.parts_count < b.parts_count) { return 1; }
      return 0;
    });
  }

  getColorsByPartCount(colorList, limit) {
    return colorList.filter((item) => item.parts_count >= limit);
  }

  pickColor(col) {
    this.selectedColor = col;
  }

  clearSelection() {
    this.errorMsg = '';
    this.disablePartCount = true;
    this.disableMinYear = false;
    this.disableMaxYear = false;

    this.selectedPartCount = 1000;
    this.selectedMinYear = '';
    this.selectedMaxYear = '';

    this.defaultPartsCount = this.selectedPartCount;
    this.filterByPartCount();
  }

  onChangePartCount(event) {
    this.defaultPartsCount = event;
    this.selectedPartCount = event;
    // this.filterByPartCount();
    this.selectDateRange();
  }

  filterByPartCount(){
    this.colorsList = [];
    this.colorsList = JSON.parse(JSON.stringify(this.colorsListCopy));
    const xcopy = this.colorsList;
    xcopy.forEach((element,i) => {
      this.colorsList[i].props = this.sortBy(element.props, this.defaultPartsCount);
    });
    this.hideColorTabs();
  }

  selectDateRange() {
    this.colorsList = [];
    this.colorsList = JSON.parse(JSON.stringify(this.colorsListCopy));
    const xcopy = this.colorsList;
    xcopy.forEach((element,i) => {
      this.colorsList[i].props = this.sortBy(element.props, this.defaultPartsCount);
    });
    if(this.selectedMaxYear && this.selectedMinYear > this.selectedMaxYear) {
      this.errorMsg = 'Min Year should not be greater than Max Year';
    }
    else{
      this.errorMsg = '';
      if(this.selectedMinYear && !this.selectedMaxYear && this.selectedPartCount){
        this.colorsList = this.colorsList.map(p => {
          p.props = p.props.filter(e=>((e.year_from >= this.selectedMinYear)))
          return p;
        });
      }
      else if(!this.selectedMinYear && this.selectedMaxYear && this.selectedPartCount){
        this.colorsList = this.colorsList.map(p => {
          p.props = p.props.filter(e=>((e.year_to <= this.selectedMaxYear)))
          return p;
        });
      }
      else if(this.selectedMinYear && this.selectedMaxYear && this.selectedPartCount){
        if(this.selectedMinYear <= this.selectedMaxYear){
          this.colorsList = this.colorsList.map(p => {
            p.props = p.props.filter(e=>((e.year_from >= this.selectedMinYear) && (e.year_to <= this.selectedMaxYear)))
            return p;
          });
        }
      }
    }


    this.hideColorTabs();
  }

  hideColorTabs() {
    this.colorsList = this.colorsList.filter(e => {
      return e.props.length != 0;
    })
  }

  changeSelection(){
    if(!this.disablePartCount){
      this.selectedPartCount = '';
    }
    else if(!this.disableMinYear){
      this.selectedMinYear = '';
    }
    else if(!this.disableMaxYear){
      this.selectedMaxYear = '';
    }

    if(!this.disablePartCount && !this.disableMinYear && !this.disableMaxYear){
      this.defaultPartsCount = 0;
      this.filterByPartCount();
    }
  }

  filterYears() {
    let colorDataCopy = JSON.parse(JSON.stringify(this.colorData));
    this.yearFromList = colorDataCopy.filter(function (el) {
      return el.year_from != null;
    });
    this.yearToList = colorDataCopy.filter(function (el) {
      return el.year_to != null;
    });
    this.yearFromList = this.yearFromList.sort((a, b) => {
      if (a.year_from > b.year_from) { return 1; }
      if (a.year_from < b.year_from) { return -1; }
      return 0;
    });
    this.yearToList = this.yearToList.sort((a, b) => {
      if (a.year_to > b.year_to) { return -1; }
      if (a.year_to < b.year_to) { return 1; }
      return 0;
    });

    this.yearFromList =  this.yearFromList.filter((v,i) => this.yearFromList.findIndex(item => item.year_from == v.year_from) === i);
    this.yearToList =  this.yearToList.filter((v,i) => this.yearToList.findIndex(item => item.year_to == v.year_to) === i);
  }

  onToogleAllDeleted(part) {
    part.partimages.forEach((image) => {
      this.onToggleDeleted(image);
    });
  }

  onToggleDeleted(partimage) {
    this.imagePath = partimage.path;
    if (partimage.deleted == null) {
      console.log('delete');
      this.partimageService.markPartimageAsDeletedById(partimage.id).subscribe(
        (data) => {
          this.refreshImages(data);
        },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        }
      );
    } else {
      console.log('undelete');
      this.partimageService
        .markPartimageAsNotDeletedById(partimage.id)
        .subscribe(
          (data) => {
            this.refreshImages(data);
          },
          (error: HttpErrorResponse) => {
            console.log(error.name + ' ' + error.message);
          }
        );
    }
  }

  private refreshImages(data: any) {
    if (data) {
      if (data.body && data.body.code == 200) {
        // Message should be data.body.message
        this.getAllIdentifiedpartsByRunid();
      } else if (data.body && data.body.code == 403) {
        this.router.navigateByUrl('/login');
      }
    }
  }

  getAllIdentifiedpartsByRunid() {
    this.identifiedpartsService.getIdentifiedpartByRunid(this.runid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            // console.log( data.body.result[0])
            this.identifiedpartsData = data.body.result;
            this.refreshCurrentPartid();
          } else if (data.body && data.body.code == 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  getAllPartdata() {
    this.identifiedpartsService.getPartdata().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            // console.log( data.body.result[0])
            this.partData = data.body.result;
          } else if (data.body && data.body.code == 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  getAllColordata() {
    this.identifiedpartsService.getColordata().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.colorData = data.body.result;
            let flags = [],
              colorTypesList = [],
              l = this.colorData.length,
              i;
            for (i = 0; i < l; i++) {
              if (flags[this.colorData[i].color_type]) continue;
              flags[this.colorData[i].color_type] = true;
              colorTypesList.push(this.colorData[i].color_type);
            }

            colorTypesList.forEach((item) => {
              let obj = {
                label: '',
                props: [],
              };
              obj.label = item;
              this.colorData.forEach((element) => {
                if (item == element.color_type) {
                  obj.props.push(element);
                }
              });
              this.colorsList.push(obj);
            });
            this.colorsListCopy = JSON.parse(JSON.stringify(this.colorsList));
            this.filterYears();
            this.filterByPartCount();
          } else if (data.body && data.body.code == 403) {
            this.router.navigateByUrl('/login');
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  private refreshCurrentPartid() {
    if (this.identifiedpartsData)
      this.current_partid = this.identifiedpartsData[
        this.currentpart_of_run
      ].id;
  }
}
