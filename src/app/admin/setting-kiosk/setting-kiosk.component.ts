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
  urlGET: any;
  urlPOST: any;
  isGET = false;
  isPOST = false;

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
    this.urlGET = localStorage.getItem('urlSendVisitGet') ? localStorage.getItem('urlSendVisitGet') : null;
    this.urlPOST = localStorage.getItem('urlSendVisitPost') ? localStorage.getItem('urlSendVisitPost') : null;
    this.isGET = localStorage.getItem('isSendAPIGET') === 'Y' ? true : false;
    this.isPOST = localStorage.getItem('isSendAPIPOST') === 'Y' ? true : false;
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
    if (this.urlGET) {
      localStorage.setItem('urlSendVisitGet', this.urlGET);
    }
    if (this.urlPOST) {
      localStorage.setItem('urlSendVisitPost', this.urlPOST);
    }
    localStorage.setItem('isSendAPIGET', Boolean(this.isGET) ? 'Y' : 'N');
    localStorage.setItem('isSendAPIPOST', Boolean(this.isPOST) ? 'Y' : 'N');

    this.alertService.success();
  }
}
