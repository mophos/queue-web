import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueueOnlineServiceSlotService {

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
    const _url = `${this.mophQueueUrl}/queue-online/service-slots`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async save(departmentId: any, serviceDate: any, totalQueue: any, timeId: any, isActive: any = 'Y') {
    const _url = `${this.mophQueueUrl}/queue-online/service-slots`;
    const body: any = {
      departmentId: departmentId,
      serviceDate: serviceDate,
      timeId: timeId,
      totalQueue: totalQueue,
      isActive: isActive
    };
    return this.httpClient.post(_url, body, this.httpOptions).toPromise();
  }

  async update(serviceSlotId: any, departmentId: any, serviceDate: any, totalQueue: any, timeId: any, isActive: any = 'Y') {
    const _url = `${this.mophQueueUrl}/queue-online/service-slots/${serviceSlotId}`;
    const body: any = {
      departmentId: departmentId,
      serviceDate: serviceDate,
      timeId: timeId,
      totalQueue: totalQueue,
      isActive: isActive
    };
    return this.httpClient.put(_url, body, this.httpOptions).toPromise();
  }

  async remove(serviceSlotId: any) {
    const _url = `${this.mophQueueUrl}/queue-online/service-slots/${serviceSlotId}`;
    return this.httpClient.delete(_url, this.httpOptions).toPromise();
  }


}
