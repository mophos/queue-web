import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-modal-add-department',
  templateUrl: './modal-add-department.component.html',
  styles: []
})
export class ModalAddDepartmentComponent implements OnInit {

  @Input('info')
  set setItems(value: any) {
    this.departmentName = value.department_name;
    this.departmentId = value.department_id;
  }

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content') public content: any;

  modalReference: NgbModalRef;
  departmentId: any;
  departmentName: any;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private departmentService: DepartmentService) { }

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
    if (this.departmentName) {
      try {
        const data: any = {
          departmentName: this.departmentName,
        };

        var rs: any;

        if (this.departmentId) {
          rs = await this.departmentService.update(this.departmentId, data);
        } else {
          rs = await this.departmentService.save(data);
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
