import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styles: []
})
export class ModalAddUserComponent implements OnInit {

  @Input('userId')
  set setId(value: any) {
    this.userId = value;
  }

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('content') public content: any;

  modalReference: NgbModalRef;
  userId: any;
  username: any;
  password: any;
  fullname: any;
  servicePointId: any;
  servicePointsItems: any = [];

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private userService: UserService) { }

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

  async getServicePoints() {
    this.servicePointsItems = [];
  }

  async save() {
    if (this.username && this.fullname && this.servicePointId) {
      try {
        const data: any = {
          username: this.username,
          servicePoint: this.servicePointId,
          fullname: this.fullname
        };

        if (!this.userId) {
          data.password = this.password;
        }

        var rs: any;

        if (this.userId) {
          rs = await this.userService.update(this.userId, data);
        } else {
          rs = await this.userService.save(data);
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
