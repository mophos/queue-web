import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import { PriorityService } from '../priority.service';

@Component({
  selector: 'app-modal-select-priority',
  templateUrl: './modal-select-priority.component.html',
  styles: []
})
export class ModalSelectPriorityComponent implements OnInit {

  @Input() patientName: string;

  @Output('onSelected') onSelected: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content') public content: any;

  modalReference: NgbModalRef;
  priorities: any = [];

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private priorityService: PriorityService
  ) { }

  ngOnInit() { }

  open() {

    this.getList();

    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
      // size: 'lg',
      centered: true
    });

    this.modalReference.result.then((result) => { });

  }

  dismiss() {
    this.modalReference.close();
  }

  async getList() {
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

  async selected(priority: any) {
    if (priority) {
      try {
        this.onSelected.emit(priority);
        this.modalReference.close();
      } catch (error) {
        console.error(error);
        this.alertService.error('เกิดข้อผิดพลาด')
      }
    } else {
      this.alertService.error('กรุณาเลือกประเภทผู้ป่วย');
    }
  }

}
