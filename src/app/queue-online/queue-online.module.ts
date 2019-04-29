import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueueOnlineRoutingModule } from './queue-online-routing.module';
import { QueueOnlineMainComponent } from './queue-online-main/queue-online-main.component';
import { QueueOnlineLayoutComponent } from './queue-online-layout/queue-online-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ServiceTimesComponent } from './service-times/service-times.component';
import { QueueOnlineDepartmentComponent } from './department/department.component';
import { QueueOnlineServiceSlotComponent } from './service-slots/service-slots.component';

@NgModule({
  declarations: [
    QueueOnlineMainComponent,
    QueueOnlineLayoutComponent,
    ServiceTimesComponent,
    QueueOnlineDepartmentComponent,
    QueueOnlineServiceSlotComponent],
  imports: [
    CommonModule,
    QueueOnlineRoutingModule,
    NgbModule,
    FormsModule,
    SharedModule,
  ]
})
export class QueueOnlineModule { }
