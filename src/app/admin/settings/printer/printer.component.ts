import { AlertService } from 'src/app/shared/alert.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styles: []
})
export class PrinterComponent implements OnInit {

  printerId: any;
  usePrinter: any;
  printSmallQueue: any;
  printPendingQueue: any;

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.printerId = localStorage.getItem('clientPrinterId');
    this.usePrinter = localStorage.getItem('clientUserPrinter') === 'Y' ? true : false;
    this.printSmallQueue = localStorage.getItem('printSmallQueue') === 'Y' ? true : false;
    this.printPendingQueue = localStorage.getItem('printPendingQueue') === 'N' ? true : false;
  }

  save() {
    localStorage.setItem('clientPrinterId', this.printerId);
    localStorage.setItem('clientUserPrinter', this.usePrinter ? 'Y' : 'N');
    localStorage.setItem('printSmallQueue', this.printSmallQueue ? 'Y' : 'N');
    localStorage.setItem('printPendingQueue', this.printPendingQueue ? 'N' : 'Y');

    this.alertService.success();
  }

}
