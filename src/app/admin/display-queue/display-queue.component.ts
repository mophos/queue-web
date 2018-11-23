import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalSelectServicepointsComponent } from 'src/app/shared/modal-select-servicepoints/modal-select-servicepoints.component';

@Component({
  selector: 'app-display-queue',
  templateUrl: './display-queue.component.html',
  styles: []
})
export class DisplayQueueComponent implements OnInit {

  @ViewChild('mdlServicePoint') private mdlServicePoint: ModalSelectServicepointsComponent;

  servicePointId: any;
  servicePointName: any;

  constructor() { }

  ngOnInit() {
  }

  selectServicePoint() {
    this.mdlServicePoint.open();
  }

  onSelectedPoint(event: any) {
    console.log(event);
    this.servicePointName = event.service_point_name;
    this.servicePointId = event.service_point_id;
  }

}
