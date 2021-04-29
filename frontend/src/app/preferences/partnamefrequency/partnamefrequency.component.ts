import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartnameFrequencyCachingModel, PartnameFrequencyModel } from '../../models/partnamefrequency-model';
import { PartdataService } from '../../services/partdata.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-partnamefrequency',
  templateUrl: './partnamefrequency.component.html',
  styleUrls: ['./partnamefrequency.component.css']
})
export class PartnamefrequencyComponent implements OnInit {

  constructor(private partdataService: PartdataService,
     private toastr: ToastrService,
    private router: Router) { }

    public partcolumns = [
      { title: 'Image', name: 'image_url', size: '5%', minSize: '65', datatype: { type: 'image' } },
      { title: 'Name', name: 'name', size: '20%', minSize: '50'},
      { title: 'Number', name: 'no', size: '5%', minSize: '50'},
    //  { title: 'Colorids', name: 'color_ids', size: '5%', minSize: '50'},
      { title: 'use count', name: 'usecount', size: '5%', minSize: '50'},


    ]

    public partdataAggregated: any;
    public partNameFrequencyData : Array<PartnameFrequencyModel> = [];
    public activeButtonsWords : any = [];
    public activeButtonsNumbers : any = [];
    public searchwords : Array<string> = ['none'];
    public newsearchword: string;
    public combinedsearchword : string = ""

    public countcolumns = [
      { title: 'wordposition', name: 'wordposition', size: '5%', minSize: '50'},
      { title: 'word', name: 'word', size: '5%', minSize: '50'},
      { title: 'nearwords', name: 'nearwords', size: '5%', minSize: '50'},
      { title: 'counter', name: 'counter', size: '5%', minSize: '50'},
      { title: 'overallcounter', name: 'overallcounter', size: '5%', minSize: '50'},
    ]



  ngOnInit(): void {
    this.getPartdataAggegratedByPartnumber();
  }

  showNextNames(clickedword: any){
    let newword = clickedword.word
    this.RefreshSearch(newword);
  }

  private RefreshSearch(newword: any) {
    this.searchwords.push(newword);
    this.removeFromSearchwords("none");
    this.getFilteredRestaurants(this.searchwords);
    this.combinedsearchword = this.searchwords.join(" ");
    this.getPartdataAggegratedByPartnumber();
  }

