import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { YoutubePlayerModule } from 'ngx-youtube-player';

import { AdminModule } from './admin/admin.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { LoginModule } from './login/login.module';
import { SharedModule } from './shared/shared.module';

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
    YoutubePlayerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: whitelistedDomains,
        blacklistedRoutes: ['/login']
      }
    }),
    SharedModule,
    AdminModule,
    LoginModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: 'API_URL', useValue: environment.apiUrl },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
