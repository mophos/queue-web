import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { AlertService } from '../shared/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(
    private loginService: LoginService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async doLogin() {
    if (this.username && this.password) {
      try {
        const rs: any = await this.loginService.doLogin(this.username, this.password);
        if (rs.token) {
          const token = rs.token;
          sessionStorage.setItem('token', token);
          this.router.navigate(['/admin']);
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

}
