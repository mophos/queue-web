import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../alert.service';
import { QueueOnlineServiceTimeService } from '../service-time.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-add-service-times',
  templateUrl: './modal-add-service-times.component.html',
  styles: []
})
export class ModalAddServiceTimesComponent implements OnInit {

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content') public content: any;

  timeStart: any;
  timeEnd: any;
  isActive: any;

  timeId: any;

  modalReference: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private serviceTimeService: QueueOnlineServiceTimeService
  ) {
    var date = new Date();
    this.timeStart = { hour: date.getHours(), minute: date.getMinutes() };
    this.timeEnd = { hour: date.getHours(), minute: date.getMinutes() };
  }

  ngOnInit() { }

  open(item: any = null) {

    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
    });

    if (item) {
      var s = moment(item.time_start, 'HH:mm:ss');
      var e = moment(item.time_end, 'HH:mm:ss');

      this.timeId = item.time_id;
      this.timeStart = { hour: s.get('hour'), minute: s.get('minute') };
      this.timeEnd = { hour: e.get('hour'), minute: e.get('minute') };
      this.isActive = item.is_active === 'Y' ? true : false;
    }

    this.modalReference.result.then((result) => { });

  }

  dismiss() {
    this.modalReference.close();
  }

  async save() {

    if (this.timeStart && this.timeEnd) {
      try {

        if (this.timeStart.hour > this.timeEnd.hour) {
          this.alertService.error('กรุณาระบุช่วงเวลา เริ่มต้น/สิ้นสุด ให้ถูกต้อง')
        } else {
          var _timeStart = `${this.timeStart.hour}:${this.timeStart.minute}`;
          var _timeEnd = `${this.timeEnd.hour}:${this.timeEnd.minute}`;
          var _isActive = this.isActive ? 'Y' : 'N';

          var rs: any;
          if (this.timeId) {
            rs = await this.serviceTimeService.update(this.timeId, _timeStart, _timeEnd, _isActive);
          } else {
            rs = await this.serviceTimeService.save(_timeStart, _timeEnd, _isActive);
          }

          if (rs.statusCode === 200) {
            this.alertService.success();
            this.onSave.emit();
            this.modalReference.close();
          } else {
            this.alertService.error(rs.message);
          }
        }

      } catch (error) {
        console.log(error);
        this.alertService.error();
      }
    } else {
      this.alertService.error('กรุณาระบุช่วงเวลา');
    }

  }
}
