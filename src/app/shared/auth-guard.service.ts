import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private router: Router) { }

  canActivate() {
    let token = sessionStorage.getItem('token');

    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.router.navigateByUrl('/login');
      } else {
        return true;
      }
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

}
