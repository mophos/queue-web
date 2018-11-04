import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IMqttMessage,
  MqttService
} from 'ngx-mqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-queue-caller',
  templateUrl: './queue-caller.component.html',
  styles: []
})
export class QueueCallerComponent implements OnInit, OnDestroy {


  private subscription: Subscription;
  public message: string;

  constructor(private _mqttService: MqttService) {
    this.subscription = this._mqttService.observe('queue/topic').subscribe((message: IMqttMessage) => {
      this.message = message.payload.toString();
      console.log(this.message);
    });
  }

  public unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() { }

}
