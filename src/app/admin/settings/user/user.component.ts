import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/shared/alert.service';
import { ModalAddUserComponent } from 'src/app/shared/modal-add-user/modal-add-user.component';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {

  @ViewChild('mdlUser') private mdlUser: ModalAddUserComponent;

  items: any = [];

  userId: any;

  constructor(private alertService: AlertService, private userService: UserService) { }

  ngOnInit() {
    // this.getList();
  }

  openRegister() {
    this.userId = null;
    this.mdlUser.open();
  }

  openEdit(item: any) {
    this.userId = item.service_point_id;
    this.mdlUser.open();
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
        if (rs.ok) {
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
      if (rs.ok) {
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

}
