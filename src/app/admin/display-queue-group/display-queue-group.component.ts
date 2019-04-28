import { Component, OnInit, ViewChild, NgZone, Inject, OnDestroy, Directive, HostListener } from '@angular/core';
import { ModalSelectServicepointsComponent } from 'src/app/shared/modal-select-servicepoints/modal-select-servicepoints.component';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import * as mqttClient from '../../../vendor/mqtt';
import { MqttClient } from 'mqtt';
import * as _ from 'lodash';
import * as Random from 'random-js';
import { Howl, Howler } from 'howler';
import { CountdownComponent } from 'ngx-countdown';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-display-queue-group',
  templateUrl: './display-queue-group.component.html',
  styles: [
    `
    .main-panel {
        transition: width 0.25s ease, margin 0.25s ease;
        width: 100%;
        min-height: calc(100vh - 70px);
        display: flex;
        flex-direction: column;
    }
    
    .bg-primary, .settings-panel .color-tiles .tiles.primary {
        background-color: #01579b !important;
    }

    .bg-blue, .settings-panel .color-tiles .tiles.danger {
        background-color: #1a237e !important;
    }

    `

  ]
})
export class DisplayQueueGroupComponent implements OnInit, OnDestroy {

  @ViewChild('mdlServicePoint') private mdlServicePoint: ModalSelectServicepointsComponent;
  @ViewChild(CountdownComponent) counter: CountdownComponent;

  jwtHelper = new JwtHelperService();
  groupTopic = null;

  servicePointId: any;
  servicePointName: any;
  workingItems: any = [];
  _workingItems: any = [];
  workingItemsHistory: any = [];

  isOffline = false;

  client: MqttClient;
  notifyUser = null;
  notifyPassword = null;

  isSound = true;
  isPlayingSound = false;

  playlists: any = [];
  notifyUrl: string;
  token: string;

  hide = false;
  soundFile: any;
  soundSpeed: any;
  speakSingle = true;

  constructor(
    private queueService: QueueService,
    private alertService: AlertService,
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.route.queryParams
      .subscribe(params => {
        this.token = params.token || null;
        this.servicePointId = +params.servicePointId || null;
        this.servicePointName = params.servicePointName || null;
      });
  }

