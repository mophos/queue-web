import { ModalSelectRoomComponent } from './../../shared/modal-select-room/modal-select-room.component';
import { Component, OnInit, OnDestroy, ViewChild, NgZone, Inject } from '@angular/core';
import * as mqttClient from '../../../vendor/mqtt';
import { MqttClient } from 'mqtt';
import * as Random from 'random-js';

import { ModalSelectServicepointsComponent } from 'src/app/shared/modal-select-servicepoints/modal-select-servicepoints.component';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import { ServiceRoomService } from 'src/app/shared/service-room.service';

import { CountdownComponent } from 'ngx-countdown';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModalSelectTransferComponent } from 'src/app/shared/modal-select-transfer/modal-select-transfer.component';

@Component({
  selector: 'app-queue-caller',
  templateUrl: './queue-caller.component.html',
  styles: []
})
export class QueueCallerComponent implements OnInit, OnDestroy {

  @ViewChild('mdlServicePoint') private mdlServicePoint: ModalSelectServicepointsComponent;
  @ViewChild('mdlSelectTransfer') private mdlSelectTransfer: ModalSelectTransferComponent;
  @ViewChild('mdlSelectRoom') private mdlSelectRoom: ModalSelectRoomComponent;

  message: string;
  servicePointId: any;
  servicePointName: any;
  waitingItems: any = [];
  workingItems: any = [];
  pendingItems: any = [];
  historyItems: any = [];
  rooms: any = [];
  queueNumber: any;
  roomNumber: any;
  roomId: any;
  queueId: any;

  isInterview = false;

  isAllServicePoint = false;

  total = 0;
  pageSize = 10;
  maxSizePage = 5;
  currentPage = 1;
  offset = 0;

  // currentTopic: any;

  isOffline = false;

  client: MqttClient;
  jwtHelper = new JwtHelperService();
  servicePointTopic = null;
  globalTopic = null;
  departmentTopic = null;
  notifyUser = null;
  notifyPassword = null;
  isMarkPending = false;
  pendingToServicePointId: any = null;
  pendingToPriorityId: any = null;

  selectedQueue: any = {};
  notifyUrl: string;
  departmentId: any;
  pendingOldQueue: any;

  @ViewChild(CountdownComponent) counter: CountdownComponent;

