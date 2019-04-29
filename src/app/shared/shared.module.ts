import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAddServicePointComponent } from './modal-add-service-point/modal-add-service-point.component';
import { ServicePointService } from './service-point.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ModalAddUserComponent } from './modal-add-user/modal-add-user.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginService } from './login.service';
import { ModalRoomsComponent } from './modal-rooms/modal-rooms.component';
import { ServiceRoomService } from './service-room.service';
import { PriorityService } from './priority.service';
import { QueueService } from './queue.service';
import { ModalSelectServicepointsComponent } from './modal-select-servicepoints/modal-select-servicepoints.component';
import { ShortTimePipe } from './short-time.pipe';
import { ThaiDatePipe } from './thai-date.pipe';
import { TokenService } from './token.service';
import { ToggleFullscreenDirective } from './toggle-fullscreen.directive';
import { ModalUserServicePointsComponent } from './modal-user-service-points/modal-user-service-points.component';
import { DepartmentService } from './department.service';
import { ModalAddDepartmentComponent } from './modal-add-department/modal-add-department.component';
import { ModalAddPriorityComponent } from './modal-add-priority/modal-add-priority.component';
import { ModalSetPrinterComponent } from './modal-set-printer/modal-set-printer.component';
import { ModalSelectPriorityComponent } from './modal-select-priority/modal-select-priority.component';
import { ModalAddServiceTimesComponent } from './queue-online/modal-add-service-times/modal-add-service-times.component';
import { QueueOnlineServiceTimeService } from './queue-online/service-time.service';
import { ServiceTimePipe } from './service-time.pipe';
import { ModalSelectDepartmentComponent } from './modal-select-department/modal-select-department.component';
import { AlertWarningPrinterComponent } from './alert-warning-printer/alert-warning-printer.component';
import { ModalSelectRoomComponent } from './modal-select-room/modal-select-room.component';
import { ModalSettingSoundComponent } from './modal-setting-sound/modal-setting-sound.component';
import { SoundService } from './sound.service';
import { QueueOnlineModalAddDepartmentComponent } from './queue-online/modal-add-department/modal-add-department.component';
import { QueueOnlineServiceSlotService } from './queue-online/queue-online-service-slot.service';
import { QueueOnlineModalAddServiceSlotComponent } from './queue-online/modal-add-service-slot/modal-add-service-slot.component';
import { QueueOnlineService } from './queue-online/queue-online.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule
  ],
  declarations: [
    ModalAddServicePointComponent,
    QueueOnlineModalAddDepartmentComponent,
    QueueOnlineModalAddServiceSlotComponent,
    ModalAddUserComponent,
    ModalRoomsComponent,
    ModalSelectServicepointsComponent,
    ShortTimePipe,
    ThaiDatePipe,
    ServiceTimePipe,
    ToggleFullscreenDirective,
    ModalUserServicePointsComponent,
    ModalAddDepartmentComponent,
    ModalAddPriorityComponent,
    ModalSetPrinterComponent,
    ModalSelectPriorityComponent,
    ModalAddServiceTimesComponent,
    ModalSelectDepartmentComponent,
    AlertWarningPrinterComponent,
    ModalSelectRoomComponent,
    ModalSettingSoundComponent
  ],
  exports: [
    ModalAddServicePointComponent,
    QueueOnlineModalAddDepartmentComponent,
    QueueOnlineModalAddServiceSlotComponent,
    ModalAddUserComponent,
    ModalRoomsComponent,
    ModalSelectServicepointsComponent,
    ModalUserServicePointsComponent,
    ModalAddDepartmentComponent,
    ModalSetPrinterComponent,
    ShortTimePipe,
    ThaiDatePipe,
    ServiceTimePipe,
    ToggleFullscreenDirective,
    ModalAddPriorityComponent,
    ModalSelectPriorityComponent,
    ModalAddServiceTimesComponent,
    ModalSelectDepartmentComponent,
    AlertWarningPrinterComponent,
    ModalSelectRoomComponent,
    ModalSettingSoundComponent
  ],
  providers: [
    ServicePointService,
    ServiceRoomService,
    PriorityService,
    QueueService,
    AuthGuardService,
    LoginService,
    TokenService,
    DepartmentService,
    SoundService,
    QueueOnlineServiceTimeService,
    QueueOnlineServiceSlotService,
    QueueOnlineService
  ]
})
export class SharedModule { }
