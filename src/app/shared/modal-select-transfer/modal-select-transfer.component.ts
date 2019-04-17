import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import { ServicePointService } from '../service-point.service';
import { PriorityService } from '../priority.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-modal-select-transfer',
  templateUrl: './modal-select-transfer.component.html',
  styles: []
})
export class ModalSelectTransferComponent implements OnInit {

  @Output('onSelected') onSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('content') public content: any;
  modalReference: NgbModalRef;

  pendingOldQueue: boolean
  _pendingOldQueue: any;

  servicePointId: any;
  priorityId: any;

  points: any = [];
  priorities: any = [];
  // isQueueOld = false;
  isAll: boolean = false;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private servicePointService: ServicePointService,
    private priorityService: PriorityService
  ) { }

  ngOnInit() { }


  async getOldQueue(event: any) {
    var point = _.findIndex(this.points, { service_point_id: +event.target.value });
    console.log(this.points[point].use_old_queue);
    if (point > -1) {
      this.pendingOldQueue = this.points[point].use_old_queue == 'Y' ? true : false;
    }
  }

  open(isAll: boolean = false) {
    this.isAll = isAll;
    this.getList();
    this.getPriorities();
    // this.getQueueOld();
    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
      // size: 'lg',
      // centered: true
    });

    this.modalReference.result.then((result) => { });

  }

  dismiss() {
    this.modalReference.close();
  }

  async getList() {
    if (this.isAll) {
      try {
        const rs: any = await this.servicePointService.list();
        if (rs.statusCode === 200) {
          this.points = rs.results;
        } else {
          console.log(rs.message);
          this.alertService.error('เกิดข้อผิดพลาด');
        }
      } catch (error) {
        console.log(error);
        this.alertService.error();
      }
    } else {
      const _servicePoints = sessionStorage.getItem('servicePoints');
      const jsonDecoded = JSON.parse(_servicePoints);

      this.points = jsonDecoded;
    }

  }

  async getPriorities() {
    try {
      const rs: any = await this.priorityService.list();
      if (rs.statusCode === 200) {
        this.priorities = rs.results;
      } else {
        console.log(rs.message);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }

  // setSelected(point: any) {
  //   if (point) {
  //     this.modalReference.close();
  //     this.onSelected.emit(point);
  //   }
  // }

  doTransfer() {
    if (this.servicePointId && this.priorityId) {
      this.modalReference.close();
      this.onSelected.emit({ servicePointId: this.servicePointId, priorityId: this.priorityId, pendigOldQueue: this.pendingOldQueue ? 'Y' : 'N' });
    } else {
      this.alertService.error('กรุณาเลือกจุดให้บริการและประเภทผู้ป่วย');
    }
  }


}
