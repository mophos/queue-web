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

  modalReference: NgbModalRef;
  sounds = [];
  soundId: any;
  servicePointId: any;
  speed = 1;
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
    console.log(audioFiles);
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
    this.soundId = item.sound_id;
    this.speed = item.sound_speed;
    this.modalReference.result.then((result) => { });
  }

  dismiss() {
    this.modalReference.close();
  }

  async save() {
    try {
      await this.soundService.save(this.servicePointId, this.soundId, this.speed);
      this.onSave.emit();
      this.modalReference.close();
    } catch (error) {
      this.alertService.serverError();
    }

  }

  changeSpeed(speed) {
    this.speed = +speed;
  }

}
