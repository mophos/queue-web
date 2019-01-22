import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/shared/alert.service';
import { DepartmentService } from 'src/app/shared/department.service';
import { ModalAddDepartmentComponent } from 'src/app/shared/modal-add-department/modal-add-department.component';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styles: []
})
export class DepartmentsComponent implements OnInit {

  @ViewChild('mdlDepartment') private mdlDepartment: ModalAddDepartmentComponent;

  items: any = [];
  info: any = {};

  constructor(private alertService: AlertService, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.getList();
  }

  openRegister() {
    this.info = {};
    this.mdlDepartment.open();
  }

  openEdit(item: any) {
    this.info = item;
    this.mdlDepartment.open();
  }

  onSave(event: any) {
    this.getList();
    this.alertService.success();
  }

  async remove(item: any) {
    let confirm = await this.alertService.confirm(`ต้องการลบ ${item.department_name} ใช่หรือไม่?`);
    if (confirm) {
      try {
        let rs: any = await this.departmentService.remove(item.department_id);
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
      const rs: any = await this.departmentService.list();
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

}
