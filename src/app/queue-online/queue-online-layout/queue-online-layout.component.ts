import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-queue-online-layout',
  templateUrl: './queue-online-layout.component.html',
  styles: []
})
export class QueueOnlineLayoutComponent implements OnInit {

  isCollapsed = true;
  fullname: string;
  userType: string;
  isCollapedSettings = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.fullname = sessionStorage.getItem('fullname');
    this.userType = sessionStorage.getItem('userType');
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('servicePoints');
    this.router.navigate(['/login']);
  }

}
