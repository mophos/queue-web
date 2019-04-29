import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { AdminModule } from './admin/admin.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginModule } from './login/login.module';
import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';
import { QueueOnlineModule } from './queue-online/queue-online.module';

import { LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { MomentDateFormatter } from './shared/dateformat';

registerLocaleData(localeTh, 'th');

export function tokenGetter() {
  return sessionStorage.getItem('token');
}

export const whitelistedDomains = [new RegExp('[\s\S]*')] as RegExp[];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: whitelistedDomains,
        blacklistedRoutes: ['/login']
      }
    }),
    SharedModule,
    AdminModule,
    QueueOnlineModule,
    LoginModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: 'API_URL', useValue: environment.apiUrl },
    { provide: 'MOPH_QUEUE_URL', useValue: environment.mophQueueUrl },
    { provide: LOCALE_ID, useValue: 'th' },
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
