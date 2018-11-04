import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: []
})
export class LayoutComponent implements OnInit {
  isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
