import { Component, OnInit, ViewChild, NgZone, Inject } from '@angular/core';
import { PriorityService } from 'src/app/shared/priority.service';
import { AlertService } from 'src/app/shared/alert.service';
import { QueueService } from 'src/app/shared/queue.service';
import * as mqttClient from '../../../vendor/mqtt';
import { MqttClient } from 'mqtt';
import * as Random from 'random-js';
import { default as swal, SweetAlertType, SweetAlertOptions } from 'sweetalert2';

import * as moment from 'moment';
import { ServicePointService } from 'src/app/shared/service-point.service';
import { CountdownComponent } from 'ngx-countdown';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModalSetPrinterComponent } from 'src/app/shared/modal-set-printer/modal-set-printer.component';
import { ModalSelectPriorityComponent } from 'src/app/shared/modal-select-priority/modal-select-priority.component';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styles: []
})
export class VisitComponent implements OnInit {

  jwtHelper = new JwtHelperService();
  globalTopic: string = null;

  priorities: any = [];
  visit: any = [];
  visitHistory: any = [];

  total = 0;
  totalHistory = 0;
  pageSize = 10;
  maxSizePage = 5;
  currentPage = 1;
  offset = 0;
  servicePointCode: any = '';
  servicePointId: any;
  servicePoints: any = [];

  isOffline = false;

  client: MqttClient;

  notifyUser = null;
  notifyPassword = null;
  query: any = '';

  selectedVisit: any;
  patientName: any;

  isSearch = false;

  notifyUrl: string;

  @ViewChild(CountdownComponent) counter: CountdownComponent;
  @ViewChild('mdlSetPrinter') mdlSetPrinter: ModalSetPrinterComponent;
  @ViewChild('mdlSelectPriority') mdlSelectPriority: ModalSelectPriorityComponent;

  constructor(
    private priorityService: PriorityService,
    private queueService: QueueService,
    private alertService: AlertService,
    private servicePointService: ServicePointService,
    private zone: NgZone,
    @Inject('API_URL') private apiUrl: string,
  ) {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);

    this.notifyUrl = `ws://${decodedToken.NOTIFY_SERVER}:${+decodedToken.NOTIFY_PORT}`;
    this.notifyUser = decodedToken.NOTIFY_USER;
    this.notifyPassword = decodedToken.NOTIFY_PASSWORD;

