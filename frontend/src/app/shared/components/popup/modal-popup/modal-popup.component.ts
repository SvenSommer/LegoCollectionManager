import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  @ViewChild('mymodal') modal: any
  @Input('title') title = '';

  ngOnInit(): void {
  }

  open() {
    this.display();
  }

  display() {
    this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
    }, (reason) => {
    });
  }

  close() {
    this.modalService.dismissAll();
  }

}
