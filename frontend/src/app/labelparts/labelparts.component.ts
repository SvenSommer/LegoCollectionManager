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
import { IdentifiedPartDBModel } from '../models/identifiedpartdb-model';

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

  labelbuttoncaption = "Label Part"
  disablePartCount = false;
  disableMinYear = false;
  disableMaxYear = false;

  selectedPartCount: any;
  selectedMinYear: any;
  selectedMaxYear: any;

  yearFromList: any;
  yearToList: any;

  imagePath: string;
  selectedImagePath : string;
  selectedColor: any;
  selectedPart: any;
  rowData: any;

  public identifiedpartsData: any;
  public defaultPartsCount = 300;
  public partCountsRange = [100,300,500,1000,2000];

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
        this.getAllScreenedpartsByRunid();
        this.getAllColordata();
      }
    });
    this.selectedPartCount = 300;
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
      title: 'Recognised Part',
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

  public colorData: any;
  public errorMsg: any;
  public colorsList = [];
  public colorsListCopy = [];

  onNextPartClick() {
    this.currentpart_of_run++;
    this.refreshCurrentPartid();
  }

  onPrevoiusPartClick() {
    if (this.currentpart_of_run > 0)
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

  styleImagePrediction(partimage): Object {
    if (partimage.deleted != null) {
      return {
        opacity: '0.4',
        'background-color': '#ad0303',
        filter: 'alpha(opacity=40)',
      };
    }
    let borderpixel = Math.floor((partimage.score/25))
    if ( borderpixel < 1) borderpixel = 1;
    if (partimage.score < 50){
      return {
        'border': `${borderpixel}px solid blue`,
        'border-radius': '3px'
      }
    }
    else if (partimage.score > 90){
      return {
        'border': `${borderpixel}px solid green`,
        'border-radius': '3px'
      }
    }
    else
      return {
        'border': `${borderpixel}px solid yellow`,
        'border-radius': '3px'
      }
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
    this.updateSelectedImage();
  }

  updateSelectedImage() {
 //   this.selectedPart = { partno : "3020"};
    this.selectedImagePath = this.calculatePartImagePath(this.selectedPart.partno, this.selectedColor.color_id);
  }


  calculatePartImagePath(partno, colorid){
    if(colorid != 0)
      return `//img.bricklink.com/P/${colorid}/${partno}.jpg`;
      else 
      return `//img.bricklink.com/PL/${partno}.jpg`
  }

  onPredictionClicked(partimage){
    this.selectedPart = { 
      partno : partimage.partno,
      partname : partimage.partname
    };
    this.selectedColor = {
      color_id : partimage.colorid, 
      color_name : partimage.colorname,
      color_code : partimage.color_code
    };
    this.updateSelectedImage();
  }
  
  onLabelPartClick(){
    if(this.selectedColor.color_id != 0) {
      let identifiedpart : IdentifiedPartDBModel = {
          id : this.current_partid,
          run_id : this.runid,
          no : this.selectedPart.partno,
          color_id : this.selectedColor.color_id,
          score : 100,
          identifier : "human"  
      }


      console.log("identifiedpart to save",identifiedpart)

      this.identifiedpartsService.updatetIdentifiedpart(identifiedpart).subscribe(
        (data) => {
          if (data.body.code == 201 || data.body.code == 200) {
            this.toastr.success(data.body.message);
            this.getAllScreenedpartsByRunid();
          }
          else {
            this.toastr.error(data.body.message);
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        }
      );
     } else{
      this.toastr.info("Please select a valid color!")
     }

  }

  setLabeledPartInfo(){
    let currentpart = this.identifiedpartsData[
      this.currentpart_of_run
    ];
    console.log("currentpart",currentpart)
    if(currentpart.partno != null) {
      this.selectedPart = { 
        partno : currentpart.partno
      };

      this.selectedColor = {
        color_id : currentpart.color_id
      };

      this.updateSelectedImage();
      if(currentpart?.partinfo?.name != null) {
        this.selectedPart['partname'] =  currentpart.partinfo.name 
      }
    } else 
    this.clearPartInfo();
  }

  clearPartInfo() {
    this.selectedPart = null;
    this.selectedColor = null;
    this.selectedImagePath = null;
  }

  clearColorSelection() {
    this.errorMsg = '';
    this.disablePartCount = true;
    this.disableMinYear = false;
    this.disableMaxYear = false;

    this.selectedImagePath = "";
    this.selectedPartCount = 300;
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
      else if(this.selectedMinYear && this.selectedMaxYear){
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
      this.defaultPartsCount = 0;
    }
    else if(!this.disableMinYear){
      this.selectedMinYear = '';
    }
    else if(!this.disableMaxYear){
      this.selectedMaxYear = '';
    }

    if(!this.disablePartCount && !this.disableMinYear && !this.disableMaxYear){
      this.defaultPartsCount = 0;
    }
    // this.filterByPartCount();
    this.selectDateRange();
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
        this.getAllScreenedpartsByRunid();
      } else if (data.body && data.body.code == 403) {
        this.router.navigateByUrl('/login');
      }
    }
  }

  getAllScreenedpartsByRunid() {
    this.identifiedpartsService.getScreenedPartsByRunid(this.runid).subscribe(
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
      if(this.identifiedpartsData[
        this.currentpart_of_run
      ].partno == null)
      {
        this.labelbuttoncaption = "Label Part"
      }
      else
      {
        this.labelbuttoncaption = "Update Part"
      }
      this.setLabeledPartInfo();
  }
}
