import { async } from '@angular/core/testing';
import { PartnameFrequencyModel, PartnameFrequencyCachingModel } from './../../../models/partnamefrequency-model';
import { PartdataService } from './../../../services/partdata.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import {B, COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {

  public newsearchword: string;
  public partdataAggregated: any;
  public searchwords : Array<string> = ['none'];
  public combinedsearchword : string = "";
  public activeButtonsWords : any = [];
  public activeButtonsNumbers : any = [];
  public partNameFrequencyData : Array<PartnameFrequencyModel> = [];

  public selectedValue: any;
  public combinedTerms: any;
  private searchVal: any;
  termCtrl = new FormControl();

  @ViewChild('partInput') partInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  public partcolumns = [
    { title: 'Image', name: 'image_url', size: '5%', minSize: '65', datatype: { type: 'image' } },
    { title: 'Name', name: 'name', size: '20%', minSize: '50'},
    { title: 'Number', name: 'no', size: '5%', minSize: '50'},
    { title: 'used', name: 'usecount', size: '5%', minSize: '50'},
    { title: 'colors', name: 'colorvariants', size: '5%', minSize: '50'},
  ];


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  partsArray: any[] = [];
  filteredPartsArray: Observable<any[]>;


  constructor(private partdataService: PartdataService,
    private toastr: ToastrService,
   private router: Router) { }

  ngOnInit(): void {
    this.getPartdataAggegratedByPartnumber();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    let value = event.value;
    this.searchVal = input.value;
    let typedText;
    this.removeFromSearchwords("none");

    if(value.indexOf(' ') >= 0){
      typedText = value.split(" ");
    }

    if(typedText && typedText.length > 0){
      typedText.forEach(ele => {
        this.partsArray.push(ele);
      });
    }
    else{
      if ((value || '').trim()) {
        this.partsArray.push(value);
      }
    }
    this.searchwords = [];
    this.partsArray.forEach(ele => {
      this.searchwords.push(ele);
    });
    //Reset the input value
    if (input) {
      input.value = '';
    }
    this.getPartdataAggegratedByPartnumber();
  }

  selectOption(){
    this.partsArray.splice(this.partsArray.indexOf(this.searchVal), 1);
  }

  remove(fruit): void {
    const index = this.partsArray.indexOf(fruit);

    if (index >= 0) {
      this.partsArray.splice(index, 1);
      this.searchwords.splice(index, 1);
    }

    if(this.searchwords.length == 0){
      this.searchwords = ['none'];
    }

    this.getPartdataAggegratedByPartnumber()
  }

  showNextNames(clickedword: any){
    let newword = clickedword.word
    this.RefreshSearch(newword);
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
              let buttons = data.body.result[0];
              let words = JSON.parse(buttons.activeButtonsWords)
              let numbers = JSON.parse(buttons.activeButtonsNumbers)
              this.activeButtonsNumbers = numbers;
              this.activeButtonsWords = words;
              this.filterLabelTerms();
            }  else
            {
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

  exists(arr, search) {
    return arr.some(row => row.includes(search));
  }

  filterLabelTerms(){
    this.combinedTerms = [
      {
        letter : 'Numbers',
        termsList: []
      },
      {
        letter : 'Words',
        termsList: []
      }
    ];

    this.combinedTerms[0].termsList = this.activeButtonsNumbers;
    this.combinedTerms[1].termsList = this.activeButtonsWords;

    this.filteredPartsArray = this.termCtrl.valueChanges.pipe(
      startWith(''),
      map((fruit: any | null) => fruit ? this._filterGroup(fruit) : this.combinedTerms.slice()));
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.partsArray.push(event.option.viewValue);
    this.partInput.nativeElement.value = '';
    this.termCtrl.setValue(null);
  }

  private _filterGroup(value: string) {
    if (value) {
      return this.combinedTerms
        .map(group => ({letter: group.letter, termsList: this._filter(group.termsList, value)}))
        .filter(group => group.termsList.length > 0);
    }

    return this.combinedTerms;
  }

  private _filter(opt: any, value: string) {
    const filterValue = value.toLowerCase();
  
    return opt.filter(item => item.word.toLowerCase().indexOf(filterValue) === 0);
  };

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

  // selectedRowClick($event){
  //   this.selectedValue = $event;
  // }

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
      { "search": " x ", "replace": "_x_", "undo": true },
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
    let numberofSuggestions = 1000;
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

      splitpartname.forEach((word) => {

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
    let partNameFrequencyNumbers = this.partNameFrequencyData.sort(this.sortByCount).slice(0, numberofSuggestions);
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

  private RefreshSearch(newword: any) {
    this.partsArray.push(newword);
    this.searchwords.push(newword);
    this.removeFromSearchwords("none");
    this.getFilteredRestaurants(this.searchwords);
    this.combinedsearchword = this.searchwords.join(" ");
    this.getPartdataAggegratedByPartnumber();
  }

  private removeFromSearchwords(str: string) {
    const index = this.searchwords.indexOf(str, 0);
    if (index > -1) {
      this.searchwords.splice(index, 1);
    }
  }

}
