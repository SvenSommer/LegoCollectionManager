import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Input('size') size = 'lg';
  @Output() public closeEvent: EventEmitter<any> = new EventEmitter();


  ngOnInit(): void {
  }

  open() {
    this.display();
  }

  display() {
    this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title', size: this.size }).result.then((result) => {
    }, (reason) => {
    });
  }

  close() {
    this.modalService.dismissAll();
    if (this.closeEvent) {
      this.closeEvent.emit();
    }
  }

}
