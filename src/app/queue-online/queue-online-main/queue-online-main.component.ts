import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-queue-online-main',
  templateUrl: './queue-online-main.component.html',
  styles: []
})
export class QueueOnlineMainComponent implements OnInit {

  query: any;
  servicePoints: any = [];
  items = [];
  total = 0;
  pageSize = 20;

  constructor() { }

  ngOnInit() {
  }

  doSearch(event: any) { }

  getVisit() { }

  changeServicePoints(event: any) { }

}
