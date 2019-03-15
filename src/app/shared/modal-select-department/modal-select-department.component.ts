import { DepartmentService } from './../department.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-modal-select-department',
  templateUrl: './modal-select-department.component.html',
  styles: []
})
export class ModalSelectDepartmentComponent implements OnInit {

  @Output('onSelected') onSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('content') public content: any;
  modalReference: NgbModalRef;

  points: any = [];

  isAll: boolean = false;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private departmentService: DepartmentService
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
    // if (this.isAll) {
    try {
      const rs: any = await this.departmentService.list();
      console.log(rs);

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
    // } else {
    //   // console.log(sessionStorage.getItem('department'));

    //   var _servicePoints = sessionStorage.getItem('servicePoints');
    //   var jsonDecoded = JSON.parse(_servicePoints);

    //   this.points = jsonDecoded
    // }


  }

  setSelected(point: any) {
    if (point) {
      this.modalReference.close();
      this.onSelected.emit(point);
    }
  }


}
