import { Component, OnInit } from '@angular/core';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-queue-center',
  templateUrl: './queue-center.component.html',
  styles: []
})
export class QueueCenterComponent implements OnInit {

  items: any = [];

  private subscription: Subscription;
  public message: string;
  constructor(private queueService: QueueService, private alertService: AlertService) {

  }

  public unsafePublish(topic: string, message: string): void {
  }

  public ngOnDestroy() {
  }

  ngOnInit() {
    this.getList();
  }

  async getList() {
    try {
      const rs: any = await this.queueService.getCurrentQueueList();
      if (rs.statusCode === 200) {
        this.items = rs.results;
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

}
