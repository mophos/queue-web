import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { AlertService } from '../shared/alert.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
    .auth form .form-group .form-control {
      font-size: 1.3rem;
    }
    `
  ]
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  hosname: string;
  hoscode: string;
  // topic: string;

  jwtHelper = new JwtHelperService();

  constructor(
    private loginService: LoginService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getInfo();
  }

  async doLogin() {
    if (this.username && this.password) {
      try {
        const rs: any = await this.loginService.doLogin(this.username, this.password);
        if (rs.token) {
          const token = rs.token;
          sessionStorage.setItem('token', token);
          const decoded: any = this.jwtHelper.decodeToken(token);
          sessionStorage.setItem('fullname', decoded.fullname);
          sessionStorage.setItem('userType', decoded.userType);
          sessionStorage.setItem('username', this.username);
          sessionStorage.setItem('servicePoints', JSON.stringify(rs.servicePoints));
          if (decoded.userType === 'KIOSK') {
            this.router.navigate(['/kiosk']);
          } else {
            this.router.navigate(['/admin']);
          }
        } else {
          const message = rs.message || 'เกิดข้อผิดพลาด';
          this.alertService.error(message);
        }
      } catch (error) {
        console.log(error);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } else {
      this.alertService.error('เกิดข้อผิดพลาด');
    }

  }

  async getInfo() {
    try {
      const rs: any = await this.loginService.getInfo();
      if (rs.info) {
        // sessionStorage.setItem('topic', rs.info.topic);
        sessionStorage.setItem('hoscode', rs.info.hoscode);
        sessionStorage.setItem('hosname', rs.info.hosname);

        this.hoscode = rs.info.hoscode;
        this.hosname = rs.info.hosname;
      } else {
        const message = rs.message || 'เกิดข้อผิดพลาด';
        this.alertService.error(message);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error('เกิดข้อผิดพลาด');
    }
  }

}
