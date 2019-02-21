import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-modal-select-room',
  templateUrl: './modal-select-room.component.html',
  styles: []
})
export class ModalSelectRoomComponent implements OnInit {

  @Output('onSelected') onSelected: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content') public content: any;

  @Input('rooms')
  set setRooms(value: any) {
    this.rooms = value;
  }

  modalReference: NgbModalRef;

  roomId: any;

  rooms: any = [];

  isAll = false;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService

  ) { }

  ngOnInit() { }

  setList(rooms) {
    this.rooms = rooms;
  }

  open(isAll: boolean = false) {
    console.log(this.rooms);
    this.roomId = this.rooms[0].room_id;
    this.isAll = isAll;

    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
      // size: 'lg',
      // centered: true
    });

    this.modalReference.result.then((result) => { });
  }

  dismiss() {
    this.modalReference.close();
  }

  selectRoom() {
    if (this.roomId) {
      const idx = _.findIndex(this.rooms, { 'room_id': this.roomId });
      this.modalReference.close();
      this.onSelected.emit({ roomId: this.roomId, roomNumber: this.rooms[idx].room_number });
    } else {
      this.alertService.error('กรุณาเลือกห้อง');
    }
  }

}
