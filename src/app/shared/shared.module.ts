import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAddServicePointComponent } from './modal-add-service-point/modal-add-service-point.component';
import { ServicePointService } from './service-point.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ModalAddUserComponent } from './modal-add-user/modal-add-user.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginService } from './login.service';

@NgModule({
  declarations: [ModalAddServicePointComponent, ModalAddUserComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule
  ],
  exports: [ModalAddServicePointComponent, ModalAddUserComponent],
  providers: [ServicePointService, AuthGuardService, LoginService]
})
export class SharedModule { }
