import { Component, OnInit, ViewChild, NgZone, Inject } from '@angular/core';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import * as moment from 'moment';
import * as mqttClient from '../../../vendor/mqtt';
import { MqttClient } from 'mqtt';
import * as Random from 'random-js';
import { CountdownComponent } from 'ngx-countdown';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-queue-center-patient',
  templateUrl: './queue-center-patient.component.html',
  styles: [
    `
    .main-panel {
        transition: width 0.25s ease, margin 0.25s ease;
        width: 100%;
        min-height: calc(100vh - 70px);
        display: flex;
        flex-direction: column;
    }
    `
  ]
})
export class QueueCenterPatientComponent implements OnInit {

  items: any = [];
  currentTime: Date = new Date();
  lastupdateTime: Date = new Date();

  currentDate: string = `${moment().locale('th').format('DD MMMM')} ${moment().get('year') + 543}`;
  public message: string;

  isOffline = false;

  client: MqttClient;
  jwtHelper = new JwtHelperService();
  queueCenterTopic = null;
  notifyUser = null;
  notifyPassword = null;
  notifyUrl: string;

  @ViewChild(CountdownComponent) counter: CountdownComponent;

  constructor(
    private queueService: QueueService,
    private alertService: AlertService,
    private zone: NgZone,
    private router: Router
  ) {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.queueCenterTopic = decodedToken.QUEUE_CENTER_TOPIC;

    this.notifyUrl = `ws://${decodedToken.NOTIFY_SERVER}:${+decodedToken.NOTIFY_PORT}`;
    this.notifyUser = decodedToken.NOTIFY_USER;
    this.notifyPassword = decodedToken.NOTIFY_PASSWORD;

    setInterval(() => {
      this.currentTime = new Date();
    }, 1);
  }


  public unsafePublish(topic: string, message: string): void {
    try {
      this.client.end(true);
    } catch (error) {
      console.log(error);
    }
  }

  public ngOnDestroy() {
    try {
      this.client.end(true);
    } catch (error) {
      console.log(error);
    }
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  connectWebSocket() {
    const rnd = new Random();
    const strRnd = rnd.integer(1111111111, 9999999999);
    const clientId = `qu4-${strRnd}`;
    this.client = mqttClient.connect(this.notifyUrl, {
      clientId: clientId,
      username: this.notifyUser,
      password: this.notifyPassword
    });

    const that = this;

    this.client.on('message', (topic, payload) => {
      console.log(topic);
    });

    this.client.on('connect', () => {
      console.log('Connected!');
      that.zone.run(() => {
        that.isOffline = false;
      });

      that.client.subscribe(this.queueCenterTopic, (error) => {
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

    this.client.on('close', () => {
      console.log('Close');
    });

    this.client.on('message', () => {
      console.log('Message reveived!');
      this.getList();
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

  ngOnInit() {
    this.getList();
    this.connectWebSocket();
  }

  async getList() {
    try {
      const rs: any = await this.queueService.getCurrentQueueList();
      if (rs.statusCode === 200) {
        this.items = rs.results;
        this.lastupdateTime = new Date();
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

}
