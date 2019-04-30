import { Component, OnInit } from '@angular/core';
import { QueueService } from 'src/app/shared/queue.service';
import { AlertService } from 'src/app/shared/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-display-queue',
  templateUrl: './display-queue.component.html',
  styles: []
})
export class DisplayQueueComponent implements OnInit {

  template1 = false;
  template2 = false;
  template3 = false;
  template = 'template1';
  constructor(
    private queueService: QueueService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.template1 = sessionStorage.getItem('template1') === 'Y' ? true : false;
    this.template2 = sessionStorage.getItem('template2') === 'Y' ? true : false;
    this.template3 = sessionStorage.getItem('template3') === 'Y' ? true : false;
    if (!this.template1 && !this.template2 && !this.template3) {
      this.template1 = true;
    }
    console.log(this.template1);
    console.log(this.template2);
    console.log(this.template3);

  }

  async ngOnInit() {
    // this.changeTemplate('template1');

  }

  changeTemplate(template) {
    this.template1 = false;
    this.template2 = false;
    this.template3 = false;
    sessionStorage.setItem('template1', 'N');
    sessionStorage.setItem('template2', 'N');
    sessionStorage.setItem('template3', 'N');
    if ('template1' === template.target.value) {
      this.template1 = true;
      sessionStorage.setItem('template1', 'Y');
    } else if ('template2' === template.target.value) {
      this.template2 = true;
      sessionStorage.setItem('template2', 'Y');
    } else if ('template3' === template.target.value) {
      this.template3 = true;
      sessionStorage.setItem('template3', 'Y');
    }
    this.router.navigate(['/display-queue']);
  }

}
