import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { TaskModel } from 'src/app/models/task-model';
import { IdentifiedpartService } from 'src/app/services/identifiedpart.service';
import { PartdataService } from 'src/app/services/partdata.service';
import { PartimageService } from 'src/app/services/partimage.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleKeyInput(event.key);
  }

  public clearFilters: boolean;
  public selectedImagePath : string;
  public filterColorsByPart = false
  public disablePartCount = false;
  public imagePath: string;

  public identifiedpartsData: any;
  public selectedPart: any;
  public selectedColor: any;
  public selectedPartCount: any;
  public colorData: any;
  public yearFromList: any;
  public yearToList: any;

  public prevMinYear: any;
  public prevMaxYear: any;

  public selectedMinYear: any;
  public selectedMaxYear: any;

  public labelbuttoncaption = "Label Part";

  public currentpart_of_run = 0;
  public current_partid = 1;
  public totalpartscount = 0;

  public partColorFilter = [];
  public colorsList = [];
  

  private defaultPartsCount = 300;
  private colorsListCopy = [];
  private runid = 0;

  private partIdIndex: any;

  constructor(private identifiedpartsService: IdentifiedpartService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private partimageService: PartimageService,
    private toastr: ToastrService,
    private partdataService: PartdataService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params) => {
      console.log('parmas::::::::::::::',params)
      this.runid = 1; //params['runid'];
      if(params['partid']){
        this.partIdIndex = params['partid'];
       
      }
      if (this.runid > 0) {
        this.getAllScreenedpartsByRunid();
        this.getAllColordata();
      }
    });

    this.selectedPartCount = 300;
    this.disablePartCount = true;

    this.partdataService.rowData.subscribe((data) => {
      this.selectedPart = {
        partno : data.no,
        partname : data.name
      }
      this.partColorFilter = data.color_ids;
      this.filterColorsByPart = true;
      this.updateSelectedImage();
      this.filterColors();
    });

    this.partdataService.downloadData.subscribe((data) => {
      if(data){
        this.onDownloadColorsClick();
      }
    });
  }

  onNextPartClick() {
    if(this.currentpart_of_run+1 < this.totalpartscount)
    this.currentpart_of_run++;
    this.refreshCurrentPartid();
    this.clearFilters = true;
  }

  onPrevoiusPartClick() {
    if (this.currentpart_of_run > 0)
    this.currentpart_of_run--;
    this.refreshCurrentPartid();
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

  styleImage(partimage): Object {
    if (partimage && partimage.deleted != null) {
      return {
        opacity: '0.4',
        'background-color': '#ad0303',
        'border': `2px solid red`,
        'border-radius': '2px',
        filter: 'alpha(opacity=40)',
      };
    }
    return {};
  }

  onToogleAllDeleted(part) {
    part.partimages.forEach((image) => {
      this.onToggleDeleted(image);
    });
  }

  onToggleDeleted(partimage) {
    this.imagePath = partimage.path;
    if (partimage.deleted == null) {
      this.partimageService.markPartimageAsDeletedById(partimage.id).subscribe(
        (data) => {
          this.refreshImages(data);
        },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        }
      );
    } else {
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
      color_type : partimage.colortype,
      color_code : partimage.colorcode
    };
    this.updateSelectedImage();
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

  private handleKeyInput(key) {
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

      default:
        break;
    }
  }

  private getAllColordata() {
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
            this.filterColors();
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

  private onDownloadColorsClick() {
    const new_task: TaskModel = {
      type_id: 4,
      origin: JSON.stringify({run_id: this.runid}),
      information: JSON.stringify({run_id: this.runid, partno : this.selectedPart.partno})
    };
    this.taskService.createNewTask(new_task).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 201) {
            this.toastr.success(data.body.message);
           //TODO: monitor and show download progress. After download finshed, update color list.
           this.getAllScreenedpartsByRunid();
          }
          else if (data.body && data.body.code === 403) {
            this.router.navigateByUrl('/login');
          }
          else if (data.body && data.body.message) {
            this.toastr.error(data.body.message);
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  private filterYears() {
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

    this.prevMinYear = this.yearFromList[0].year_from;
    this.prevMaxYear = this.yearToList[0].year_to;

    this.selectedMinYear = this.prevMinYear;
    this.selectedMaxYear = this.prevMaxYear;
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
      this.filterColorsByPart = false;
  }

  private setLabeledPartInfo(){
    let currentpart = this.identifiedpartsData[
      this.currentpart_of_run
    ];
    if(currentpart.partno != null) {
      this.selectedPart = {
        partno : currentpart.partno
      };
      if((currentpart && currentpart.colorinfo)){
        this.selectedColor = {
          color_id : currentpart.colorinfo.color_id,
          color_name : currentpart.colorinfo.colorname,
          color_type : currentpart.colorinfo.color_type,
          color_code : currentpart.colorinfo.color_code
        };
      }else
      {
        this.selectedColor = {
          color_id : 0,
          color_name : "unknown",
          color_code : 0
        }
      }
      this.partColorFilter = currentpart.color_ids;
      this.filterColorsByPart = true;
      this.filterColors();

      this.updateSelectedImage();
      if(currentpart?.partinfo?.name != null) {
        this.selectedPart['partname'] =  currentpart.partinfo.name
      }
    } else
    this.clearPartInfo();
  }

  private refreshImages(data: any) {
    if (data) {
      if (data.body && data.body.code == 200) {
        this.getAllScreenedpartsByRunid();
      } else if (data.body && data.body.code == 403) {
        this.router.navigateByUrl('/login');
      }
    }
  }

  private filterColors(){
    this.colorsList = [];
    this.colorsList = JSON.parse(JSON.stringify(this.colorsListCopy));
    const xcopy = this.colorsList;
    xcopy.forEach((element,i) => {
      if(this.filterColorsByPart)
        element.props = element.props.filter(f => (this.partColorFilter.includes(f.color_id)));
      this.colorsList[i].props = this.sortBy(element.props, this.defaultPartsCount);
    });
    this.hideColorTabs();
  }

  private updateSelectedImage() {
    this.selectedImagePath = this.calculatePartImagePath(this.selectedPart.partno, this.selectedColor.color_id);
  }

  private clearPartInfo() {
    this.selectedPart = [];
    this.selectedColor = [];
    this.selectedImagePath = "";
  }

  private getAllScreenedpartsByRunid() {
    this.identifiedpartsService.getScreenedPartsByRunid(this.runid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.identifiedpartsData = data.body.result;
            this.totalpartscount = this.identifiedpartsData.length;
            //TODO: Only fire this on inital loading
        //    this.currentpart_of_run = this.identifiedpartsData.findIndex(x => x.id == this.partIdIndex);  
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

  private sortBy(color: any, limit: number) {
    return this.getColorsByPartCount(color, limit).sort((a, b) => {
      if (a.parts_count > b.parts_count) { return -1; }
      if (a.parts_count < b.parts_count) { return 1; }
      return 0;
    });
  }

  private hideColorTabs() {
    this.colorsList = this.colorsList.filter(e => {
      return e.props.length != 0;
    })
  }

  

  private getColorsByPartCount(colorList, limit) {
    return colorList.filter((item) => item.parts_count >= limit);
  }

}
