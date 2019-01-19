import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import { PriorityService } from '../priority.service';

@Component({
  selector: 'app-modal-add-priority',
  templateUrl: './modal-add-priority.component.html',
  styles: []
})
export class ModalAddPriorityComponent implements OnInit {

  @Input('info')
  set setItems(value: any) {
    this.priorityName = value.priority_name;
    this.priorityId = value.priority_id;
    this.priorityPrefix = value.priority_prefix;
  }

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content') public content: any;

  modalReference: NgbModalRef;
  priorityId: any;
  priorityName: any;
  priorityPrefix: any;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private priorityService: PriorityService) { }

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
    if (this.priorityName && this.priorityPrefix) {
      try {
        const data: any = {
          priorityName: this.priorityName,
          priorityPrefix: this.priorityPrefix.toUpperCase()
        };

        var rs: any;

        if (this.priorityId) {
          rs = await this.priorityService.update(this.priorityId, data);
        } else {
          rs = await this.priorityService.save(data);
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
