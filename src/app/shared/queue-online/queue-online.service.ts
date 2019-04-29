import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueueOnlineService {

  token: any;
  httpOptions: any;

  constructor(
    @Inject('MOPH_QUEUE_URL') private mophQueueUrl: string,
    private httpClient: HttpClient
  ) {
    this.token = sessionStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }

  async list() {
    const _url = `${this.mophQueueUrl}/queue-online/queue-online`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async createQueue(serviceSlotId: any) {
    const _url = `${this.mophQueueUrl}/queue-online/queue-online`;
    const body: any = {
      serviceSlotId: serviceSlotId
    };
    return this.httpClient.post(_url, body, this.httpOptions).toPromise();
  }

}