  constructor(
    private queueService: QueueService,
    private roomService: ServiceRoomService,
    private alertService: AlertService,
    private zone: NgZone,
    @Inject('API_URL') private apiUrl: string,
  ) {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.servicePointTopic = decodedToken.SERVICE_POINT_TOPIC;
    this.globalTopic = decodedToken.QUEUE_CENTER_TOPIC;
    this.departmentTopic = decodedToken.DEPARTMENT_TOPIC || 'queue/department';

    this.notifyUrl = `ws://${decodedToken.NOTIFY_SERVER}:${+decodedToken.NOTIFY_PORT}`;
    this.notifyUser = decodedToken.NOTIFY_USER;
    this.notifyPassword = decodedToken.NOTIFY_PASSWORD;

    const _servicePoints = sessionStorage.getItem('servicePoints');
    const jsonDecodedServicePoint = JSON.parse(_servicePoints);
    if (jsonDecodedServicePoint.length === 1) {
      this.onSelectedPoint(jsonDecodedServicePoint[0]);
    }
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

    try {
      // close old connection
      this.client.end(true);
    } catch (error) {
      console.log(error);
    }

    this.client = mqttClient.connect(this.notifyUrl, {
      clientId: clientId,
      username: this.notifyUser,
      password: this.notifyPassword
    });

    const that = this;
    const topic = `${this.servicePointTopic}/${this.servicePointId}`;
    const departmentTopic = `${this.departmentTopic}/${this.departmentId}`;
    const visitTopic = this.globalTopic;

    this.client.on('connect', () => {
      console.log('Connected!');
      that.zone.run(() => {
        that.isOffline = false;
      });

      that.client.subscribe([topic, visitTopic, departmentTopic], { qos: 0 }, (error) => {
        console.log(`Subscribe ${topic}, ${visitTopic}, ${departmentTopic}`);

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
      this.getAllList();
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
    });
  }

  onPageChange(event: any) {
    const _currentPage = +event;
    let _offset = 0;
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
    console.log('Finished');
  }

  setChangeRoom(item: any) {
    this.queueId = item.queue_id;
    this.queueNumber = item.queue_number;
  }

  async doChangeRoom(room: any) {
    if (this.isOffline) {
      this.alertService.error('กรุณาตรวจสอบการเชื่อมต่อกับ Notify Server');
    } else {
      const roomId = room.room_id;
      const queueId = this.queueId;
      const roomNumber = room.room_number;
      const queueNumber = this.queueNumber;
      try {
        const isConfirm = await this.alertService.confirm('ต้องการเปลี่ยนช่องบริการ ใช่หรือไม่');
        if (isConfirm) {
          const rs: any = await this.queueService.changeRoom(queueId, roomId, this.servicePointId, roomNumber, queueNumber);
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

  async getHistory() {
    try {
      const rs: any = await this.queueService.getWorkingHistory(this.servicePointId);
      if (rs.statusCode === 200) {
        this.historyItems = rs.results;
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
    this.isMarkPending = false;
    this.mdlServicePoint.open(false);
  }

  showSelectPointForMarkPending(item: any) {
    this.selectedQueue = item;
    this.isMarkPending = true;
    this.mdlSelectTransfer.open(true);
  }

  onSelectedPoint(event: any) {
    if (event) {
      if (!this.isMarkPending) {
        this.servicePointName = event.service_point_name;
        this.servicePointId = event.service_point_id;
        this.departmentId = event.department_id;
        this.connectWebSocket();
        this.getAllList();
      } else {
        this.pendingToServicePointId = event.service_point_id;
        this.doMarkPending(this.selectedQueue);
      }
    }
  }

  onSelectedTransfer(event: any) {
    this.pendingToServicePointId = event.servicePointId;
    this.pendingToPriorityId = event.priorityId;
    this.pendingOldQueue = event.pendingOldQueue

    this.doMarkPending(this.selectedQueue);
  }

  getAllList() {
    this.getWaiting();
    this.getWorking();
    this.getRooms();
    this.getPending();
    this.getHistory();
  }

  setQueueForCall(item: any) {
    this.queueId = item.queue_id;
    this.queueNumber = item.queue_number;
  }

  onSelectRoom(item) {
    this.prepareQueue({ 'room_id': item.roomId, 'room_number': item.roomNumber });
  }

  setCallDetail(item: any) {
    this.queueId = item.queue_id;
    this.queueNumber = item.queue_number;
    if (this.rooms.length === 1) {
      this.roomId = this.rooms[0].room_id;
      this.roomNumber = this.rooms[0].room_number;
      this.doCallQueue();
    }
  }

  callAgain(queue: any) {
    this.roomNumber = queue.room_number;
    this.roomId = queue.room_id;
    this.queueNumber = queue.queue_number;
    this.queueId = queue.queue_id;
    this.doCallQueue();
  }

  prepareQueue(room: any) {
    this.roomId = room.room_id;
    this.roomNumber = room.room_number;
    if (this.isInterview) {
      this.doCallQueue('N');
    } else {
      this.doCallQueue();
    }
  }

  async interviewQueue(room: any) {
    this.roomId = room.room_id;
    this.roomNumber = room.room_number;
    // update interview
    this.doCallQueue('N');
  }

  async doCallQueue(isCompleted: any = 'Y') {
    if (this.isOffline) {
      this.alertService.error('กรุณาตรวจสอบการเชื่อมต่อกับ Notify Server');
    } else {
      try {
        const rs: any = await this.queueService.callQueue(this.servicePointId, this.queueNumber, this.roomId, this.roomNumber, this.queueId, isCompleted);
        if (rs.statusCode === 200) {
          this.alertService.success();
          this.getAllList();
          this.roomId = null;
          this.roomNumber = null;
          this.queueNumber = null;
          this.queueId = null;
        } else {
          this.alertService.error(rs.message);
        }
      } catch (error) {
        console.error(error);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    }
  }

  async doMarkPending(item: any) {

    var printPendingQueue = localStorage.getItem('printPendingQueue') || 'N';
    var _printPendingQueue = printPendingQueue == 'Y' ? true : false;

    if (this.servicePointId === this.pendingToServicePointId) {
      this.alertService.error('ไม่สามารถสร้างคิวในแผนกเดียวกันได้');
    } else {
      var textShow = _printPendingQueue ? `ต้องการพักคิวนี้ [${item.queue_number}] ใช่หรือไม่?` : `ต้องการพักคิวนี้ [${item.queue_number}] และพิมพ์คิวใหม่ ใช่หรือไม่?`;
      const _confirm = await this.alertService.confirm(textShow);

      if (_confirm) {
        try {
          const rs: any = await this.queueService.markPending(item.queue_id, this.pendingToServicePointId, this.pendingToPriorityId, this.pendingOldQueue);
          if (rs.statusCode === 200) {
            this.alertService.success();
            this.selectedQueue = {};
            this.isMarkPending = false;
            const queueNumber = rs.queueNumber;
            const newQueueId = rs.queueId;

            if (_printPendingQueue) {
              const confirm = await this.alertService.confirm(`คิวใหม่ของคุณคือ ${queueNumber} ต้องการพิมพ์บัตรคิว หรือไม่?`);
              if (confirm) {
                this.printQueue(newQueueId);
              }
            } else {
              this.printQueue(newQueueId);
            }
            this.getAllList();
            this.getWaiting();
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

  async cancelQueue(queue: any) {
    const _confirm = await this.alertService.confirm(`ต้องการรยกเลิกคิวนี้ [${queue.queue_number}] ใช่หรือไม่?`);
    if (_confirm) {
      try {
        const rs: any = await this.queueService.markCancel(queue.queue_id);
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

  async printQueue(queueId: any) {
    const usePrinter = localStorage.getItem('clientUserPrinter');
    const printerId = localStorage.getItem('clientPrinterId');
    var printSmallQueue = localStorage.getItem('printSmallQueue') || 'N';

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

  openModalSelectRoom(item) {
    this.isInterview = false;
    this.setQueueForCall(item);
    this.mdlSelectRoom.open();
  }

  openModalSelectRoomInterview(item) {
    this.isInterview = true;
    this.setQueueForCall(item);
    this.mdlSelectRoom.open();
  }

}
