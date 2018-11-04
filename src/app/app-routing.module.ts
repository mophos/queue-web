import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayQueueComponent } from './admin/display-queue/display-queue.component';
import { QueueCallerComponent } from './admin/queue-caller/queue-caller.component';
import { AuthGuardService } from './shared/auth-guard.service';
import { QueueCenterComponent } from './admin/queue-center/queue-center.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'display-queue', component: DisplayQueueComponent, canActivate: [AuthGuardService] },
  { path: 'queue-caller', component: QueueCallerComponent, canActivate: [AuthGuardService] },
  { path: 'queue-center', component: QueueCenterComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
