import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/shared/alert.service';
import { ModalAddUserComponent } from 'src/app/shared/modal-add-user/modal-add-user.component';
import { UserService } from 'src/app/shared/user.service';
import { ModalUserServicePointsComponent } from 'src/app/shared/modal-user-service-points/modal-user-service-points.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {

  @ViewChild('mdlUser') private mdlUser: ModalAddUserComponent;
  @ViewChild('mdlUserServicePoints') private mdlUserServicePoints: ModalUserServicePointsComponent;

  items: any = [];
  info: any = {};

  userId: any;
  userName: any;

  constructor(private alertService: AlertService, private userService: UserService) { }

  ngOnInit() {
    this.getList();
  }

  openRegister() {
    this.userId = null;
    this.mdlUser.open();
  }

  openEdit(item: any) {
    console.log(item);
    this.mdlUser.open(item);
  }

  openServicePoints(item: any) {
    this.userId = item.user_id;
    this.userName = item.fullname;
    this.mdlUserServicePoints.open(item.user_id);
  }

  onSave(event: any) {
    this.getList();
    this.alertService.success();
  }

  async remove(item: any) {
    let confirm = await this.alertService.confirm(`ต้องการลบ ${item.fullname} ใช่หรือไม่?`);
    if (confirm) {
      try {
        let rs: any = await this.userService.remove(item.user_id);
        if (rs.statusCode === 200) {
          this.alertService.success();
          this.getList();
        } else {
          this.alertService.error(rs.message);
        }
      } catch (error) {
        console.log(error);
        this.alertService.error();
      }
    }
  }

  async getList() {
    try {
      const rs: any = await this.userService.list();
      if (rs.statusCode === 200) {
        this.items = rs.results;
      } else {
        console.log(rs.message);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }


  onSaveServicePoints(event: any) {
    this.userId = null;
    this.userName = null;
  }
}
