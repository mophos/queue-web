
import { Component, OnInit, OnDestroy, ViewChild, NgZone, Inject } from '@angular/core';
import * as mqttClient from '../../../vendor/mqtt';
import { MqttClient } from 'mqtt';
import * as Random from 'random-js';
import * as _ from 'lodash';
import { ModalSelectServicepointsComponent } from 'src/app/shared/modal-select-servicepoints/modal-select-servicepoints.component';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import { ServiceRoomService } from 'src/app/shared/service-room.service';

import { CountdownComponent } from 'ngx-countdown';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModalSelectTransferComponent } from 'src/app/shared/modal-select-transfer/modal-select-transfer.component';
import { ModalSelectRoomComponent } from 'src/app/shared/modal-select-room/modal-select-room.component';
import { PriorityService } from '../../shared/priority.service';

@Component({
  selector: 'app-queue-caller-group',
  templateUrl: './queue-caller-group.component.html',
  styles: []
})
export class QueueCalleGroupComponent implements OnInit, OnDestroy {

  @ViewChild('mdlServicePoint') private mdlServicePoint: ModalSelectServicepointsComponent;
  @ViewChild('mdlSelectTransfer') private mdlSelectTransfer: ModalSelectTransferComponent;
  // @ViewChild('mdlSelectRoom') private mdlSelectRoom: ModalSelectRoomComponent;

  message: string;
  servicePointId: any;
  servicePointName: any;
  waitingItems: any = [];
  workingItems: any = [];
  historyItems: any = [];
  rooms: any = [];
  queueNumber: any;
  roomNumber: any;
  roomId: any;
  queueId: any;
  queueRunning: any;
  priorities = [];

  priorityId: any;

  isAllServicePoint: boolean = false;

  total = 0;
  historyTotal = 0
  pageSize = 10;
  maxSizePage = 5;
  currentPage = 1;
  offset = 0;

  // currentTopic: any;

  isOffline = false;

  client: MqttClient;
  jwtHelper = new JwtHelperService();
  groupTopic = null;
  globalTopic = null;
  servicePointTopic = null;
  notifyUser = null;
  notifyPassword = null;
  isMarkPending = false;
  pendingToServicePointId: any = null;
  pendingToPriorityId: any = null;

  selectedQueue: any = {};
  notifyUrl: string;
  tmpWaitingItems: {}[];

  queryWaiting = '';
  queryHistory = '';
  @ViewChild(CountdownComponent) counter: CountdownComponent;

