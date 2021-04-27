import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NearWords as NearWord, PartnameFrequencyModel, PartnameFrequencyModelExport as PartnameFrequencyExportModel } from '../../models/partnamefrequency-model';
import { PartdataService } from '../../services/partdata.service';

@Component({
  selector: 'app-partnamefrequency',
  templateUrl: './partnamefrequency.component.html',
  styleUrls: ['./partnamefrequency.component.css']
})
export class PartnamefrequencyComponent implements OnInit {

  constructor(private partdataService: PartdataService,
    private router: Router) { }

    public partcolumns = [
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

    public partdata: any;
    
    public partdataAggregated: any;
    public partNameFrequencyData : Array<PartnameFrequencyModel> = [];
    public activeButtons : any = [];
    public searchwords : Array<string> = ['none'];
    public combinedsearchword : string = ""

    public countcolumns = [
      { title: 'wordposition', name: 'wordposition', size: '5%', minSize: '50'},
      { title: 'word', name: 'word', size: '5%', minSize: '50'},
      { title: 'nearwords', name: 'nearwords', size: '5%', minSize: '50'},
      { title: 'counter', name: 'counter', size: '5%', minSize: '50'},
      { title: 'overallcounter', name: 'overallcounter', size: '5%', minSize: '50'},
    ] 

 

  ngOnInit(): void {
    this.getPartdata();
    this.getPartdataAggegratedByPartnumber();
  }

  showNextNames(clickedword: any){
    this.searchwords.push(clickedword.word);
    this.removeFromSearchwords("none");   
    this.combinedsearchword = this.searchwords.join(" ")
    this.getPartdataAggegratedByPartnumber()
  }

  private removeFromSearchwords(str: string) {
    const index = this.searchwords.indexOf(str, 0);
    if (index > -1) {
      this.searchwords.splice(index, 1);
    }
  }

  sortByCount( a, b ) {
    if ( a.counter > b.counter ){
      return -1;
    }
    if ( a.counter < b.counter ){
      return 1;
    }
    return 0;
  }

  countNames() {
    this.partNameFrequencyData = [];
    let existingentry_EveryPosition : Array<PartnameFrequencyModel>;
    var replacements:any = [
      {"search":";", "replace":" ", "undo": false},
      {"search":"Pattern", "replace":" ", "undo": false},
      {"search":"Sticker", "replace":" ", "undo": false},
      {"search":" Sheet ", "replace":" ", "undo": false},
      {"search":" Set ", "replace":" ", "undo": false},
      {"search":" of ", "replace":" ", "undo": false},
      {"search":"with ", "replace":"with_", "undo": true},
      {"search":" and ", "replace":" ", "undo": false},
      {"search":" for ", "replace":" ", "undo": false},
      {"search":"/", "replace":" ", "undo": false},
      {"search":"&", "replace":" ", "undo": false},
      {"search":" on ", "replace":" ", "undo": false},
      {"search":"Minifigure", "replace":"", "undo": false},
      {"search":"-", "replace":" ", "undo": false},
      {"search":" x ", "replace":"_x_", "undo": true},
      {"search":" Side", "replace":"_Side", "undo": true},
      {"search":" Hole", "replace":"_Hole", "undo": true},
      {"search":"(", "replace":" ", "undo": false},
      {"search":"#39", "replace":" ", "undo": false},
      {"search":"#40", "replace":" ", "undo": false},
      {"search":")", "replace":" ", "undo": false},
      {"search":"#41", "replace":" ", "undo": false},
      {"search":"`", "replace":" ", "undo": false},
      {"search":"'", "replace":" ", "undo": false},
    ]
    let numberofnamesToWork = 10000
    let namecounter = 1;
  //  console.log("Calculating words of "+    this.partdataAggregated.length  + " part names. Limit " + numberofnamesToWork );
    this.partdataAggregated.forEach(part => {
      if(namecounter > numberofnamesToWork )
         return;
      let partname = part.name;
      replacements.forEach(repl => {
         partname = partname.replaceAll(repl.search, repl.replace)   
      });
      
      const splitpartname = partname.split(/[\s,]+/)
      let wordposition = 1
      
      splitpartname.forEach((word, index) => {
        
          if(!this.isEmpty(word) && !this.isSetnumber(word)) {

            existingentry_EveryPosition = this.partNameFrequencyData.filter(function(item){
              if(item.word.toUpperCase() === word.toUpperCase())
                return true;
            });

            //Somewhere this word appeared already
            if(existingentry_EveryPosition.length > 0 ) {
              existingentry_EveryPosition.forEach((existing_entry) => {
                  existing_entry.counter++
              })
            }

            if(existingentry_EveryPosition.length < 1 ) {
              this.partNameFrequencyData.push({"wordposition": wordposition
                ,"word" : word
                ,"counter" : 1});
            }
          wordposition++;
          }
      });
      namecounter++;
    });
    console.log( this.partNameFrequencyData)

    this.partNameFrequencyData = this.partNameFrequencyData.sort(this.sortByCount).slice(0, 20);
    this.activeButtons = [];
    this.partNameFrequencyData.forEach(element => {
      if(!this.searchwords.includes(element.word))
      replacements.forEach(repl => {
        if(repl.undo)
          element.word = element.word.replace(repl.replace, repl.search)   
     });
        this.activeButtons.push({
          "word" : element.word,
          "counter" : element.counter
        })
    });

  }

  private isEmpty(str) {
    return (!str || str.length === 0 );
  }

  private isSetnumber(str) {
    return /\d{3,10}/.test(str);
  }

  private getNearWords(index: number, splitpartname: Array<string>) {
    let nearwords = [];
    if (index > 0) {
      let lastword = splitpartname[index - 1];
      nearwords.push(lastword);
    }
    if (index + 1 < splitpartname.length) {
      let nextword = splitpartname[index + 1];
      nearwords.push(nextword);
    }
    return nearwords;
  }


  exists(arr, search) {
    return arr.some(row => row.includes(search));
  }

  getPartdataAggegratedByPartnumber() {
   // console.log( "getPartdataAggegratedByPartnumber with searchwords " + this.searchwords.join(","))
    this.partdataService.getPartdataAggegratedByPartnumber(this.searchwords.join(",")).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.partdataAggregated = data.body.result;
           // console.log("Found " + this.partdataAggregated.length + " parts" );
            this.countNames()
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

  getPartdata() {
    this.partdataService.getPartdata().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.partdata = data.body.result;
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
