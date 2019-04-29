import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { AlertService } from '../../alert.service';
import { QueueOnlineDepartmentService } from '../queue-online-department.service';
import { QueueOnlineServiceTimeService } from '../service-time.service';
import { QueueOnlineServiceSlotService } from '../queue-online-service-slot.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-queue-online-modal-add-service-lot',
  templateUrl: './modal-add-service-slot.component.html',
  styles: []
})
export class QueueOnlineModalAddServiceSlotComponent implements OnInit {

  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content') public content: any;

  isActive: any;
  departmentId: any;
  serviceDate: any;
  totalQueue: any = 20;
  timeId: any;
  serviceSlotId: any;

  totalGenerated: number = 0;

  modalReference: NgbModalRef;

  departments: any = [];
  times: any = [];

  labelAction: any;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private departmentService: QueueOnlineDepartmentService,
    private serviceTimes: QueueOnlineServiceTimeService,
    private serviceSlot: QueueOnlineServiceSlotService
  ) { }

  ngOnInit() {
    this.labelAction = 'เพิ่ม';
  }

  async getDepartmentList() {
    try {
      var rs: any = await this.departmentService.list();
      if (rs.statusCode === 200) {
        this.departments = rs.results;
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error(error.message);
    }
  }

  async getTimes() {
    try {
      var rs: any = await this.serviceTimes.list();
      if (rs.statusCode === 200) {
        this.times = rs.results;
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error(error.message);
    }
  }

  open(item: any = null) {

    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
    });

    this.departmentId = null;
    this.serviceSlotId = null;
    this.totalQueue = 30;
    this.timeId = null;
    this.isActive = true;
    this.totalGenerated = 0;

    this.getDepartmentList();
    this.getTimes();

    if (item) {
      this.labelAction = 'แก้ไข';

      this.departmentId = item.department_id;
      this.serviceSlotId = item.service_slot_id;
      this.totalQueue = item.total_queue;
      this.timeId = item.time_id;
      this.isActive = item.is_active === 'Y' ? true : false;

      this.totalGenerated = item.total_generated;

      var _year = moment(item.service_date, 'YYYY-MM-DD').get('year');
      var _month = moment(item.service_date, 'YYYY-MM-DD').get('month') + 1;
      var _day = moment(item.service_date, 'YYYY-MM-DD').get('date');

      const date: NgbDateStruct = { year: _year, month: _month, day: _day };

      this.serviceDate = date;

    }

    this.modalReference.result.then((result) => { });

  }

  dismiss() {
    this.modalReference.close();
  }

  async save() {

    if (this.departmentId && this.timeId && this.totalQueue && this.serviceDate) {
      try {

        this.alertService.showLoading();

        var rs: any;

        var _serviceDate = `${this.serviceDate.year}-${this.serviceDate.month}-${this.serviceDate.day}`;

        if (this.serviceSlotId) {
          var _isActive = this.isActive ? 'Y' : 'N';
          rs = await this.serviceSlot.update(
            this.serviceSlotId,
            this.departmentId,
            _serviceDate,
            this.totalQueue,
            this.timeId,
            _isActive);
        } else {
          rs = await this.serviceSlot.save(
            this.departmentId,
            _serviceDate,
            this.totalQueue,
            this.timeId,
            _isActive
          );
        }

        Swal.close();

        if (rs.statusCode === 200) {
          this.alertService.success();
          this.onSuccess.emit();
          this.modalReference.close();
        } else {
          this.alertService.error(rs.message);
        }

      } catch (error) {
        Swal.close();
        console.log(error);
        this.alertService.error();
      }
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }

  }
}
