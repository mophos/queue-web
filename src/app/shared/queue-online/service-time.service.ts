import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueueOnlineServiceTimeService {

  token: any;
  httpOptions: any;

  constructor(@Inject('MOPH_QUEUE_URL') private mophQueueUrl: string, private httpClient: HttpClient) {
    this.token = sessionStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }

  async list() {
    const _url = `${this.mophQueueUrl}/queue-online/service-times`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async save(timeStart: any, timeEnd: any, prefix: any, isActive: any = 'Y') {
    const _url = `${this.mophQueueUrl}/queue-online/service-times`;
    const body: any = {
      timeStart: timeStart,
      timeEnd: timeEnd,
      prefix: prefix,
      isActive: isActive
    };
    return this.httpClient.post(_url, body, this.httpOptions).toPromise();
  }

  async update(timeId: any, timeStart: any, timeEnd: any, prefix: any, isActive: any = 'Y') {
    const _url = `${this.mophQueueUrl}/queue-online/service-times/${timeId}`;
    const body: any = {
      timeStart: timeStart,
      timeEnd: timeEnd,
      prefix: prefix,
      isActive: isActive
    };
    return this.httpClient.post(_url, body, this.httpOptions).toPromise();
  }

  async remove(timeId: any) {
    const _url = `${this.mophQueueUrl}/queue-online/service-times/${timeId}`;
    return this.httpClient.delete(_url, this.httpOptions).toPromise();
  }

}