  async ngOnInit() {
    try {
      const token = this.token || sessionStorage.getItem('token');

      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);

        this.groupTopic = decodedToken.GROUP_TOPIC;
        this.notifyUrl = `ws://${decodedToken.NOTIFY_SERVER}:${+decodedToken.NOTIFY_PORT}`;
        this.notifyUser = decodedToken.NOTIFY_USER;
        this.notifyPassword = decodedToken.NOTIFY_PASSWORD;
        this.speakSingle = decodedToken.SPEAK_SINGLE === 'Y' ? true : false;

        const _servicePoints = sessionStorage.getItem('servicePoints');
        const jsonDecodedServicePoint = JSON.parse(_servicePoints);

        if (jsonDecodedServicePoint.length === 1) {
          this.onSelectedPoint(jsonDecodedServicePoint[0]);
        }

        if (this.servicePointId && this.servicePointName) {
          this.onSelectedPoint({ 'service_point_id': this.servicePointId, 'service_point_name': this.servicePointName });
          this.initialSocket();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


  public unsafePublish(topic: string, message: string): void {
    try {
      this.client.end(true);
    } catch (error) {
      console.log(error);
    }
  }

  public ngOnDestroy() {
    try {
      this.client.end(true);
    } catch (error) {
      console.log(error);
    }
  }

  toggleSound() {
    this.isSound = !this.isSound;
  }

  async prepareSound() {
    if (!this.isPlayingSound) {
      if (this.playlists.length) {
        const queueNumber = this.playlists[0].queueNumber;
        const roomNumber = this.playlists[0].roomNumber;
        let arrQueueNumber = Array.isArray(queueNumber) ? queueNumber : [queueNumber]
        await this.playSound(arrQueueNumber, roomNumber);
      }
    }
  }

  async playSound(strQueue: any, strRoomNumber: string) {

    this.isPlayingSound = true;

    let _queue = _.cloneWith(_.map(strQueue, (v: any) => { return v.toString().replace(' ', '') }));
    _queue = _.map(_queue, (v: any) => { return v.toString().replace('-', '') })

    const _strQueue = _.map(_queue, (v: any) => { return v.split('') });
    const _strRoom = strRoomNumber.split('');

    const audioFiles = [];

    audioFiles.push('./assets/audio/please.mp3')
    // audioFiles.push('./assets/audio/silent.mp3')

    _strQueue.forEach((v: any) => {
      v.forEach((z: any) => {
        audioFiles.push(`./assets/audio/${z}.mp3`);
      });
    });

    if (this.soundFile) {
      audioFiles.push(`./assets/audio/${this.soundFile}`);
    } else {
      audioFiles.push('./assets/audio/channel.mp3');
    }

    if (this.speakSingle) {
      _strRoom.forEach(v => {
        audioFiles.push(`./assets/audio/${v}.mp3`);
      });
    } else {
      try {
        if (_strRoom.length === 2) {
          var _roomNumber = +strRoomNumber;
          if (_roomNumber >= 30) {
            audioFiles.push(`./assets/audio/${_strRoom[0]}.mp3`);
            audioFiles.push(`./assets/audio/10.mp3`);
          } else if (_roomNumber >= 20) {
            audioFiles.push(`./assets/audio/20.mp3`);
          } else {
            audioFiles.push(`./assets/audio/10.mp3`);
          }

          if (+_strRoom[1] === 1) {
            audioFiles.push(`./assets/audio/11.mp3`);
          } else if (+_strRoom[1] > 0) {
            audioFiles.push(`./assets/audio/${_strRoom[1]}.mp3`);
          }

        } else {
          audioFiles.push(`./assets/audio/${_strRoom[0]}.mp3`);
        }
      } catch (error) {
        console.log('Not numeric!');
      }
    }

    audioFiles.push('./assets/audio/ka.mp3');

    const howlerBank = [];

    // console.log(audioFiles);

    const loop = false;

    const onPlay = [false];
    let pCount = 0;
    const that = this;

    const onEnd = function (e) {

      if (loop) {
        pCount = (pCount + 1 !== howlerBank.length) ? pCount + 1 : 0;
      } else {
        pCount = pCount + 1;
      }

      if (pCount <= audioFiles.length - 1) {

        if (!howlerBank[pCount].playing()) {
          howlerBank[pCount].play();
        } else {
          howlerBank[pCount].stop();
          howlerBank[pCount].unload();
          howlerBank[pCount].play();
        }

      } else {
        this.isPlayingSound = false;
        // remove queue in playlist
        const idx = _.findIndex(that.playlists, { queueNumber: strQueue, roomNumber: strRoomNumber });
        if (idx > -1) that.playlists.splice(idx, 1);
        // call sound again
        setTimeout(() => {
          that.isPlayingSound = false;
          that.prepareSound();
        }, 1000);
      }
    };

    for (let i = 0; i < audioFiles.length; i++) {
      howlerBank.push(new Howl({
        src: [audioFiles[i]],
        onend: onEnd,
        preload: true,
        html5: true,
      }));
      if (this.soundSpeed) {
        howlerBank[i].rate(this.soundSpeed);
      }
    }

    try {

      await this._workingItems.shift()
      this.workingItems = await _.cloneDeep(this._workingItems[0])
      await howlerBank[0].play();
    } catch (error) {
      console.log(error);
    }

  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  connectWebSocket() {
    const rnd = new Random();
    const username = sessionStorage.getItem('username');
    const strRnd = rnd.integer(1111111111, 9999999999);
    const clientId = `${username}-${strRnd}`;

    try {
      this.client = mqttClient.connect(this.notifyUrl, {
        clientId: clientId,
        username: this.notifyUser,
        password: this.notifyPassword
      });
    } catch (error) {
      console.log(error);
    }

    const topic = `${this.groupTopic}/${this.servicePointId}`;

    const that = this;

    this.client.on('message', (topic, payload) => {
      that.getCurrentQueue();
      that.getWorkingHistory();
      try {
        const _payload = JSON.parse(payload.toString());
        if (that.isSound) {
          if (+that.servicePointId === +_payload.servicePointId) {
            // play sound
            const queueNumber = Array.isArray(_payload.queueNumber) ? _payload.queueNumber : [_payload.queueNumber]
            const sound = { queueNumber: queueNumber, roomNumber: _payload.roomNumber.toString() };
            that.playlists.push(sound);
            that.prepareSound();
          }
        }
      } catch (error) {
        console.log(error);
      }

    });

    this.client.on('connect', () => {
      console.log('Connected!');
      that.zone.run(() => {
        that.isOffline = false;
      });

      that.client.subscribe(topic, { qos: 0 }, (error) => {
        if (error) {
          that.zone.run(() => {
            that.isOffline = true;
            try {
              that.counter.restart();
            } catch (error) {
              console.log(error);
            }
          });
        }
      });
    });

    this.client.on('close', () => {
      console.log('MQTT Conection Close');
    });

    this.client.on('error', (error) => {
      console.log('MQTT Error');
      that.zone.run(() => {
        that.isOffline = true;
        that.counter.restart();
      });
    });

    this.client.on('offline', () => {
      console.log('MQTT Offline');
      that.zone.run(() => {
        that.isOffline = true;
        try {
          that.counter.restart();
        } catch (error) {
          console.log(error);
        }
      });
    });
  }

  selectServicePoint() {
    this.mdlServicePoint.open();
  }

  async onSelectedPoint(event: any) {
    this.servicePointName = event.service_point_name;
    this.servicePointId = event.service_point_id;
    if (event.sound_file) {
      this.soundFile = event.sound_file;
      this.soundSpeed = event.sound_speed;
    } else {
      await this.getSound(this.servicePointId);
    }
    this.initialSocket();
  }

  async getSound(servicePointId) {
    try {
      const rs: any = await this.queueService.getSound(servicePointId, this.token);
      if (rs.statusCode === 200) {
        this.soundFile = rs.results[0].sound_file;
        this.soundSpeed = rs.results[0].sound_speed;
      }
    } catch (error) {
      console.log(error);
      this.alertService.error(error);
    }
  }

  async initialSocket() {
    // connect mqtt
    this.connectWebSocket();
    this._workingItems = [];
    await this.getCurrentQueue();
    this._workingItems.length === 1 ? this.workingItems = await _.cloneDeep(this._workingItems[0]) : '';
    this.getWorkingHistory();
  }

  async getCurrentQueue() {
    try {
      const rs: any = await this.queueService.getWorkingGroup(this.servicePointId, this.token);
      if (rs.statusCode === 200) {
        if (this.isSound) {
          await this._workingItems.push(_.cloneDeep(rs.results));
          if (this._workingItems != this.workingItems) this.workingItems = await _.cloneDeep(this._workingItems[0])
        } else {
          this.workingItems = _.cloneDeep(rs.results)
        }
        const arr = _.sortBy(rs.results, ['update_date']).reverse();
        if (arr.length <= 0) this._workingItems = []
      } else {
        console.log(rs.message);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }

  async getWorkingHistory() {
    try {
      const rs: any = await this.queueService.getWorkingHistoryGroup(this.servicePointId, this.token);
      if (rs.statusCode === 200) {
        this.workingItemsHistory = rs.results;
      } else {
        console.log(rs.message);
        this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }

}
