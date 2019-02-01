import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-queue-online-main',
  templateUrl: './queue-online-main.component.html',
  styles: []
})
export class QueueOnlineMainComponent implements OnInit {

  items = [];
  total = 0;
  pageSize = 20;

  constructor() { }

  ngOnInit() {
  }

}
