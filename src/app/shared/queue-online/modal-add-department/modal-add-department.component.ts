import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../alert.service';
import * as moment from 'moment';
import { QueueOnlineDepartmentService } from '../queue-online-department.service';

@Component({
  selector: 'app-queue-online-modal-add-department',
  templateUrl: './modal-add-department.component.html',
  styles: []
})
export class QueueOnlineModalAddDepartmentComponent implements OnInit {

  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content') public content: any;

  departmentName: any;
  prefix: any;
  hisDepCode: any;
  isActive: any;

  departmentId: any;

  modalReference: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private departmentService: QueueOnlineDepartmentService
  ) { }

  ngOnInit() { }

  open(item: any = null) {

    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
    });

    this.departmentId = null;
    this.prefix = null;
    this.isActive = true;
    this.hisDepCode = null;
    this.departmentName = null;

    if (item) {
      this.departmentName = item.department_name;
      this.departmentId = item.department_id;
      this.prefix = item.prefix;
      this.hisDepCode = item.his_depcode;
      this.isActive = item.is_active === 'Y' ? true : false;
    }

    this.modalReference.result.then((result) => { });

  }

  dismiss() {
    this.modalReference.close();
  }

  async save() {

    if (this.departmentName && this.prefix && this.hisDepCode) {
      try {

        var rs: any;
        if (this.departmentId) {
          var _isActive = this.isActive ? 'Y' : 'N';

          rs = await this.departmentService.update(
            this.departmentId,
            this.departmentName,
            this.prefix,
            this.hisDepCode,
            _isActive);
        } else {
          rs = await this.departmentService.save(
            this.departmentName,
            this.prefix,
            this.hisDepCode,
            _isActive
          );
        }

        if (rs.statusCode === 200) {
          this.alertService.success();
          this.onSuccess.emit();
          this.modalReference.close();
        } else {
          this.alertService.error(rs.message);
        }

      } catch (error) {
        console.log(error);
        this.alertService.error();
      }
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }

  }
}
