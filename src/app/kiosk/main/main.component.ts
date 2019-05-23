import { KioskService } from './../../shared/kiosk.service';
import { AlertService } from 'src/app/shared/alert.service';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute } from '@angular/router';
import * as mqttClient from '../../../vendor/mqtt';
import { MqttClient } from 'mqtt';
import * as Random from 'random-js';
import { CountdownComponent } from 'ngx-countdown';
import * as moment from 'moment';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  hn: any;
  tabServicePoint = false;
  btnSelectServicePoint = false;
  tabProfile = true;
  servicePointList = [];
  token: any;
  hospname: any;
  isOffline = false;
  client: MqttClient;
  notifyUser = null;
  notifyPassword = null;
  notifyUrl: string;
  kioskId: any;
  isPrinting = false;

  cardCid: any;
  cardFullName: any;
  cardBirthDate: any;
  his: any;
  hisHn: any;
  hisFullName: any;
  hisBirthDate: any;

  rightName: any;
  rightStartDate: any;
  rightHospital: any;
  @ViewChild(CountdownComponent) counter: CountdownComponent;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private kioskService: KioskService,
    private zone: NgZone) {
    this.route.queryParams
      .subscribe(params => {
        this.token = params.token || null;
      });
  }

  ngOnInit() {
    try {
      this.token = this.token || sessionStorage.getItem('token');
      if (this.token) {
        const decodedToken = this.jwtHelper.decodeToken(this.token);
        this.notifyUrl = `ws://${decodedToken.NOTIFY_SERVER}:${+decodedToken.NOTIFY_PORT}`;
        this.notifyUser = decodedToken.NOTIFY_USER;
        this.notifyPassword = decodedToken.NOTIFY_PASSWORD;
        this.kioskId = localStorage.getItem('kioskId') || '1';

        this.initialSocket();
      } else {
        this.alertService.error('ไม่พบ TOKEN');
      }

    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }
  async initialSocket() {
    // connect mqtt
    await this.connectWebSocket();
    await this.getInfoHospital();
    await this.getServicePoint();
  }

  connectWebSocket() {
    const rnd = new Random();
    const username = sessionStorage.getItem('username');
    const strRnd = rnd.integer(1111111111, 9999999999);
    const clientId = `${username}-${strRnd}`;

    try {
      this.client = mqttClient.connect(this.notifyUrl, {
        clientId: clientId,
        username: this.notifyUser,
        password: this.notifyPassword
      });
    } catch (error) {
      console.log(error);
    }

    const topic = `kiosk/${this.kioskId}`;

    const that = this;

    this.client.on('message', async (topic, payload) => {
      try {
        const _payload = JSON.parse(payload.toString());
        if (_payload.ok) {
          await this.setDataFromCard(_payload.results);
        } else {
          this.clearData();
        }
      } catch (error) {
        console.log(error);
      }

    });

    this.client.on('connect', () => {
      console.log(`Connected!`);
      that.zone.run(() => {
        that.isOffline = false;
      });

      that.client.subscribe(topic, { qos: 0 }, (error) => {
        if (error) {
          that.zone.run(() => {
            that.isOffline = true;
            try {
              that.counter.restart();
            } catch (error) {
              console.log(error);
            }
          });
        } else {
          console.log(`subscribe ${topic}`);
        }
      });
    });

    this.client.on('close', () => {
      console.log('MQTT Conection Close');
    });

    this.client.on('error', (error) => {
      console.log('MQTT Error');
      that.zone.run(() => {
        that.isOffline = true;
        that.counter.restart();
      });
    });

    this.client.on('offline', () => {
      console.log('MQTT Offline');
      that.zone.run(() => {
        that.isOffline = true;
        try {
          that.counter.restart();
        } catch (error) {
          console.log(error);
        }
      });
    });
  }

  async getInfoHospital() {
    try {
      const rs: any = await this.kioskService.getInfo(this.token);
      this.hospname = rs.info.hosname;
    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }

  async getServicePoint() {
    try {
      const rs: any = await this.kioskService.getServicePoint(this.token);
      if (rs.statusCode === 200) {
        this.servicePointList = rs.results;
      }
    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }

  async getPatient() {
    try {
      if (this.cardCid) {
        const rs: any = await this.kioskService.getPatient(this.token, { 'cid': this.cardCid });
        if (rs.statusCode === 200) {
          this.setDataFromHIS(rs.results);
        }
      }
    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }


  onSelectServicePointList() {
    this.tabServicePoint = true;
    this.tabProfile = false;
  }

  cancel() {
    this.btnSelectServicePoint = true;
    this.tabServicePoint = false;
    this.tabProfile = true;
  }

  async setDataFromCard(data) {
    this.cardCid = data.cid;
    this.cardFullName = data.fullname;
    this.cardBirthDate = data.birthDate;
    if (this.cardCid) {
      await this.getPatient();
      await this.getNhso(this.cardCid);

    } else {
      this.alertService.error('บัตรมีปัญหา กรุณาเสียบใหม่อีกครั้ง', null, 1000);
    }

  }

  async setDataFromHIS(data) {
    this.his = data;
    this.hisHn = data.hn;
    this.hisFullName = `${data.title}${data.firstName} ${data.lastName}`;
    this.hisBirthDate = data.birthDate;
    if (this.his) {
      await this.setTab();
    }
  }

  setTab() {
    if (+this.servicePointList.length <= 3) {
      this.btnSelectServicePoint = false;
      this.tabServicePoint = true;
    } else {
      this.btnSelectServicePoint = true;
    }
  }

  clearData() {
    this.cardCid = '';
    this.cardFullName = '';
    this.cardBirthDate = '';

    this.hisBirthDate = '';
    this.hisFullName = '';
    this.hisHn = '';

    this.rightName = '';
    this.rightStartDate = '';
    this.rightHospital = '';

    this.tabProfile = true;
    this.btnSelectServicePoint = false;
    this.tabServicePoint = false;
  }

  async print(queueId) {
    const printerId = localStorage.getItem('clientPrinterId');
    const printSmallQueue = localStorage.getItem('printSmallQueue') || 'N';
    const topicPrint = '/printer/' + printerId;

    const data = {
      queueId: queueId,
      topic: topicPrint
    };
    try {
      const rs: any = await this.kioskService.print(this.token, data);
      if (rs.statusCode === 200) {
        this.clearData();
      }
      this.isPrinting = false;
    } catch (error) {
      console.log(error);
      this.isPrinting = false;
      alert('ไม่สามารถพิมพ์บัตรคิวได้');
    }
  }

  async register(servicePoint) {
    this.isPrinting = true;
    const priorityId = localStorage.getItem('kiosDefaultPriority') || '1';
    const data = {
      hn: this.his.hn,
      vn: 'K' + moment().format('x'),
      clinicCode: servicePoint.local_code,
      priorityId: priorityId,
      dateServ: moment().format('YYYY-MM-DD'),
      timeServ: moment().format('HHmm'),
      hisQueue: '',
      firstName: this.his.firstName,
      lastName: this.his.lastName,
      title: this.his.title,
      birthDate: this.his.engBirthDate,
      sex: this.his.sex
    };
    try {
      const rs: any = await this.kioskService.register(this.token, data);
      if (rs.statusCode === 200) {
        if (rs.queueId) {
          await this.print(rs.queueId);
        }
      } else {
        this.alertService.error('ไม่สามารถลงทะเบียนได้');
        this.isPrinting = false;
      }
    } catch (error) {
      this.isPrinting = false;
      console.log(error);
    }
  }

  async getNhso(cid) {
    const nhsoToken = localStorage.getItem('nhsoToken');
    const nhsoCid = localStorage.getItem('nhsoCid');
    const data = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tok=\"http://tokenws.ucws.nhso.go.th/\">\n   <soapenv:Header/>\n   <soapenv:Body>\n      <tok:searchCurrentByPID>\n         <!--Optional:-->\n         <user_person_id>${nhsoCid}</user_person_id>\n         <!--Optional:-->\n         <smctoken>${nhsoToken}</smctoken>\n         <!--Optional:-->\n         <person_id>${cid}</person_id>\n      </tok:searchCurrentByPID>\n   </soapenv:Body>\n</soapenv:Envelope>`;
    try {
      const nhso: any = {};
      const rs: any = await this.kioskService.getNhso(this.token, data);
      rs.results.forEach(v => {
        if (v.name === 'hmain') { nhso.hmain = v.elements[0].text; }
        if (v.name === 'hmain_name') { nhso.hmain_name = v.elements[0].text; }
        if (v.name === 'maininscl') { nhso.maininscl = v.elements[0].text; }
        if (v.name === 'maininscl_main') { nhso.maininscl_main = v.elements[0].text; }
        if (v.name === 'maininscl_name') { nhso.maininscl_name = v.elements[0].text; }
        if (v.name === 'startdate') { nhso.startdate = v.elements[0].text; }
        if (v.name === 'startdate_sss') { nhso.startdate_sss = v.elements[0].text; }
      });
      this.rightName = nhso.maininscl ? `${nhso.maininscl_name} (${nhso.maininscl})` : '-';
      this.rightHospital = nhso.hmain ? `${nhso.hmain_name} (${nhso.hmain})` : '-';
      this.rightStartDate = nhso.startdate ? `${moment(nhso.startdate, 'YYYYMMDD').format('DD MMM ')} ${moment(nhso.startdate, 'YYYYMMDD').get('year')}` : '-';
    } catch (error) {
      console.log(error);
      this.alertService.error(error.message);
    }

  }
}
