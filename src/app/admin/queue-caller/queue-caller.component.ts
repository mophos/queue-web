import { Component, OnInit, OnDestroy, ViewChild, NgZone, Inject } from '@angular/core';
import * as mqttClient from '../../../vendor/mqtt';
import { MqttClient } from 'mqtt';
import * as Random from 'random-js';
import { Howl, Howler } from 'howler';

import { ModalSelectServicepointsComponent } from 'src/app/shared/modal-select-servicepoints/modal-select-servicepoints.component';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import { ServiceRoomService } from 'src/app/shared/service-room.service';

import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-queue-caller',
  templateUrl: './queue-caller.component.html',
  styles: []
})
export class QueueCallerComponent implements OnInit, OnDestroy {

  @ViewChild('mdlServicePoint') private mdlServicePoint: ModalSelectServicepointsComponent;

  message: string;
  servicePointId: any;
  servicePointName: any;
  waitingItems: any = [];
  workingItems: any = [];
  pendingItems: any = [];
  rooms: any = [];
  queueNumber: any;
  roomNumber: any;
  queueId: any;

  total = 0;
  pageSize = 10;
  maxSizePage = 5;
  currentPage = 1;
  offset = 0;

  currentTopic: any;

  isOffline = false;

  client: MqttClient;

  @ViewChild(CountdownComponent) counter: CountdownComponent;

