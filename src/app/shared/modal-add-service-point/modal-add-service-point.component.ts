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

  @Input('info')
  set setItems(value: any) {
    this.servicePointId = value.service_point_id;
    this.servicePointName = value.service_point_name;
    this.servicePointAbbr = value.service_point_abbr;
    this.localCode = value.local_code;
  }

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('content') public content: any;

  modalReference: NgbModalRef;
  servicePointId: any;
  servicePointName: any;
  localCode: any;
  servicePointAbbr: any;

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
      // size: 'sm',
      // centered: true
    });

    this.modalReference.result.then((result) => { });
  }

  dismiss() {
    this.modalReference.close();
  }

  async save() {
    if (this.servicePointName && this.localCode) {
      try {
        const data: any = {
          servicePointName: this.servicePointName,
          localCode: this.localCode,
          servicePointAbbr: this.servicePointAbbr
        };

        var rs: any;

        if (this.servicePointId) {
          rs = await this.servicePointService.update(this.servicePointId, data);
        } else {
          rs = await this.servicePointService.save(data);
        }

        if (rs.statusCode === 200) {
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
