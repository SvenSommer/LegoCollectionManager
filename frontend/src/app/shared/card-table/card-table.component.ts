import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.css']
})
export class CardTableComponent implements OnInit {
  @Input() cardData: any;
  @Input() collectionDetails: any;

  constructor() { }

  ngOnInit(): void {
  }

  public onExternalClick(data) {
    if(data && data.origin_url)
    {
      let url: string = '';
      if (!/^http[s]?:\/\//.test(data.origin_url)) {
        url += 'http://';
      }

      url += data.origin_url;
      window.open(url, '_blank');
    }
  }

}
