import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() public showProgressbar: boolean;
  @Input() public showIcon: boolean;
  @Input() public title: string;
  @Input() public data: any

  constructor() { }

  ngOnInit(): void {
  }

}
