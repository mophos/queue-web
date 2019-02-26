import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-warning-printer',
  templateUrl: './alert-warning-printer.component.html',
  styles: []
})
export class AlertWarningPrinterComponent implements OnInit {
  warningPrinter = false;
  constructor() {
    this.warningPrinter = localStorage.getItem('clientPrinterId') === '' || !localStorage.getItem('clientPrinterId') ? true : false;
    if (this.warningPrinter) {
      this.warningPrinter = sessionStorage.getItem('warning_printer') === 'false' ? false : true;
    }
  }

  ngOnInit() {
  }

  close() {
    this.warningPrinter = false;
    sessionStorage.setItem('warning_printer', 'false');

  }
}
