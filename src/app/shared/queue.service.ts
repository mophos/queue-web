import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  token: any;
  httpOptions: any;

  constructor(@Inject('API_URL') private apiUrl: string, private httpClient: HttpClient) {
    this.token = sessionStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }

  async printQueueGateway(queueId: any, topic: any) {
    const _url = `${this.apiUrl}/print/queue/prepare/print`;
    return this.httpClient.post(_url, {
      queueId: queueId,
      topic: topic
    }, this.httpOptions).toPromise();
  }

  async visitList(servicePointCode: any, query: any, limit: number = 20, offset: number = 0) {
    const _url = `${this.apiUrl}/queue/his-visit?servicePointCode=${servicePointCode}&query=${query}&limit=${limit}&offset=${offset}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async changeRoom(queueId: any, roomId: any, servicePointId: any, roomNumber: any, queueNumber: any) {
    const _url = `${this.apiUrl}/queue/change-room`;
    return this.httpClient.post(_url, {
      roomId: roomId,
      queueId: queueId,
      servicePointId: servicePointId,
      queueNumber: queueNumber,
      roomNumber: roomNumber
    }, this.httpOptions).toPromise();
  }

  async getWaiting(servicePointId: any, limit: number = 20, offset: number = 0) {
    const _url = `${this.apiUrl}/queue/waiting/${servicePointId}?limit=${limit}&offset=${offset}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async getQueueByDepartment(departmentId: any, limit: number = 20, offset: number = 0) {
    const _url = `${this.apiUrl}/queue/department/${departmentId}?limit=${limit}&offset=${offset}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async markInterview(queueId: any) {
    const _url = `${this.apiUrl}/queue/interview/marked/${queueId}`;
    return this.httpClient.put(_url, {}, this.httpOptions).toPromise();
  }

  async getWorking(servicePointId: any) {
    const _url = `${this.apiUrl}/queue/working/${servicePointId}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async getWorkingHistory(servicePointId: any) {
    const _url = `${this.apiUrl}/queue/working/history/${servicePointId}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async getPending(servicePointId: any) {
    const _url = `${this.apiUrl}/queue/pending/${servicePointId}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async markPending(queueId: any, servicePointId: any, priorityId: any) {
    const _url = `${this.apiUrl}/queue/pending`;
    return this.httpClient.post(_url, {
      queueId: queueId,
      servicePointId: servicePointId,
      priorityId: priorityId
    }, this.httpOptions).toPromise();
  }

  async markCancel(queueId: any) {
    const _url = `${this.apiUrl}/queue/cancel/${queueId}`;
    return this.httpClient.delete(_url, this.httpOptions).toPromise();
  }

  async callQueue(servicePointId: any, queueNumber: any, roomId: any, roomNumber: any, queueId: any, isCompleted: any = 'Y') {
    const _url = `${this.apiUrl}/queue/caller/${queueId}`;
    return this.httpClient.post(_url, {
      servicePointId: servicePointId,
      queueNumber: queueNumber,
      roomNumber: roomNumber,
      roomId: roomId,
      isCompleted: isCompleted
    }, this.httpOptions).toPromise();
  }

  async register(data: any) {
    const _url = `${this.apiUrl}/queue/register`;
    return this.httpClient.post(_url, {
      hn: data.hn,
      vn: data.vn,
      clinicCode: data.clinicCode,
      priorityId: data.priorityId,
      dateServ: data.dateServ,
      timeServ: data.timeServ,
      hisQueue: data.hisQueue,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      birthDate: data.birthDate,
      sex: data.sex,
    }, this.httpOptions).toPromise();
  }

  async getCurrentQueueList() {
    const _url = `${this.apiUrl}/queue/current-list`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

}
