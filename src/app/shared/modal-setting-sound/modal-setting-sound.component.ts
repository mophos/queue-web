import { SoundService } from './../sound.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import * as _ from 'lodash';
import { Howl, Howler } from 'howler';
@Component({
  selector: 'app-modal-setting-sound',
  templateUrl: './modal-setting-sound.component.html',
  styles: []
})
export class ModalSettingSoundComponent implements OnInit {

  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('content') public content: any;

  @Input('servicePointId')
  set setServicePointId(value: any) {
    this.servicePointId = value;
  }

  @Input('roomId')
  set setRoomId(value: any) {
    this.roomId = value;
  }

  @Input('tabSpeed')
  set setTabSpeed(value: any) {
    this.tabSpeed = value;
  }

  modalReference: NgbModalRef;
  sounds = [];
  soundId: any;
  servicePointId: any;
  roomId: any;
  speed = 1;
  tabSpeed = true;
  // selectSound: any;

  // isAll = false;

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private soundService: SoundService

  ) { }

  async ngOnInit() {
    await this.getSoundList();
  }

  async getSoundList() {
    const rs: any = await this.soundService.list();
    if (rs.statusCode === 200) {
      this.sounds = rs.results;
    }

  }

  playSound(sound) {
    const audioFiles = './assets/audio/' + sound.sound_file;
    const howlerBank = (new Howl({
      src: audioFiles,
      // onend: onEnd,
      preload: true,
      html5: true,
    }));
    howlerBank.rate(this.speed);
    howlerBank.play();
  }

  open(item) {
    this.modalReference = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
      // size: 'sm',
      // centered: true
    });
    if (item.sound_id == null) {
      if (item.service_point_sound_id != null) {
        this.soundId = item.service_point_sound_id;
      }
    } else {
      this.soundId = item.sound_id;
    }
    this.speed = item.sound_speed;
    this.modalReference.result.then((result) => { });
  }

  dismiss() {
    this.modalReference.close();
  }

  async save() {
    try {
      if (this.roomId) {
        await this.soundService.saveRoom(this.roomId, this.soundId);
      } else {
        await this.soundService.save(this.servicePointId, this.soundId, this.speed);
      }
      this.onSave.emit(this.soundId);
      this.modalReference.close();
    } catch (error) {
      this.alertService.serverError();
    }

  }

  changeSpeed(speed) {
    this.speed = +speed;
  }

}
