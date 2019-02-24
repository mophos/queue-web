import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import { ServicePointService } from '../service-point.service';

@Component({
  selector: 'app-modal-select-servicepoints',
  templateUrl: './modal-select-servicepoints.component.html',
  styles: []
})
export class ModalSelectServicepointsComponent implements OnInit {

  @Output('onSelected') onSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('content') public content: any;
  modalReference: NgbModalRef;

  points: any = [];

  isAll: boolean = false;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private servicePointService: ServicePointService
  ) { }

  ngOnInit() { }

  open(isAll: boolean = false) {

    this.isAll = isAll;
    this.getList();

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

  setSelected(point: any) {
    if (point) {
      this.modalReference.close();
      this.onSelected.emit(point);
    }
  }


}
