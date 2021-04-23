import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartnameFrequencyModel } from '../../models/partnamefrequency-model';
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

    public countcolumns = [
      { title: 'wordposition', name: 'wordposition', size: '5%', minSize: '50'},
      { title: 'word', name: 'word', size: '5%', minSize: '50'},
      { title: 'counter', name: 'counter', size: '5%', minSize: '50'},
      { title: 'overallcounter', name: 'overallcounter', size: '5%', minSize: '50'},
    ] 

    public countdata: Array<PartnameFrequencyModel>;

  ngOnInit(): void {
    this.bindData();
    
  }

  countNames() {
    this.countdata = [
      {
        "wordposition": 1
        ,"word" : "Train"
        ,"counter" : 0
        ,"overallcounter": 0
      }
    ]

    let existingentry_Wordposition;
    let existingentry_EveryPosition;
    var blacklist: Array<string> = ['x','-','with', 'and', 'for', '/','on','Minifigure','Utensil']
    var replacements:any = [
      {"search":" x ", "replace":"_x_"},
      {"search":" Side", "replace":"_Side"},
      {"search":" Hole", "replace":"_Hole"},
    ]
    let numberofnames = 100000
    let namecounter = 1;
    this.partdata.forEach(part => {
      if(namecounter > numberofnames )
        return;
     // console.log(wordcounter + ". Partname: ", part.partinfo.name )
      let partname = part.partinfo.name;
      replacements.forEach(repl => {
         partname = partname.replaceAll(repl.search, repl.replace)   
      });
      
      const splitpartname = partname.split(/[\s,]+/)
      let wordposition = 1
      
      splitpartname.forEach(word => {
          if(!blacklist.includes(word)) {
            existingentry_Wordposition = this.countdata.filter(function(item){
              if(item.wordposition === wordposition && item.word === word)
                return true;
            });

            existingentry_EveryPosition = this.countdata.filter(function(item){
              if(item.word === word)
                return true;
            });

            if(existingentry_Wordposition.length > 0) {
              existingentry_Wordposition[0].counter++
              console.log(word + "' appeared " + existingentry_Wordposition[0].counter + " times at postion " + wordposition)
            } 
            if(existingentry_EveryPosition.length > 0) {
              existingentry_EveryPosition[0].overallcounter++
              console.log(word + "' appeared " + existingentry_EveryPosition[0].counter + " times independent from the position.")
            }

            if(existingentry_Wordposition.length < 1 && existingentry_EveryPosition.length < 1) {
                this.countdata.push({"wordposition": wordposition
                ,"word" : word
                ,"counter" : 1
                ,"overallcounter": 1});
              // console.log(wordposition + ". word: '"+ word + "' is new.")
            }
          wordposition++;
          }
      });
      namecounter++;
    });

    this.countdata = this.countdata.sort(function mysortfunction(a, b) {

      var o1 = a[0].toLowerCase();
      var o2 = b[0].toLowerCase();
    
      var p1 = a[2].toLowerCase();
      var p2 = b[2].toLowerCase();
    
      if (o1 < o2) return -1;
      if (o1 > o2) return 1;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
      return 0;
    })
  }

  exists(arr, search) {
    return arr.some(row => row.includes(search));
  }

  bindData() {
    this.partdataService.getPartdata().subscribe(
      (data) => {
        if (data) {
          if (data.body && data.body.code == 200) {
            this.partdata = data.body.result;

            this.countNames();
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
