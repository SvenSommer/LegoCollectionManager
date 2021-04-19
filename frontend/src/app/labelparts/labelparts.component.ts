import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { HttpErrorResponse } from '@angular/common/http';
import { IdentifiedpartService } from '../services/identifiedpart.service';
import { PartimageService } from '../services/partimage.service';


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



  public identifiedpartsData: any;
  constructor(private activatedRoute: ActivatedRoute,
    private identifiedpartsService: IdentifiedpartService,
    private partimageService: PartimageService,
    private router: Router, private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) { }


  public runid = 0;
  public currentpart_of_run = 0;
  public current_partid = 1;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.runid = params['runid'];
      if (this.runid > 0) {
        this.getAllIdentifiedpartsByRunid();
        this.getAllPartdata();
        this.getAllColordata();
      }
    });
  }

  public identifiedpartsColumns = [
    { title: 'Part Images Recorded', name: 'partimages', size: '65', minSize: '65', maxSize: '30%', datatype:{ type: 'images' } },
    { title: 'Recignised Part', name: 'thumbnail_url', size: '65', minSize: '65' , datatype:{ type: 'image' }},
    { title: 'Color', name: 'color_name', size: '30', minSize: '30' },
    { title: 'Name', name: 'name', size: '120', minSize: '80' },
    { title: 'Color Id', name: 'color_id', size: '80', minSize: '80' },
    { title: 'Partno', name: 'no', size: '80', minSize: '80' },
    { title: 'Identifier', name: 'identifier', size: '30', minSize: '30' },
    { title: 'Created', name: 'created', size: '100', minSize: '100', datatype: { type: 'date' }},
  ];

  public partColumns = [
    { title: 'Image', name: 'partinfo.thumbnail_url', size: '65', minSize: '65', datatype: { type: 'image' } },
    { title: 'Number', name: 'partno', size: '5%', minSize: '50'},
    { title: 'Colorid', name: 'color_id', size: '5%', minSize: '50'},
    { title: 'Type', name: 'type', size: '5%', minSize: '50'},
    { title: 'Name', name: 'partinfo.name', size: '30%', minSize: '120' },
    { title: 'Category', name: 'partinfo.category_name', size: '30', minSize: '120' },
    { title: 'Year', name: 'partinfo.year', size: '30', minSize: '50' },
    { title: 'Weight(g)', name: 'partinfo.weight_g', size: '40', minSize: '40' },
    { title: 'Size', name: 'partinfo.size', size: '80', minSize: '80' },
    { title: 'Obsolete', name: 'partinfo.is_obsolete', size: '50', minSize: '50' },
    { title: 'avg Price (stock)', name: 'partinfo.qty_avg_price_stock', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'avg Price (sold)', name: 'partinfo.qty_avg_price_sold', size: '40', minSize: '40', datatype: { type: 'price' } },
    { title: 'Avg Price', name: 'partinfo.avg_price', size: '40', minSize: '40', datatype: { type: 'price' } }
  ]
  public partData: any;

  public colorColumns = [
    { title: 'Name', name: 'color_name', size: '5%', minSize: '50'},
    { title: 'Code', name: 'color_code', size: '30%', minSize: '120' , datatype: { type: 'color' }},
    { title: 'Type', name: 'color_type', size: '30', minSize: '120' },
    { title: 'Parts Count', name: 'parts_count', size: '30', minSize: '50', datatype: { type: 'number' } },
    { title: 'Year From', name: 'year_from', size: '40', minSize: '40', datatype: { type: 'number' } },
    { title: 'Year to', name: 'year_to', size: '80', minSize: '80' , datatype: { type: 'number' }},
  ]


  public colorData: any;



  onNextPartClick(){
    this.currentpart_of_run++;
    this.refreshCurrentPartid();
  }

  onPrevoiusPartClick(){
    this.currentpart_of_run--;
    this.refreshCurrentPartid();
  }

  HandleKeyInput(key) {
    console.log(key)
  
    switch (key) {
      case "ArrowRight": 
        this.onNextPartClick()
        break;
      case "ArrowLeft": 
        this.onPrevoiusPartClick();
        break;
        
      case "Delete": 
          this.onDeleteIdentifiedPartClick(this.current_partid)
        break;        
      case "0": 
          this.onToogleAllDeleted(this.identifiedpartsData[this.currentpart_of_run])
        break;
    
      default:
        break;
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

  onDeleteIdentifiedPartClick(id){
    let options = {
      title: 'Are you sure you want to delete part?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay');
        this.identifiedpartsService.markIdentifiedpartAsDeletedById(id).subscribe(
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

  onToogleAllDeleted(part){
    part.partimages.forEach(image => {
      this.onToggleDeleted(image)
    });
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

  private refreshImages(data: any) {
    if (data) {
      if (data.body && data.body.code == 200) {
        // Message should be data.body.message
        this.getAllIdentifiedpartsByRunid();
      }
      else if (data.body && data.body.code == 403) {
        this.router.navigateByUrl("/login");
      }
    }
  }

  getAllIdentifiedpartsByRunid() {
    this.identifiedpartsService.getIdentifiedpartByRunid(this.runid).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            console.log( data.body.result[0])
            this.identifiedpartsData = data.body.result;
            this.refreshCurrentPartid();
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

  getAllPartdata() {
    this.identifiedpartsService.getPartdata().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            console.log( data.body.result[0])
            this.partData = data.body.result;
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
  
  getAllColordata() {
    this.identifiedpartsService.getColordata().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            console.log( data.body.result[0])
            this.colorData = data.body.result;
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
  

  private refreshCurrentPartid() {
    if(this.identifiedpartsData)
      this.current_partid = this.identifiedpartsData[this.currentpart_of_run].id;
  }
}


