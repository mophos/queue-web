import { Component, OnInit, ViewChild, NgZone, Inject } from '@angular/core';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import * as moment from 'moment';
import * as mqttClient from '../../../vendor/mqtt';
import { MqttClient } from 'mqtt';
import * as Random from 'random-js';
import { CountdownComponent } from 'ngx-countdown';
import { Router } from '@angular/router';


@Component({
  selector: 'app-queue-center-patient',
  templateUrl: './queue-center-patient.component.html',
  styles: []
})
export class QueueCenterPatientComponent implements OnInit {

  items: any = [];
  currentTime: Date = new Date();
  lastupdateTime: Date = new Date();

  currentDate: string = `${moment().locale('th').format('DD MMM')} ${moment().get('year') + 543}`;
  public message: string;

  isOffline = false;

  client: MqttClient;

  @ViewChild(CountdownComponent) counter: CountdownComponent;

  constructor(
    private queueService: QueueService,
    private alertService: AlertService,
    private zone: NgZone,
    @Inject('NOTIFY_URL') private notifyUrl: string,
    @Inject('PREFIX_TOPIC') private prefixTopic: string,
    private router: Router
  ) {
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
      clientId: clientId
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

      const topic = `${this.prefixTopic}/queue-center`;
      that.client.subscribe(topic, (error) => {
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

  // publishTopic() {
  //   const topic = `q4u/queue-center`;
  //   this.client.publish(topic, 'update queue!');
  // }

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
