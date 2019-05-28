import { AlertService } from 'src/app/shared/alert.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-kiosk',
  templateUrl: './setting-kiosk.component.html',
  styles: []
})
export class SettingKioskComponent implements OnInit {

  nhsoCid: any;
  nhsoToken: any;
  kioskId: any;
  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.nhsoCid = localStorage.getItem('nhsoCid') ? localStorage.getItem('nhsoCid') : null;
    this.nhsoToken = localStorage.getItem('nhsoToken') ? localStorage.getItem('nhsoToken') : null;
    this.kioskId = localStorage.getItem('kioskId') ? localStorage.getItem('kioskId') : null;
  }

  save() {
    if (this.nhsoCid) {
      localStorage.setItem('nhsoCid', this.nhsoCid);
    }
    if (this.nhsoToken) {
      localStorage.setItem('nhsoToken', this.nhsoToken);
    }
    if (this.kioskId) {
      localStorage.setItem('kioskId', this.kioskId);
    }
    this.alertService.success();
  }
}
