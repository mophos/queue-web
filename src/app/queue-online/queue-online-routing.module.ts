import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueueOnlineLayoutComponent } from './queue-online-layout/queue-online-layout.component';
import { QueueOnlineMainComponent } from './queue-online-main/queue-online-main.component';
import { ServiceTimesComponent } from './service-times/service-times.component';

const routes: Routes = [
  {
    path: 'queue-online', component: QueueOnlineLayoutComponent,
    children: [
      { path: 'main', component: QueueOnlineMainComponent },
      { path: 'service-times', component: ServiceTimesComponent },
      { path: '', redirectTo: 'main', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueueOnlineRoutingModule { }
