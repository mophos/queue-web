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

  doLogin() {
    if (this.username === 'admin' && this.password === 'admin') {
      sessionStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJJQ1QgTU9QSCIsImlhdCI6MTU0MTMxNTgwMywiZXhwIjoxNjA0NDc0MjAzLCJhdWQiOiJpY3QubW9waC5nby50aCIsInN1YiI6InJpYW5waXRAZ21haWwuY29tIiwiZnVsbG5hbWUiOiJTYXRpdCBSaWFucGl0Iiwic2VydmljZVBvaW50SWQiOiIxIiwic2VydmljZVBvaW50TmFtZSI6IuC4nOC4ueC5ieC4m-C5iOC4p-C4ouC4meC4reC4gSJ9.P6H9p_f59XeH6otmpfr7WAtj9v7XvKBVXBZs3lzQxgY')
      this.router.navigate(['/admin']);
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ถูกต้อง');
    }
  }

}
