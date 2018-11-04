import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-queue',
  templateUrl: './display-queue.component.html',
  styles: []
})
export class DisplayQueueComponent implements OnInit {

  youtubeId = 'qDuKsiwS5xw';
  private player;
  private ytEvent;

  constructor() { }

  ngOnInit() {
  }

  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

}