    getFilteredRestaurants(list) {
      const keys = Object.keys(this.partdataAggregated[0]);
      list.forEach((element,index) => {
        element = element.toUpperCase();
        let result = this.partdataAggregated.filter(
          (v) =>
            v &&
            keys.some((k) => {
              if(v[k] && v[k].constructor && v[k].constructor.name !== 'Object') {
                return v[k] && v[k].toString().toUpperCase().indexOf(element) >= 0;
              }
              else{
                if(v[k]){
                  let b = Object.keys(v[k]).some((e)=>{
                    return v[k] && v[k][e] && v[k][e].toString().toUpperCase().indexOf(element) >= 0;
                  })
                  return b;
                }
              }
            })
        );
        this.partdataAggregated = result;
        if(index === list.length - 1){
          this.partdataAggregated = [];
          this.partdataAggregated = result;
        }
      });
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

    //CheckForCache
    this.partdataService.searchCacheEntry(this.searchwords.join(",")).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
          
            if(data.body.result[0]){
              console.log("Found Cache for searchwords " + this.searchwords);
              let buttons = data.body.result[0];
              let words = JSON.parse(buttons.activeButtonsWords)
              let numbers = JSON.parse(buttons.activeButtonsNumbers)
              this.activeButtonsNumbers = numbers;
              this.activeButtonsWords = words;
            }  else
            {
              console.log("No Cache Found for searchwords " + this.searchwords);
              this.calculateActiveButtons();
            }
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


  private calculateActiveButtons() {
    this.partNameFrequencyData = [];
    let existingentry_EveryPosition: Array<PartnameFrequencyModel>;
    var replacements: any = [
      { "search": ";", "replace": " ", "undo": false },
      { "search": "Pattern", "replace": " ", "undo": false },
      { "search": "Sticker", "replace": " ", "undo": false },
      { "search": " Sheet ", "replace": " ", "undo": false },
      { "search": " Set ", "replace": " ", "undo": false },
      { "search": " of ", "replace": " ", "undo": false },
      { "search": "with ", "replace": "with_", "undo": true },
      { "search": " and ", "replace": " ", "undo": false },
      { "search": " for ", "replace": " ", "undo": false },
      { "search": "/", "replace": " ", "undo": false },
      { "search": "&", "replace": " ", "undo": false },
      { "search": " on ", "replace": " ", "undo": false },
      { "search": "Minifigure", "replace": "", "undo": false },
      { "search": "-", "replace": " ", "undo": false },
      { "search": " x", "replace": "_x", "undo": true },
      { "search": " Side", "replace": "_Side", "undo": true },
      { "search": " Hole", "replace": "_Hole", "undo": true },
      { "search": "(", "replace": " ", "undo": false },
      { "search": "#39", "replace": " ", "undo": false },
      { "search": "#40", "replace": " ", "undo": false },
      { "search": ")", "replace": " ", "undo": false },
      { "search": "#41", "replace": " ", "undo": false },
      { "search": "`", "replace": " ", "undo": false },
      { "search": "'", "replace": " ", "undo": false },
    ];
    let numberofnamesToWork = 100000;
    let numberofSuggestions = 30;
    let namecounter = 1;
    //  console.log("Calculating words of "+    this.partdataAggregated.length  + " part names. Limit " + numberofnamesToWork );
    this.partdataAggregated.forEach(part => {
      if (namecounter > numberofnamesToWork)
        return;
      let partname = part.name;
      replacements.forEach(repl => {
        partname = partname.replaceAll(repl.search, repl.replace);
      });

      const splitpartname = partname.split(/[\s,]+/);
      let wordposition = 1;

      splitpartname.forEach((word, index) => {

        if (!this.isEmpty(word) && !this.isSetnumber(word)) {

          existingentry_EveryPosition = this.partNameFrequencyData.filter(function (item) {
            if (item.word.toUpperCase() === word.toUpperCase())
              return true;
          });

          //Somewhere this word appeared already
          if (existingentry_EveryPosition.length > 0) {
            existingentry_EveryPosition.forEach((existing_entry) => {
              existing_entry.counter++;
            });
          }

          if (existingentry_EveryPosition.length < 1) {
            this.partNameFrequencyData.push({
              "wordposition": wordposition,
              "word": word,
              "counter": 1
            });
          }
          wordposition++;
        }
      });
      namecounter++;
    });
    // console.log( this.partNameFrequencyData)
    let partNameFrequencyDataWords = this.partNameFrequencyData.sort(this.sortByCount).slice(0, numberofSuggestions);
    let partNameFrequencyNumbers = this.partNameFrequencyData.sort(this.sortByCount).slice(0, 40);
    this.activeButtonsWords = [];
    this.activeButtonsNumbers = [];
    partNameFrequencyDataWords.forEach(element => {
      if (!this.searchwords.includes(element.word)) {
        replacements.forEach(repl => {
          if (repl.undo)
            element.word = element.word.replace(repl.replace, repl.search);
        });
        if (!/\d/.test(element.word))
          this.activeButtonsWords.push({
            "word": element.word,
            "counter": element.counter
          });
      }
    });
    partNameFrequencyNumbers.forEach(element => {
      if (!this.searchwords.includes(element.word)) {
        replacements.forEach(repl => {
          if (repl.undo)
            element.word = element.word.replace(repl.replace, repl.search);
        });
        if (/\d/.test(element.word))
          this.activeButtonsNumbers.push({
            "word": element.word,
            "counter": element.counter
          });
      }
    });
    this.activeButtonsNumbers = this.activeButtonsNumbers.sort((a: { word: number; }, b: { word: number; }) => a.word < b.word ? -1 : a.word > b.word ? 1 : 0);
    this.WriteButtonToCache()
  }

  private isEmpty(str) {
    return (!str || str.length === 0 );
  }

  private isSetnumber(str) {
    return /\d{3,10}/.test(str);
  }

  exists(arr, search) {
    return arr.some(row => row.includes(search));
  }

  getPartdataAggegratedByPartnumber() {
    this.partdataService.getPartdataAggegratedByPartnumber(this.searchwords.join(",")).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.partdataAggregated = data.body.result;
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

  clearsearchterm(){
    this.searchwords = ['none'];
    this.newsearchword = "";
    this.getPartdataAggegratedByPartnumber();
  }

  onSearchtermEnter(){
   this.RefreshSearch(this.newsearchword);
    this.newsearchword = "";
  }

  WriteButtonToCache(){
    let dataToStore : PartnameFrequencyCachingModel = {
      searchwords: this.searchwords.join(","),
      activeButtonsNumbers: JSON.stringify(this.activeButtonsNumbers),
      activeButtonsWords: JSON.stringify(this.activeButtonsWords)
    };

    this.partdataService.createCacheEntry(dataToStore).subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 201) {
            this.toastr.success(data.body.message);

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
}
