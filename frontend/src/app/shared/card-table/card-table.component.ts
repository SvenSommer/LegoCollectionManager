import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.css']
})
export class CardTableComponent implements OnInit {
  @Input() cardColumns: any;
  @Input() cardData: any;

  purchaseInfo: any;

  constructor() { }

  ngOnInit(): void {
    this.buildTableData(this.cardData);
  }

  public onExternalClick(origin_url) {
    if(origin_url)
    {
      let url: string = '';
      if (!/^http[s]?:\/\//.test(origin_url)) {
        url += 'http://';
      }

      url += origin_url;
      window.open(url, '_blank');
    }
  }


  buildTableData(collectionDetails){
    let keys = Object.keys(collectionDetails);
    let collectionkeys = Object.keys(collectionDetails.collectioninfo);
    this.cardColumns.rowData.forEach(item => {
      let col;
      if(item.key.indexOf('.') !== -1){
        const a = item.key.split('.');
        col = a.length > 1 ? a[1] : a[0];
      }
      else{
        col = item.key;
      }
      keys.forEach(key => {
        if(key == col){
          item['value'] = collectionDetails[key];
        }
      });
      collectionkeys.forEach(key => {
        if(key == col){
          item['value'] = collectionDetails.collectioninfo[key];
        }
        if(item.dataType?.target){
          item['target']= collectionDetails.collectioninfo[item.dataType?.target];
        }
        if(key == col && col == 'cost'){
          item['value'] = collectionDetails.collectioninfo.cost + ' &#8364; ( Incl. porto '  + collectionDetails.collectioninfo.porto + '&#8364; )' + '<br>' +
                        collectionDetails.collectioninfo.cost_per_kilo + ' &#8364;';
        }
      });
    });
  }

}
