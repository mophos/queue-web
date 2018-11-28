import { Component, OnInit } from '@angular/core';
import { PriorityService } from 'src/app/shared/priority.service';
import { AlertService } from 'src/app/shared/alert.service';
import { QueueService } from 'src/app/shared/queue.service';

import * as moment from 'moment';
import { ServicePointService } from 'src/app/shared/service-point.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styles: []
})
export class VisitComponent implements OnInit {

  priorities: any = [];
  visit: any = [];

  total = 0;
  pageSize = 10;
  maxSizePage = 5;
  currentPage = 1;
  offset = 0;
  servicePointCode: any = '';
  servicePoints: any = [];

  constructor(
    private priorityService: PriorityService,
    private queueService: QueueService,
    private alertService: AlertService,
    private servicePointService: ServicePointService
  ) { }

  ngOnInit() {
    this.getPriorities();
    this.getVisit();
    this.getServicePoints();
  }

  refresh() {
    this.getVisit();
  }

  async getPriorities() {
    try {
      const rs: any = await this.priorityService.list();
      if (rs.statusCode === 200) {
        this.priorities = rs.results;
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

  async getServicePoints() {
    try {
      const rs: any = await this.servicePointService.list();
      if (rs.statusCode === 200) {
        this.servicePoints = rs.results;
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

  changeServicePoints(event: any) {
    this.servicePointCode = event.target.value;
    this.getVisit();
  }

  async getVisit() {
    try {
      const rs: any = await this.queueService.visitList(this.servicePointCode, this.pageSize, this.offset);
      if (rs.statusCode === 200) {
        this.visit = rs.results;
        this.total = rs.total;
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
      person.hisQueue = '';
      person.firstName = visit.first_name;
      person.lastName = visit.last_name;
      person.title = visit.title;
      person.birthDate = moment(visit.birthdate).format('YYYY-MM-DD');
      person.sex = visit.sex;

      const isConfirm = await this.alertService.confirm(`ต้องการสร้างคิวสำหรับ ${person.firstName} ${person.lastName} ใช่หรือไม่?`);
      if (isConfirm) {
        const rs: any = await this.queueService.register(person);
        if (rs.statusCode === 200) {
          this.alertService.success();
          this.getVisit();
        } else {
          this.alertService.error(rs.message);
        }
      }
    } catch (error) {
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }
}
