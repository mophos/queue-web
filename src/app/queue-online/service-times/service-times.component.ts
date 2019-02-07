import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalAddServiceTimesComponent } from 'src/app/shared/queue-online/modal-add-service-times/modal-add-service-times.component';
import { AlertService } from 'src/app/shared/alert.service';
import { QueueOnlineServiceTimeService } from 'src/app/shared/queue-online/service-time.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-service-times',
  templateUrl: './service-times.component.html',
  styles: []
})
export class ServiceTimesComponent implements OnInit {
  @ViewChild('mdlAddServiceTime') mdlAddServiceTime: ModalAddServiceTimesComponent;

  items: any = [];
  constructor(private alertService: AlertService, private serviceTimeService: QueueOnlineServiceTimeService) { }

  ngOnInit() {
    this.getList();
  }

  openModalNew() {
    this.mdlAddServiceTime.open();
  }

  async getList() {
    this.alertService.showLoading();

    try {
      swal.close();
      var rs: any = await this.serviceTimeService.list();
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
    this.mdlAddServiceTime.open(item);
  }

}
