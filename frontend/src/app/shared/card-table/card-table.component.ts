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

}
