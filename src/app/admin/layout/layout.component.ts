import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: []
})
export class LayoutComponent implements OnInit {
  isCollapsed = true;
  fullname: string;
  userType: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.fullname = sessionStorage.getItem('fullname');
    this.userType = sessionStorage.getItem('userType');
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