  constructor(
    private queueService: QueueService,
    private roomService: ServiceRoomService,
    private priorityService: PriorityService,
    private alertService: AlertService,
    private zone: NgZone,
    @Inject('API_URL') private apiUrl: string,
  ) {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.groupTopic = decodedToken.GROUP_TOPIC;
    this.servicePointTopic = decodedToken.SERVICE_POINT_TOPIC;
    this.globalTopic = decodedToken.QUEUE_CENTER_TOPIC;

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

  ngOnInit() {
    this.getPriorities();
  }

  async getPriorities() {
    try {
      var rs: any = await this.priorityService.list();
      if (rs.statusCode === 200) {
        this.priorities = rs.results;
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }

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
    const topic = `${this.groupTopic}/${this.servicePointId}`;
    const topicServicePoint = `${this.servicePointTopic}/${this.servicePointId}`;
    const visitTopic = this.globalTopic;

    this.client.on('connect', () => {
      console.log('Connected!');
      that.zone.run(() => {
        that.isOffline = false;
      });

      if (this.servicePointId) {
        that.client.subscribe(topicServicePoint, { qos: 0 }, (error) => {
          console.log('Subscribe : ' + topicServicePoint);

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
      }

      that.client.subscribe([topic, visitTopic], (error) => {
        console.log('Subscribe : ' + visitTopic + ', ' + topic);
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
      this.getWaiting();
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
    this.queueRunning = item.queue_running;
  }

  async doChangeRoom(room: any) {
    if (this.isOffline) {
      this.alertService.error('กรุณาตรวจสอบการเชื่อมต่อกับ Notify Server');
    } else {

      const roomId = room.room_id;
      const queueId = this.queueId;
      const roomNumber = room.room_number;
      const queueNumber = this.queueNumber;
      const queueRunning = this.queueRunning;

      try {
        const isConfirm = await this.alertService.confirm('ต้องการเปลี่ยนช่องบริการ ใช่หรือไม่')
        if (isConfirm) {
          const rs: any = await this.queueService.changeRoomGroup(queueId, roomId, this.servicePointId, roomNumber, queueNumber, queueRunning);
          if (rs.statusCode === 200) {
            this.alertService.success();
            const idxw = _.findIndex(this.workingItems, { service_point_id: this.servicePointId, queue_id: this.queueId, queue_running: this.queueRunning });
            if (idxw > -1) {
              console.log(this.workingItems[idxw], roomId);

              this.workingItems[idxw].room_id = roomId;
              this.workingItems[idxw].room_number = roomNumber;
            }
            const idxh = _.findIndex(this.historyItems, { service_point_id: this.servicePointId, queue_id: this.queueId, queue_running: this.queueRunning });
            if (idxh > -1) {
              console.log(this.historyItems[idxh]);
              this.historyItems[idxh].room_id = roomId;
              this.historyItems[idxh].room_number = roomNumber;
            }
            // this.getWorking();
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

  onChangePriority(event: any) {
    this.priorityId = event.target.value;
    this.getWaiting();
  }

  async getWaiting() {
    try {
      const rs: any = await this.queueService.getWaitingGroup(this.servicePointId, this.priorityId, this.pageSize, this.offset);
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
      const rs: any = await this.queueService.getWorkingGroup(this.servicePointId);
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

  async searchQueryWaiting() {
    try {
      this.offset = 0;
      const rs: any = await this.queueService.searchWaitingGroup(this.servicePointId, this.priorityId, this.pageSize, this.offset, this.queryWaiting);
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

  async searchQueryHistory() {
    try {
      this.offset = 0;
      const rs: any = await this.queueService.searchHistoryGroup(this.servicePointId, this.pageSize, 0, this.queryHistory);
      if (rs.statusCode === 200) {
        this.historyItems = rs.results;
        this.historyTotal = rs.total;
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
      const rs: any = await this.queueService.getWorkingHistoryGroup(this.servicePointId);
      if (rs.statusCode === 200) {
        this.historyItems = rs.results;
        this.historyTotal = this.historyItems.length;
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
    // console.log(event);
    if (event) {
      this.servicePointName = event.service_point_name;
      this.servicePointId = event.service_point_id;
      this.priorityId = '';

      this.connectWebSocket();
      this.getAllList();
      this.getRooms();
    }
  }

  onSelectedTransfer(event: any) {
    this.pendingToServicePointId = event.servicePointId;
    this.pendingToPriorityId = event.priorityId;

    this.doMarkPending(this.selectedQueue);
  }

  getAllList() {
    this.getWaiting();
    this.getWorking();
    this.getHistory();
  }

  setQueueForCall(item: any) {
    this.queueId = item.queue_id;
    this.queueNumber = item.queue_number;
    this.queueRunning = item.queue_running;
  }

  onCallCurrentQueue(item: any) {
    this.queueId = item.queue_id;
    this.queueNumber = item.queue_number;
    this.queueRunning = item.queue_running;

    if (this.roomNumber && this.roomId) {
      this.doCallQueue(this.roomId, this.roomNumber);
    } else {
      this.alertService.error('กรุณาเลือกช่องรับบริการ');
    }
  }

  callAgains(queue: any) {
    this.queueNumber = queue.queue_number;
    this.queueId = queue.queue_id;
    this.queueRunning = queue.queue_running;
    this.doCallQueue(queue.room_id, queue.room_number);
  }

  callAgain(queue: any) {
    this.queueNumber = queue.queue_number;
    this.queueId = queue.queue_id;
    this.queueRunning = queue.queue_running;
    this.doCallQueueAgain(queue.room_id, queue.room_number);
  }

  onChangeRooms(event: any) {
    var _roomId = event.target.value;
    var idx = _.findIndex(this.rooms, { room_id: +_roomId });
    if (idx > -1) {
      this.roomId = this.rooms[idx].room_id;
      this.roomNumber = this.rooms[idx].room_number;
    } else {
      this.alertService.error('กรุณาเลือกช่องรับบริการ');
      this.roomId = null;
      this.roomNumber = null;
    }
  }

  async onCallQueueGroup(count: any) {
    if (this.roomId && this.roomNumber) {
      this.tmpWaitingItems = [];
      this.tmpWaitingItems = _.map(_.take(this.waitingItems, count), (v: any) => {
        return {
          queue_id: v.queue_id,
          queue_number: v.queue_number,
          queue_running: v.queue_running
        }
      });

      if (this.tmpWaitingItems.length) {
        this.doCallQueueGroup();
      } else {
        this.alertService.error('ไม่พบรายการคิวที่ต้องการเรียก');
      }

    } else {
      this.alertService.error('กรุณาเลือกห้องตรวจ');
    }
  }

  async doCallQueueGroup(isCompleted: any = 'Y') {
    if (this.isOffline) {
      this.alertService.error('กรุณาตรวจสอบการเชื่อมต่อกับ Notify Server');
    } else {
      try {
        const rs: any = await this.queueService.callQueueGroups(this.servicePointId, this.roomId, this.roomNumber, isCompleted, this.tmpWaitingItems);
        // const rs: any = await this.queueService.callQueueGroup(this.servicePointId, this.queueNumber, this.roomId, this.roomNumber, this.queueId, isCompleted, this.queueRunning);
        if (rs.statusCode === 200) {
          this.alertService.success();
          this.getAllList();
          this.tmpWaitingItems = [];
        } else {
          this.alertService.error(rs.message);
        }
      } catch (error) {
        console.error(error);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    }
  }

  async doCallQueueAgain(_roomId: any, _roomNumber: any, isCompleted: any = 'Y') {

    if (this.isOffline) {
      this.alertService.error('กรุณาตรวจสอบการเชื่อมต่อกับ Notify Server');
    } else {
      try {
        const rs: any = await this.queueService.callQueueGroup(this.servicePointId, this.queueNumber, _roomId, _roomNumber, this.queueId, isCompleted, this.queueRunning);
        // const rs: any = await this.queueService.callQueueGroup(this.servicePointId, this.queueNumber, this.roomId, this.roomNumber, this.queueId, isCompleted, this.queueRunning);
        if (rs.statusCode === 200) {
          this.alertService.success();
          // this.getAllList();
          // const idxw = _.findIndex(this.workingItems, { service_point_id: this.servicePointId, queue_id: this.queueId, queue_running: this.queueRunning });
          // if (idxw > -1) {
          //   this.workingItems[idxw].room_id = this.roomId
          //   this.workingItems[idxw].room_number = this.roomNumber
          // }
          // const idxh = _.findIndex(this.historyItems, { service_point_id: this.servicePointId, queue_id: this.queueId, queue_running: this.queueRunning });
          // if (idxh > -1) {
          //   this.historyItems[idxh].room_id = this.roomId
          //   this.historyItems[idxh].room_number = this.roomNumber
          // }
          this.queueNumber = null;
          this.queueId = null;
          this.queueRunning = null;
        } else {
          this.alertService.error(rs.message);
        }
      } catch (error) {
        console.error(error);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    }
  }

  async doCallQueue(_roomId: any, _roomNumber: any, isCompleted: any = 'Y') {
    if (this.isOffline) {
      this.alertService.error('กรุณาตรวจสอบการเชื่อมต่อกับ Notify Server');
    } else {
      try {
        const rs: any = await this.queueService.callQueueGroup(this.servicePointId, this.queueNumber, _roomId, _roomNumber, this.queueId, isCompleted, this.queueRunning);
        // const rs: any = await this.queueService.callQueueGroup(this.servicePointId, this.queueNumber, this.roomId, this.roomNumber, this.queueId, isCompleted, this.queueRunning);
        if (rs.statusCode === 200) {
          this.alertService.success();
          this.getAllList();
          this.queueNumber = null;
          this.queueId = null;
          this.queueRunning = null;
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
    if (this.servicePointId === this.pendingToServicePointId) {
      this.alertService.error('ไม่สามารถสร้างคิวในแผนกเดียวกันได้');
    } else {
      const _confirm = await this.alertService.confirm(`ต้องการพักคิวนี้ [${item.queue_number}] ใช่หรือไม่?`);
      if (_confirm) {
        try {
          const rs: any = await this.queueService.markPending(item.queue_id, this.pendingToServicePointId, this.pendingToPriorityId);
          if (rs.statusCode === 200) {
            this.alertService.success();
            this.selectedQueue = {};
            this.isMarkPending = false;
            const queueNumber = rs.queueNumber;
            const newQueueId = rs.queueId;
            const confirm = await this.alertService.confirm(`คิวใหม่ของคุณคือ ${queueNumber} ต้องการพิมพ์บัตรคิว หรือไม่?`);
            if (confirm) {
              this.printQueue(newQueueId);
            }
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
          //success
        } else {
          this.alertService.error('ไม่สามารถพิมพ์บัตรคิวได้')
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

  // openModalSelectRoomOne(item) {
  //   // this.setQueueForCall(item);
  //   this.tmpWaitingItems = [{
  //     queue_id: item.queue_id,
  //     queue_number: item.queue_number,
  //     queue_running: item.queue_running
  //   }]
  //   this.mdlSelectRoom.open();
  // }

}
