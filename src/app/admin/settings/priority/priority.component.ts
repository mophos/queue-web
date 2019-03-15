import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/shared/alert.service';
import { PriorityService } from 'src/app/shared/priority.service';
import { ModalAddPriorityComponent } from 'src/app/shared/modal-add-priority/modal-add-priority.component';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styles: []
})
export class PriorityComponent implements OnInit {

  @ViewChild('mdlPriority') private mdlPriority: ModalAddPriorityComponent;

  items: any = [];
  info: any = {};

  constructor(private alertService: AlertService, private priorityService: PriorityService) { }

  ngOnInit() {
    this.getList();
  }

  openRegister() {
    this.info = {};
    this.mdlPriority.open();
  }

  openEdit(item: any) {
    this.info = item;
    this.mdlPriority.open();
  }

  onSave(event: any) {
    this.getList();
    this.alertService.success();
  }

  async remove(item: any) {
    let confirm = await this.alertService.confirm(`ต้องการลบ ${item.priority_name} ใช่หรือไม่?`);
    if (confirm) {
      try {
        let rs: any = await this.priorityService.remove(item.priority_id);
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
      const rs: any = await this.priorityService.list();
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
