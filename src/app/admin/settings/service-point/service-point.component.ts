import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalAddServicePointComponent } from 'src/app/shared/modal-add-service-point/modal-add-service-point.component';
import { AlertService } from 'src/app/shared/alert.service';
import { ServicePointService } from 'src/app/shared/service-point.service';

@Component({
  selector: 'app-service-point',
  templateUrl: './service-point.component.html',
  styles: []
})
export class ServicePointComponent implements OnInit {

  @ViewChild('mdlServicePoint') private mdlServicePoint: ModalAddServicePointComponent;

  items: any = [];

  servicePointId: any;
  servicePointName: any;

  constructor(private alertService: AlertService, private servicePointService: ServicePointService) { }

  ngOnInit() {
    // this.getList();
  }

  openRegister() {
    this.servicePointId = null;
    this.servicePointName = null;
    this.mdlServicePoint.open();
  }

  openEdit(item: any) {
    this.servicePointId = item.service_point_id;
    this.servicePointName = item.service_point_name;
    this.mdlServicePoint.open();
  }

  onSave(event: any) {
    this.getList();
    this.alertService.success();
  }

  async remove(item: any) {
    let confirm = await this.alertService.confirm(`ต้องการลบ ${item.service_point_name} ใช่หรือไม่?`);
    if (confirm) {
      try {
        let rs: any = await this.servicePointService.remove(item.service_point_id);
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
      const rs: any = await this.servicePointService.list();
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
