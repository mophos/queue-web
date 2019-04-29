import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueueOnlineLayoutComponent } from './queue-online-layout/queue-online-layout.component';
import { QueueOnlineMainComponent } from './queue-online-main/queue-online-main.component';
import { ServiceTimesComponent } from './service-times/service-times.component';
import { QueueOnlineDepartmentComponent } from './department/department.component';
import { QueueOnlineServiceSlotComponent } from './service-slots/service-slots.component';

const routes: Routes = [
  {
    path: 'queue-online', component: QueueOnlineLayoutComponent,
    children: [
      { path: 'main', component: QueueOnlineMainComponent },
      { path: 'service-times', component: ServiceTimesComponent },
      { path: 'department', component: QueueOnlineDepartmentComponent },
      { path: 'service-slots', component: QueueOnlineServiceSlotComponent },
      { path: '', redirectTo: 'main', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueueOnlineRoutingModule { }
