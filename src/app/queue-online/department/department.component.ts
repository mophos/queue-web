import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';

import { QueueOnlineDepartmentService } from 'src/app/shared/queue-online/queue-online-department.service';
import { QueueOnlineModalAddDepartmentComponent } from 'src/app/shared/queue-online/modal-add-department/modal-add-department.component';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-queue-online-department',
  templateUrl: './department.component.html',
  styles: []
})
export class QueueOnlineDepartmentComponent implements OnInit {

  @ViewChild('mdlAddDepartment') mdlAddDepartment: QueueOnlineModalAddDepartmentComponent;
  items: any = [];

  constructor(private alertService: AlertService, private departmentService: QueueOnlineDepartmentService) { }

  ngOnInit() {
    this.getList();
  }

  openModalNew() {
    this.mdlAddDepartment.open();
  }

  async getList() {
    this.alertService.showLoading();

    try {
      swal.close();
      var rs: any = await this.departmentService.list();
      if (rs.statusCode === 200) {
        this.items = rs.results;
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
      swal.close();
    }
  }

  openEdit(item: any) {
    this.mdlAddDepartment.open(item);
  }

  onSuccess() {
    this.getList();
  }

}