  constructor(
    private queueService: QueueService,
    private roomService: ServiceRoomService,
    private alertService: AlertService,
    private zone: NgZone,
    @Inject('NOTIFY_URL') private notifyUrl: string,
    @Inject('PREFIX_TOPIC') private prefixTopic: string,
  ) {

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

  ngOnInit() { }

  connectWebSocket() {
    const rnd = new Random();
    const username = sessionStorage.getItem('username');
    const strRnd = rnd.integer(1111111111, 9999999999);
    const clientId = `${username}-${strRnd}`;

    this.client = mqttClient.connect(this.notifyUrl, {
      clientId: clientId
    });

    const that = this;
    const topic = `${this.prefixTopic}/sp/${this.currentTopic}`;
    const visitTopic = `${this.prefixTopic}/visit`;

    this.client.on('connect', () => {
      console.log('Connected!');
      that.zone.run(() => {
        that.isOffline = false;
      });

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

      that.client.subscribe(visitTopic, (error) => {
        if (error) {
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

    this.client.on('message', (topic, payload) => {
      console.log(topic);
      const _topic = `${this.prefixTopic}/sp/${this.currentTopic}`;
      if (_topic === topic) {
        this.getAllList();
      }
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

  publishTopic() {
    const topic = `${this.prefixTopic}/sp/${this.currentTopic}`;
    this.client.publish(topic, 'update queue!');

    const topicCenter = `${this.prefixTopic}/queue-center`;
    this.client.publish(topicCenter, 'update queue!');
  }

  // connectWebSocket() {

  //   var that = this;

  //   try {
  //     this.ws = new WebSocket("ws://localhost:8080/queue");
  //     this.ws.onopen = function (e) {
  //       console.log("Connection established");
  //       that.zone.run(() => {
  //         that.isOffline = false;
  //       });
  //     };

  //     this.ws.onmessage = function (e) {
  //       console.log("Message received", e, e.data);
  //     };

  //     this.ws.onerror = function (e) {
  //       console.log("WebSocket Error: ", e);
  //       that.zone.run(() => {
  //         that.isOffline = true;
  //         that.counter.restart();
  //       });
  //     };

  //     this.ws.onclose = function (e) {
  //       console.log("Connection closed", e);
  //       that.zone.run(() => {
  //         that.isOffline = true;
  //         that.counter.restart();
  //       });
  //     };
  //   } catch (error) {
  //     this.isOffline = true;
  //     this.counter.restart();
  //   }
  // }

  playSound(strQueue: string, strRoomNumber: string) {

    // var strQueue = '37009';
    // var strRoomNumber = '5';

    console.log(strRoomNumber);

    var _strQueue = strQueue.split('');
    var _strRoom = strRoomNumber.split('');

    var audioFiles = [];

    audioFiles.push('./assets/audio/number.mp3')
    audioFiles.push('./assets/audio/silent.mp3')

    _strQueue.forEach(v => {
      audioFiles.push(`./assets/audio/${v}.mp3`);
    });


    audioFiles.push('./assets/audio/silent.mp3');
    audioFiles.push('./assets/audio/please.mp3');
    audioFiles.push('./assets/audio/at.mp3');
    audioFiles.push('./assets/audio/channel.mp3');
    audioFiles.push('./assets/audio/service.mp3');

    _strRoom.forEach(v => {
      audioFiles.push(`./assets/audio/${v}.mp3`);
    });

    audioFiles.push('./assets/audio/ka.mp3');

    var howlerBank = [];

    // console.log(audioFiles);

    var loop = false;

    var onPlay = [false], pCount = 0;

    var onEnd = function (e) {
      if (loop === true) { pCount = (pCount + 1 !== howlerBank.length) ? pCount + 1 : 0; }
      else { pCount = pCount + 1; }

      if (pCount <= audioFiles.length - 1) {
        howlerBank[pCount].play();
      }
    };

    audioFiles.forEach(function (current, i) {
      howlerBank.push(new Howl({
        src: [audioFiles[i]],
        onend: onEnd,
        preload: true,
        html5: true,
      }));
    });

    howlerBank[0].play();

  }

  onPageChange(event: any) {
    const _currentPage = +event;
    var _offset = 0;
    if (_currentPage > 1) {
      _offset = (_currentPage - 1) * this.pageSize;
    }

    this.offset = _offset;
    this.getWaiting();
  }

  onFinished() {
    console.log('Time finished!');
    this.connectWebSocket();
  }

  onNotify($event) {
    console.log('Finished')
  }

  setChangeRoom(item: any) {
    this.queueId = item.queue_id;
  }

  async doChangeRoom(room: any) {
    if (this.isOffline) {
      this.alertService.error('กรุณาตรวจสอบการเชื่อมต่อกับ Notify Server');
    } else {
      const roomId = room.room_id;
      const queueId = this.queueId;
      try {
        const isConfirm = await this.alertService.confirm('ต้องการเปลี่ยนช่องบริการ ใช่หรือไม่')
        if (isConfirm) {
          const rs: any = await this.queueService.changeRoom(queueId, roomId);
          if (rs.statusCode === 200) {
            this.alertService.success();
            this.getWorking();
          } else {
            this.alertService.error(rs.message);
          }
        }
      } catch (error) {
        console.error(error);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    }
  }

  async getWaiting() {
    try {
      const rs: any = await this.queueService.getWaiting(this.servicePointId, this.pageSize, this.offset);
      if (rs.statusCode === 200) {
        this.waitingItems = rs.results;
        this.total = rs.total;
      } else {
        console.log(rs.message);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
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

  async getPending() {
    try {
      const rs: any = await this.queueService.getPending(this.servicePointId);
      if (rs.statusCode === 200) {
        this.pendingItems = rs.results;
      } else {
        console.log(rs.message);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }

  async getRooms() {
    try {
      const rs: any = await this.roomService.list(this.servicePointId);
      if (rs.statusCode === 200) {
        this.rooms = rs.results;
      } else {
        console.log(rs.message);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }

  selectServicePoint() {
    this.mdlServicePoint.open();
  }

  onSelectedPoint(event: any) {
    console.log(event);
    this.servicePointName = event.service_point_name;
    this.servicePointId = event.service_point_id;
    this.currentTopic = event.topic;

    this.connectWebSocket();
    this.getAllList();

  }

  getAllList() {
    this.getWaiting();
    this.getWorking();
    this.getRooms();
    this.getPending();
  }

  setQueueForCall(item: any) {
    this.queueId = item.queue_id;
    this.queueNumber = item.queue_number;
    console.log(item);
  }

  async doCallQueue(room: any) {
    if (this.isOffline) {
      this.alertService.error('กรุณาตรวจสอบการเชื่อมต่อกับ Notify Server');
    } else {
      try {
        const rs: any = await this.queueService.callQueue(this.servicePointId, this.queueNumber, room.room_id, this.queueId);
        if (rs.statusCode === 200) {
          this.alertService.success();
          this.roomNumber = room.room_number;

          this.playSound(this.queueNumber, this.roomNumber.toString());

          // tigger queue list
          this.publishTopic();
          // get queue list
          this.getAllList();
        } else {
          this.alertService.error(rs.message);
        }
      } catch (error) {
        console.error(error);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    }
  }

  async markPendin(item: any) {
    console.log(item);
    const _confirm = await this.alertService.confirm(`ต้องการพักคิวนี้ [${item.queue_number}] ใช่หรือไม่?`);
    if (_confirm) {
      try {
        const rs: any = await this.queueService.markPending(item.queue_id);
        if (rs.statusCode === 200) {
          this.alertService.success();
          this.getAllList();
        } else {
          this.alertService.error(rs.message);
        }
      } catch (error) {
        console.log(error);
        this.alertService.error();
      }
    }
  }

}
