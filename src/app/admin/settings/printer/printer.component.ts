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
  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.printerId = localStorage.getItem('clientPrinterId');
    this.usePrinter = localStorage.getItem('clientUserPrinter') === 'N' ? false : true;
  }

  save() {
    localStorage.setItem('clientPrinterId', this.printerId);
    localStorage.setItem('clientUserPrinter', this.usePrinter ? 'Y' : 'N');
    this.alertService.success();
  }

}
