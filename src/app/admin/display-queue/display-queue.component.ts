import { Component, OnInit, ViewChild, NgZone, Inject, OnDestroy } from '@angular/core';
import { ModalSelectServicepointsComponent } from 'src/app/shared/modal-select-servicepoints/modal-select-servicepoints.component';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import * as mqttClient from '../../../vendor/mqtt';
import { MqttClient } from 'mqtt';
import * as _ from 'lodash';
import * as Random from 'random-js';

import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-display-queue',
  templateUrl: './display-queue.component.html',
  styles: []
})
export class DisplayQueueComponent implements OnInit, OnDestroy {

  ngOnInit(): void { }

  @ViewChild('mdlServicePoint') private mdlServicePoint: ModalSelectServicepointsComponent;
  @ViewChild(CountdownComponent) counter: CountdownComponent;

  servicePointId: any;
  servicePointName: any;
  workingItems: any = [];
  currentQueueNumber: any;
  currentRoomNumber: any;
  currentHn: any;
  currentRoomName: any;
  currentTopic: any = '';

  isOffline = false;

  client: MqttClient;

  constructor(
    private queueService: QueueService,
    private alertService: AlertService,
    private zone: NgZone,
    @Inject('NOTIFY_URL') private notifyUrl: string
  ) { }

  public unsafePublish(topic: string, message: string): void {
    this.client.end(true);
  }

  public ngOnDestroy() {
    this.client.end(true);
  }

  connectWebSocket() {
    const rnd = new Random();
    const strRnd = rnd.uuid4();
    const clientId = `qu4-sp-${this.currentTopic}-${strRnd}`;
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

      const topic = `q4u/sp/${this.currentTopic}`;
      console.log('TOPIC: ', topic);

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
      console.log('Receive message');
      this.getCurrentQueue();
      this.getWorking();
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

  selectServicePoint() {
    this.mdlServicePoint.open();
  }

  onSelectedPoint(event: any) {
    console.log(event);
    // set service info
    this.servicePointName = event.service_point_name;
    this.servicePointId = event.service_point_id;
    this.currentTopic = event.topic;

    // connect mqtt
    this.connectWebSocket();
    // get list
    this.getWorking();
    this.getCurrentQueue();
  }


  async getWorking() {
    try {
      const rs: any = await this.queueService.getWorking(this.servicePointId);
      if (rs.statusCode === 200) {
        this.workingItems = rs.results;
      } else {
        console.log(rs.message);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }

  async getCurrentQueue() {
    try {
      const rs: any = await this.queueService.getWorking(this.servicePointId);
      if (rs.statusCode === 200) {

        const arr = _.sortBy(rs.results, ['update_date']).reverse();

        if (arr.length > 0) {
          this.currentHn = arr[0].hn;
          this.currentQueueNumber = arr[0].queue_number;
          this.currentRoomName = arr[0].room_name;
          this.currentRoomNumber = arr[0].room_number;
        } else {
          this.currentHn = null;
          this.currentQueueNumber = null;
          this.currentRoomName = null;
          this.currentRoomNumber = null;
        }
      } else {
        console.log(rs.message);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }
}
