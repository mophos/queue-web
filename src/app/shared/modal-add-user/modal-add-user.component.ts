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

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('content') public content: any;

  modalReference: NgbModalRef;
  users: any = [];
  info: any = {};

  userType: any;
  userId: any;
  username: any;
  password: any;
  fullname: any;
  isActive: any;
  // servicePointId: any;
  // servicePointsItems: any = [];

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  open(info: any = null) {
    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
      size: 'sm',
      centered: false
    });

    if (info) {
      this.userId = info.user_id;
      this.username = info.username;
      this.fullname = info.fullname;
      this.userType = info.user_type;
      this.isActive = info.is_active || 'N';
    } else {
      this.userId = null;
      this.username = null;
      this.fullname = null;
      this.password = null;
    }

    this.modalReference.result.then((result) => { });
  }

  dismiss() {
    this.modalReference.close();
  }

  async save() {
    if (this.username && this.fullname) {
      try {
        const data: any = {
          username: this.username,
          fullname: this.fullname,
          userType: this.userType,
          isActive: this.isActive || 'N'
        };

        var isError = false;

        if (!this.userId) {
          if (!this.password) {
            isError = true;
          } else {
            isError = false;
          }
        }

        data.password = this.password;

        var rs: any;

        if (!isError) {
          if (this.userId) {
            rs = await this.userService.update(this.userId, data);
          } else {
            rs = await this.userService.save(data);
          }

          if (rs.statusCode === 200) {
            this.modalReference.close();
            this.onSave.emit();
          } else {
            this.alertService.error(rs.message);
          }
        } else {
          this.alertService.error('กรุณากรอกรหัสผ่าน')
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
