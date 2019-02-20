import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServicePointComponent } from './settings/service-point/service-point.component';
import { UserComponent } from './settings/user/user.component';
import { AuthGuardService } from '../shared/auth-guard.service';
import { VisitComponent } from './visit/visit.component';
import { QueueCallerComponent } from './queue-caller/queue-caller.component';
import { QueueCallerDepartmentComponent } from './queue-caller-department/queue-caller-department.component';
import { QueueCenterComponent } from './queue-center/queue-center.component';
import { GenerateTokenComponent } from './settings/generate-token/generate-token.component';
import { DepartmentsComponent } from './settings/departments/departments.component';
import { PriorityComponent } from './settings/priority/priority.component';

const routes: Routes = [
  {
    path: 'admin', component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      // { path: 'dashboard', component: DashboardComponent },
      { path: 'service-point', component: ServicePointComponent },
      { path: 'departments', component: DepartmentsComponent },
      { path: 'priority', component: PriorityComponent },
      { path: 'users', component: UserComponent },
      { path: 'visit', component: VisitComponent },
      { path: 'queue-caller', component: QueueCallerComponent },
      { path: 'queue-caller-department', component: QueueCallerDepartmentComponent },
      { path: 'queue-center', component: QueueCenterComponent },
      { path: 'generate-token', component: GenerateTokenComponent },
      { path: '', redirectTo: 'visit', pathMatch: 'full' },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
