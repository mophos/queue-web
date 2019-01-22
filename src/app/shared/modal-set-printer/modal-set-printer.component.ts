import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-modal-set-printer',
  templateUrl: './modal-set-printer.component.html',
  styles: []
})
export class ModalSetPrinterComponent implements OnInit {

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content') public content: any;

  printerId: any;
  usePrinter: any;

  modalReference: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
  ) { }

  ngOnInit() { }

  open() {

    this.printerId = localStorage.getItem('clientPrinterId');
    this.usePrinter = localStorage.getItem('clientUserPrinter') === 'Y' ? true : false;

    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
    });

    this.modalReference.result.then((result) => { });

  }

  dismiss() {
    this.modalReference.close();
  }

  save() {
    localStorage.setItem('clientPrinterId', this.printerId);
    localStorage.setItem('clientUserPrinter', this.usePrinter ? 'Y' : 'N');
    this.alertService.success();
    this.onSave.emit({ printerId: this.printerId, usePrinter: this.usePrinter });
    this.modalReference.close();
  }


}