    this.globalTopic = decodedToken.QUEUE_CENTER_TOPIC;
  }

  ngOnInit() {
    this.getServicePoints();
    this.connectWebSocket();
  }


  onSelectedPriority(priority: any) {
    this.doRegister(priority.priority_id, this.selectedVisit);
  }

  openPriority(visit: any) {
    this.patientName = `${visit.first_name} ${visit.last_name} (${visit.hn})`;
    this.selectedVisit = visit;
    this.mdlSelectPriority.open();
  }

  onSelectedPrinter(event) {
    if (event) {
      console.log(event);
    }
  }

  openPrinter() {
    this.mdlSetPrinter.open();
  }

  refresh() {
    this.getVisit();
  }


  doSearch(event: any) {
    if (this.query) {
      if (event.keyCode === 13) {
        this.isSearch = true;
        this.servicePointCode = '';
        this.getVisit();
      }
    }
  }

  doSearchHistory(event: any) {
    if (this.query) {
      if (event.keyCode === 13) {
        this.isSearch = true;
        // this.servicePointId = '';
        this.getHistory();
      }
    }
  }

  async printQueue(queueId: any) {
    const usePrinter = localStorage.getItem('clientUserPrinter');
    const printerId = localStorage.getItem('clientPrinterId');
    const printSmallQueue = localStorage.getItem('printSmallQueue') || 'N';

    if (usePrinter === 'Y') {
      const topic = `/printer/${printerId}`;
      try {
        const rs: any = await this.queueService.printQueueGateway(queueId, topic, printSmallQueue);
        if (rs.statusCode === 200) {
          // success
        } else {
          this.alertService.error('ไม่สามารถพิมพ์บัตรคิวได้');
        }
      } catch (error) {
        console.log(error);
        this.alertService.error('ไม่สามารถพิมพ์บัตรคิวได้');
      }
      //
    } else {
      window.open(`${this.apiUrl}/print/queue?queueId=${queueId}`, '_blank');
    }
  }

  connectWebSocket() {
    const rnd = new Random();
    const username = sessionStorage.getItem('username');
    const strRnd = rnd.integer(1111111111, 9999999999);
    const clientId = `${username}-${strRnd}`;

    this.client = mqttClient.connect(this.notifyUrl, {
      clientId: clientId,
      username: this.notifyUser,
      password: this.notifyPassword
    });


    const that = this;

    this.client.on('connect', () => {
      console.log('Connected!');
      that.zone.run(() => {
        that.isOffline = false;
      });

      that.client.subscribe(this.globalTopic, (error) => {
        if (error) {
          console.log('Subscibe error!!');
          that.zone.run(() => {
            that.isOffline = true;
            try {
              that.counter.restart();
            } catch (error) {
              console.log(error);
            }
          });
        }
      });

    });

    this.client.on('message', (topic, payload) => {
      this.getVisit();
      this.getHistory();
    });

    this.client.on('close', () => {
      console.log('Close');
    });

    this.client.on('error', (error) => {
      console.log('Error');
      that.zone.run(() => {
        that.isOffline = true;
        that.counter.restart();
      });
    });

    this.client.on('offline', () => {
      console.log('Offline');
      that.zone.run(() => {
        that.isOffline = true;
        try {
          that.counter.restart();
        } catch (error) {
          console.log(error);
        }
      });
    })
  }

  async getServicePoints() {
    var _servicePoints = sessionStorage.getItem('servicePoints');
    var jsonDecoded = JSON.parse(_servicePoints);

    this.servicePoints = jsonDecoded;
    if (this.servicePoints) {
      this.servicePointCode = this.servicePoints[0].local_code;
      this.servicePointId = this.servicePoints[0].service_point_id;
    }

    await this.getVisit();
    await this.getHistory();
  }

  changeServicePoints(event: any) {
    this.servicePointCode = event.target.value;
    this.query = '';
    this.getVisit();
  }

  changeServicePointsHistory(event: any) {
    this.servicePointId = event.target.value;
    this.query = '';
    this.getHistory();
  }

  async getVisit() {
    try {
      const rs: any = await this.queueService.visitList(this.servicePointCode, this.query, this.pageSize, this.offset);

      if (rs.statusCode === 200) {
        this.visit = rs.results;
        this.total = rs.total;

        if (this.isSearch) {
          if (this.visit.length === 1) {
            this.openPriority(this.visit[0]);
          }
        }
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

  async getHistory() {
    try {
      const rs: any = await this.queueService.visitHistoryList(this.servicePointId, this.query, this.pageSize, this.offset);

      if (rs.statusCode === 200) {
        this.visitHistory = rs.results;
        this.totalHistory = rs.total;

        if (this.isSearch) {
          if (this.visit.length === 1) {
            this.openPriority(this.visit[0])
          }
        }
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

  onPageChange(event: any) {
    console.log(event);
    const _currentPage = +event;
    var _offset = 0;
    if (_currentPage > 1) {
      _offset = (_currentPage - 1) * this.pageSize;
    }

    this.offset = _offset;
    this.getVisit();
  }

  async doRegister(prorityId: any, visit: any) {
    try {

      var person: any = {};
      person.hn = visit.hn;
      person.vn = visit.vn;
      person.clinicCode = visit.clinic_code;
      person.priorityId = prorityId;
      person.dateServ = moment(visit.date_serv).format('YYYY-MM-DD');
      person.timeServ = visit.time_serv;
      person.hisQueue = visit.his_queue || '';
      person.firstName = visit.first_name;
      person.lastName = visit.last_name;
      person.title = visit.title;
      person.birthDate = moment(visit.birthdate).isValid() ? moment(visit.birthdate).format('YYYY-MM-DD') : null;
      person.sex = visit.sex;

      const rs: any = await this.queueService.register(person);

      if (rs.statusCode === 200) {

        const queueId: any = rs.queueId;
        const confirm = await this.alertService.confirm('ต้องการพิมพ์บัตรคิว หรือไม่?');
        if (confirm) {
          this.printQueue(queueId);
        }

        this.isSearch = false;
        this.query = '';
        this.getVisit();
        this.selectedVisit = null;

      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

  async printAgain(queueId) {
    const confirm = await this.alertService.confirm('ต้องการพิมพ์บัตรคิว หรือไม่?');
    if (confirm) {
      console.log(confirm);

      this.printQueue(queueId);
    }
  }
}
