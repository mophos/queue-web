import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  IMqttMessage,
  MqttService
} from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ModalSelectServicepointsComponent } from 'src/app/shared/modal-select-servicepoints/modal-select-servicepoints.component';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import { ServiceRoomService } from 'src/app/shared/service-room.service';

@Component({
  selector: 'app-queue-caller',
  templateUrl: './queue-caller.component.html',
  styles: []
})
export class QueueCallerComponent implements OnInit, OnDestroy {

  @ViewChild('mdlServicePoint') private mdlServicePoint: ModalSelectServicepointsComponent;

  private subscription: Subscription;
  public message: string;
  public servicePointId: any;
  public servicePointName: any;
  public waitingItems: any = [];
  public workingItems: any = [];
  public rooms: any = [];
  public queueNumber: any;
  public queueId: any;

  constructor(
    private _mqttService: MqttService,
    private queueService: QueueService,
    private roomService: ServiceRoomService,
    private alertService: AlertService
  ) {
    // this.subscription = this._mqttService.observe('queue/topic').subscribe((message: IMqttMessage) => {
    //   this.message = message.payload.toString();
    //   console.log(this.message);
    // });
  }

  public unsafePublish(topic: string, message: string): void {
    // this._mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
  }

  public ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  ngOnInit() {

  }

  setChangeRoom(item: any) {
    this.queueId = item.queue_id;
  }

  async doChangeRoom(room: any) {
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

  async getWaiting() {
    try {
      const rs: any = await this.queueService.getWaiting(this.servicePointId);
      if (rs.statusCode === 200) {
        this.waitingItems = rs.results;
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
    this.getWaiting();
    this.getWorking();
    this.getRooms();
  }

  setQueueForCall(item: any) {
    this.queueId = item.queue_id;
    this.queueNumber = item.queue_number;

    console.log(item);
  }

  async doCallQueue(roomId: any) {
    try {
      const rs: any = await this.queueService.callQueue(this.servicePointId, this.queueNumber, roomId, this.queueId);
      if (rs.statusCode === 200) {
        this.alertService.success();
        this.getWaiting();
        this.getWorking();
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

}
