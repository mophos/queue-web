import { Component, OnInit, ViewChild } from '@angular/core';
import { QueueOnlineDepartmentService } from 'src/app/shared/queue-online/queue-online-department.service';
import { AlertService } from 'src/app/shared/alert.service';
import { QueueOnlineServiceSlotService } from 'src/app/shared/queue-online/queue-online-service-slot.service';
import { QueueOnlineModalAddServiceSlotComponent } from 'src/app/shared/queue-online/modal-add-service-slot/modal-add-service-slot.component';

import swal from 'sweetalert2';
import { QueueOnlineService } from 'src/app/shared/queue-online/queue-online.service';

@Component({
  selector: 'app-queue-online-time-slots',
  templateUrl: './service-slots.component.html',
  styles: []
})
export class QueueOnlineServiceSlotComponent implements OnInit {

  @ViewChild('mdlAddService') private mdlAddService: QueueOnlineModalAddServiceSlotComponent;

  items: any = [];
  departments: any;
  departmentId: any;
  serviceDate: any;

  constructor(
    private departmentService: QueueOnlineDepartmentService,
    private alertService: AlertService,
    private serviceSlot: QueueOnlineServiceSlotService,
    private queueOnlineService: QueueOnlineService
  ) { }

  ngOnInit() {
    this.getDepartmentList();
    this.getServiceList();
  }

  async getDepartmentList() {
    try {
      var rs: any = await this.departmentService.list();
      if (rs.statusCode === 200) {
        this.departments = rs.results;
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error(error.message);
    }
  }

  async getServiceList() {
    try {
      var rs: any = await this.serviceSlot.list();
      if (rs.statusCode === 200) {
        this.items = rs.results;
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error(error.message);
    }
  }

  async remove(item: any) {
    var serviceSlotId = item.service_slot_id;

    if (serviceSlotId) {
      var confirm = await this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?');
      if (confirm) {
        try {
          var rs: any = await this.serviceSlot.remove(serviceSlotId);
          if (rs.statusCode === 200) {
            this.getServiceList();
          } else {
            this.alertService.error(rs.message);
          }
        } catch (error) {
          console.log(error);
          this.alertService.error(error.message);
        }
      }
    }

  }

  async createQueue(item: any) {
    if (item.service_slot_id) {
      var confirm = await this.alertService.confirm('ต้องการสร้างคิว ใช่หรือไม่?');
      if (confirm) {
        try {
          var rs: any = await this.queueOnlineService.createQueue(item.service_slot_id);
          if (rs.statusCode === 200) {
            this.alertService.success();
            this.getServiceList();
          } else {
            this.alertService.error(rs.message);
          }
        } catch (error) {
          console.log(error);
          this.alertService.error();
        }
      }
    } else {
      this.alertService.error('กรุณาระบุ Slot');
    }
  }

  openService() {
    this.mdlAddService.open();
  }

  openEdit(item: any) {
    this.mdlAddService.open(item);
  }

  async doFilter() {
    console.log(this.serviceDate);
  }

  onSuccess() {
    this.getServiceList();
  }

}
