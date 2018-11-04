import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServicePointComponent } from './settings/service-point/service-point.component';
import { UserComponent } from './settings/user/user.component';
import { AuthGuardService } from '../shared/auth-guard.service';

const routes: Routes = [
  {
    path: 'admin', component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'service-point', component: ServicePointComponent },
      { path: 'users', component: UserComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
