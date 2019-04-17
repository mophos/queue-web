import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [
    `
    .main-panel2 {
        transition: width 0.25s ease, margin 0.25s ease;
        min-height: calc(100vh - 70px);
        display: flex;
        flex-direction: column;
    }
    `
  ]
})
export class LayoutComponent implements OnInit {
  isCollapsed = true;
  fullname: string;
  userType: string;
  openSidebar: boolean = false;
  hideSidebar: boolean = false;
  isCollapedDisplay: boolean = true;
  isCollapedCaller: boolean = true;
  isCollapedSettings: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.fullname = sessionStorage.getItem('fullname');
    this.userType = sessionStorage.getItem('userType');
  }

  toggleSidebar() {
    this.openSidebar = !this.openSidebar;
  }

  toggleHideSidebar() {
    this.hideSidebar = !this.hideSidebar;
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
