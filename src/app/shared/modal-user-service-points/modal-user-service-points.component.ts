import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import { UserService } from '../user.service';
import { ServicePointService } from '../service-point.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-modal-user-service-points',
  templateUrl: './modal-user-service-points.component.html',
  styles: []
})
export class ModalUserServicePointsComponent implements OnInit {
  servicePoints = [];
  servicePointName: any;

  @Input('userId')
  set setUserId(value: any) {
    this.userId = value;
  }

  @Input('userName')
  set setUserName(value: any) {
    this.userName = value;
  }

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content') public content: any;

  userName: any;
  userId: any;
  modalReference: NgbModalRef;
  selectedServicePointIds: any = [];

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private userService: UserService,
    private servicePointService: ServicePointService
  ) { }

  ngOnInit() { }

  async open(userId: any) {

    this.servicePoints = [];
    this.selectedServicePointIds = [];

    // await this.getServicePoints();
    await this.getList(userId);

    this.userId = userId;

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

  async getList(userId: any) {
    try {
      const rs: any = await this.userService.servicePointList(userId);
      const rsServicePoints: any = await this.servicePointService.list();

      if (rs.statusCode === 200 && rsServicePoints.statusCode === 200) {
        // this.servicePoints = rs.results;

        rsServicePoints.results.forEach((v: any) => {
          var obj: any = {};

          obj.service_point_id = v.service_point_id;
          obj.service_point_name = v.service_point_name;

          rs.results.forEach((x: any) => {
            if (+x.service_point_id === +v.service_point_id) {
              obj.is_selected = true;
              this.selectedServicePointIds.push(+v.service_point_id);
            }
          });

          this.servicePoints.push(obj);
        });

        console.log(this.servicePoints);

      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

  toggleServicePoint(servicePointId: any, event: any) {
    var isSelected: boolean = event.target.checked;
    if (isSelected) {
      this.selectedServicePointIds.push(+servicePointId);
    } else {
      var idx = this.selectedServicePointIds.indexOf(servicePointId);
      this.selectedServicePointIds.splice(idx, 1);
    }
  }

  async save() {
    try {
      var rs: any = await this.userService.saveServicePointList(this.userId, this.selectedServicePointIds);
      if (rs.statusCode === 200) {
        this.alertService.success();
        this.modalReference.close();
        this.onSave.emit();
      }
    } catch (error) {
      console.log(error);
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

}
