import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import { ServicePointService } from '../service-point.service';

@Component({
  selector: 'app-modal-add-service-point',
  templateUrl: './modal-add-service-point.component.html',
  styles: []
})
export class ModalAddServicePointComponent implements OnInit {

  @Input('servicePointId')
  set setId(value: any) {
    this.servicePointId = value;
  }

  @Input('servicePointName')
  set setName(value: any) {
    this.servicePointName = value;
  }

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('content') public content: any;

  modalReference: NgbModalRef;
  servicePointId: any;
  servicePointName: any;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private servicePointService: ServicePointService) { }

  ngOnInit(): void { }

  open() {
    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
      size: 'sm',
      centered: true
    });

    this.modalReference.result.then((result) => { });
  }

  dismiss() {
    this.modalReference.close();
  }

  async save() {
    if (this.servicePointName) {
      try {
        const data: any = { servicePointName: this.servicePointName };
        var rs: any;

        if (this.servicePointId) {
          rs = await this.servicePointService.update(this.servicePointId, data);
        } else {
          rs = await this.servicePointService.save(data);
        }

        if (rs.ok) {
          this.modalReference.close();
          this.onSave.emit();
        } else {
          this.alertService.error(rs.message);
        }
      } catch (error) {
        console.log(error);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } else {
      this.alertService.error('กรุณาระบุชื่อ');
    }
  }

}
