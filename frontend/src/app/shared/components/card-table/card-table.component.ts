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

  showProperty(cardInfo): boolean{
    return (cardInfo?.dataType?.type !== 'sumAmount' && cardInfo?.hide !== 'True');
  }

  buildTableData(cardData){
      this.cardColumns.rowData.forEach(item => {
        item["value"] = this.getProperty(item.key, cardData)

        if(item.dataType?.target){
          item['target']= this.getProperty(item.dataType?.target, cardData)
        }
    });
  }

  getProperty( propertyName, object ) {
    var parts = propertyName.split( "." ),
      length = parts.length,
      i,
      property = object || this;

    for ( i = 0; i < length; i++ ) {
      property = property[parts[i]];
    }

    return property;
  }

}
