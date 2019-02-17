import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownModule } from 'ngx-countdown';
import { ClipboardModule } from 'ngx-clipboard';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DisplayQueueComponent } from './display-queue/display-queue.component';
import { QueueCallerComponent } from './queue-caller/queue-caller.component';
import { ServicePointComponent } from './settings/service-point/service-point.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './settings/user/user.component';
import { QueueCenterComponent } from './queue-center/queue-center.component';
import { VisitComponent } from './visit/visit.component';
import { QueueCenterPatientComponent } from './queue-center-patient/queue-center-patient.component';
import { GenerateTokenComponent } from './settings/generate-token/generate-token.component';
import { DepartmentsComponent } from './settings/departments/departments.component';
import { PriorityComponent } from './settings/priority/priority.component';
import { DisplayQueueDepartmentComponent } from './display-queue-department/display-queue-department.component';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    DisplayQueueComponent,
    QueueCallerComponent,
    ServicePointComponent,
    UserComponent,
    QueueCenterComponent,
    VisitComponent,
    QueueCenterPatientComponent,
    GenerateTokenComponent,
    DepartmentsComponent,
    PriorityComponent,
    DisplayQueueDepartmentComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ClipboardModule,
    CountdownModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
