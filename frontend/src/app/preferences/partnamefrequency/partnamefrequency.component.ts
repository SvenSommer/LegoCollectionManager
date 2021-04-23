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

    public partdata: any;
    public partNameFrequencyData : any;

    public countcolumns = [
      { title: 'wordposition', name: 'wordposition', size: '5%', minSize: '50'},
      { title: 'word', name: 'word', size: '5%', minSize: '50'},
      { title: 'nearWords', name: 'nearWords', size: '5%', minSize: '50'},
      { title: 'counter', name: 'counter', size: '5%', minSize: '50'},
      { title: 'overallcounter', name: 'overallcounter', size: '5%', minSize: '50'},
    ] 

    public countdata: Array<PartnameFrequencyModel> = [];

  ngOnInit(): void {
    this.bindData();
    this.getStoredPartnameFrequency()
  }

  getStoredPartnameFrequency() {
    this.partdataService.getStoredPartnameFrequency().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.partNameFrequencyData = data.body.result;
            console.log(this.partNameFrequencyData)
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

  showNextNames(clickedword: PartnameFrequencyExportModel){
    let nearwords : NearWord = JSON.parse(clickedword.nearwords).filter(item => item.c > 5).sort(this.compare);
    nearwords.forEach(word => {
      console.log(word.w)
    });
  }

  compare( a, b ) {
    if ( a.count > b.count ){
      return -1;
    }
    if ( a.count < b.count ){
      return 1;
    }
    return 0;
  }

  countNames() {
    let existingentry_Wordposition : Array<PartnameFrequencyModel>;
    let existingentry_EveryPosition : Array<PartnameFrequencyModel>;
    var blacklist: Array<string> = ['x','-','with', 'and', 'for', '/','on','Minifigure','Utensil', '&','(',')']
    var replacements:any = [
      {"search":";", "replace":""},
      {"search":"Pattern", "replace":""},
      {"search":"Sticker", "replace":""},
      {"search":" Sheet ", "replace":""},
      {"search":" Set ", "replace":""},
      {"search":" of ", "replace":""},
      {"search":" with ", "replace":""},
      {"search":" and ", "replace":""},
      {"search":" for ", "replace":""},
      {"search":"/", "replace":""},
      {"search":"&", "replace":""},
      {"search":" on ", "replace":""},
      {"search":"Minifigure", "replace":""},
      {"search":"-", "replace":""},
      {"search":" x ", "replace":"_x_"},
      {"search":" Side", "replace":"_Side"},
      {"search":" Hole", "replace":"_Hole"},
      {"search":"(", "replace":""},
      {"search":")", "replace":""},
      {"search":"`", "replace":""},
      {"search":"''", "replace":""},
    ]
    let numberofnamesToWork = 100000
    let namecounter = 1;
    this.partdata.forEach(part => {
      if(namecounter > numberofnamesToWork )
        return;
      console.log(namecounter + ". Partname: ", part.name )
      let partname = part.name;
      replacements.forEach(repl => {
         partname = partname.replaceAll(repl.search, repl.replace)   
      });
      
      const splitpartname = partname.split(/[\s,]+/)
      let wordposition = 1
      
      splitpartname.forEach((word, index) => {
        
          if(!blacklist.includes(word)) {
            existingentry_Wordposition = this.countdata.filter(function(item){
              if(item.wordposition === wordposition && item.word.toUpperCase() === word.toUpperCase())
                return true;
            });

            existingentry_EveryPosition = this.countdata.filter(function(item){
              if(item.word.toUpperCase() === word.toUpperCase())
                return true;
            });

            //In this exact wordposition the word appeard already
            if(existingentry_Wordposition.length > 0) {
              existingentry_Wordposition[0].counter++
            } 

            //Somewhere this word appeared already
            if(existingentry_EveryPosition.length > 0) {
              existingentry_EveryPosition.forEach((find) => {
                find.overallcounter++
                this.getNearWords(index, splitpartname).forEach(nearword => {
                  let existing_nearword = find.nearwords.filter(function(item){
                    if(item.w === nearword)
                      return true;
                  })
                  if(existing_nearword.length > 0){
                    existing_nearword[0].c++
                  }else{
                    find.nearwords.push(new NearWord(nearword, 1));
                  }
                });
              })
             
            }

            if(existingentry_EveryPosition.length < 1 || existingentry_Wordposition.length < 1) {
                let nearwords = this.getNearWords(index, splitpartname);
                let nearwordcount : Array<NearWord> = [];
                nearwords.forEach((nword) => {
                  nearwordcount.push(new NearWord(nword, 1));
                })

                this.countdata.push({"wordposition": wordposition
                ,"word" : word.charAt(0).toUpperCase() + word.slice(1)
                ,"nearwords" : nearwordcount
                ,"counter" : 1
                ,"overallcounter": 1});
              // console.log(wordposition + ". word: '"+ word + "' is new.")
            }
          wordposition++;
          }
      });
      namecounter++;
    });

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

  exportData(){
    this.countdata.forEach(async entry => {
     let  newentry : PartnameFrequencyExportModel  = {
        "wordposition": entry.wordposition
        ,"word" : entry.word
        ,"nearwords" :  JSON.stringify(entry.nearwords)
        ,"counter" : entry.counter
        ,"overallcounter": entry.overallcounter
      }
      await this.delay(300);
      this.partdataService.savePartnameFrequency(newentry).subscribe(
        (data) => {
          if (data) {
            if (data.body && data.body.code == 201) {
            }
            else {
              console.log("error code: " + data.body.message)
            }
          }
        }
      );
    })
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  exists(arr, search) {
    return arr.some(row => row.includes(search));
  }

  bindData() {
    this.partdataService.getPartdataAggegratedByPartnumber().subscribe(
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
