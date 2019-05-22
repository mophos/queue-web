import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  hn = true;
  tabServicePoint = false;
  tabProfile = true;
  servicePointList = [1, 2, 3]
  constructor() { }

  ngOnInit() {
  }


  onSelectServicePointList() {
    this.tabServicePoint = true;
    this.tabProfile = false;
  }

  cancel() {
    this.tabServicePoint = false;
    this.tabProfile = true;
  }
}
