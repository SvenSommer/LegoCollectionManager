import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartdataService } from '../services/partdata.service';

@Component({
  selector: 'app-partdata',
  templateUrl: './partdata.component.html',
  styleUrls: ['./partdata.component.css']
})
export class PartdataComponent implements OnInit {

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

    public countcolumns = [
      { title: 'wordposition', name: 'wordposition', size: '5%', minSize: '50'},
      { title: 'word', name: 'word', size: '5%', minSize: '50'},
      { title: 'counter', name: 'counter', size: '5%', minSize: '50'},
    ] 

    public countdata: any;

  ngOnInit(): void {
    this.bindData();
    
  }

  countNames() {
    this.countdata = [
      {
        "wordposition": 1
        ,"word" : "Train"
        ,"counter" : 0
      }
    ]
    let existingentry;
    var blacklist: Array<string> = ['x','-']
    let numberofnames = 100
    let namecounter = 1;
    this.partdata.forEach(part => {
      if(namecounter > numberofnames )
        return;
     // console.log(wordcounter + ". Partname: ", part.partinfo.name )
      const splitpartname = part.partinfo.name.split(/[\s,]+/)
      let wordposition = 1
      
      splitpartname.forEach(word => {
          if(!blacklist.includes(word)) {

          existingentry = this.countdata.filter(function(item){
            if(item.wordposition === wordposition && item.word === word)
              return true;
          })

          if(existingentry.length > 0) {
            existingentry[0].counter++
            console.log(word + "' appeared " + existingentry[0].counter + " times at postion " + wordposition)
          }else{
            this.countdata.push({"wordposition": wordposition
            ,"word" : word
            ,"counter" : 1})
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
