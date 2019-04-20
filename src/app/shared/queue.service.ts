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

  async printQueueGateway(queueId: any, topic: any, printSmallQueue: any) {
    const _url = `${this.apiUrl}/print/queue/prepare/print`;
    return this.httpClient.post(_url, {
      queueId: queueId,
      topic: topic,
      printSmallQueue: printSmallQueue
    }, this.httpOptions).toPromise();
  }

  async visitList(servicePointCode: any, query: any, limit: number = 20, offset: number = 0) {
    const _url = `${this.apiUrl}/queue/his-visit?servicePointCode=${servicePointCode}&query=${query}&limit=${limit}&offset=${offset}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async changeRoomGroup(queueId: any, roomId: any, servicePointId: any, roomNumber: any, queueNumber: any, queueRunning: any) {
    const _url = `${this.apiUrl}/queue/change-room-group`;
    return this.httpClient.post(_url, {
      roomId: roomId,
      queueId: queueId,
      servicePointId: servicePointId,
      queueNumber: queueNumber,
      roomNumber: roomNumber,
      queueRunning: queueRunning
    }, this.httpOptions).toPromise();
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

  async getWaitingGroup(servicePointId: any, priorityId: any, limit: number = 20, offset: number = 0) {
    const _url = `${this.apiUrl}/queue/waiting-group/${servicePointId}?priorityId=${priorityId}&limit=${limit}&offset=${offset}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async searchWaitingGroup(servicePointId: any, priorityId: any, limit: number = 20, offset: number = 0, queryWaiting: string) {
    const _url = `${this.apiUrl}/queue/waiting-group/search/${servicePointId}?priorityId=${priorityId}&limit=${limit}&offset=${offset}&query=${queryWaiting}`;

    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async searchHistoryGroup(servicePointId: any, limit: number = 20, offset: number = 0, query: string) {
    const _url = `${this.apiUrl}/queue/history-group/search/${servicePointId}?limit=${limit}&offset=${offset}&query=${query}`;

    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async getQueueByDepartment(departmentId: any, limit: number = 20, offset: number = 0) {
    const _url = `${this.apiUrl}/queue/department/${departmentId}?limit=${limit}&offset=${offset}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async getHistoryQueueByDepartment(departmentId: any, limit: number = 20, offset: number = 0) {
    const _url = `${this.apiUrl}/queue/department/history/${departmentId}?limit=${limit}&offset=${offset}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async searchQueueByDepartment(departmentId: any, limit: number = 20, offset: number = 0, query: string = '') {
    const _url = `${this.apiUrl}/queue/department/search/${departmentId}?limit=${limit}&offset=${offset}&query=${query}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async markInterview(queueId: any) {
    const _url = `${this.apiUrl}/queue/interview/marked/${queueId}`;
    return this.httpClient.put(_url, {}, this.httpOptions).toPromise();
  }

  async getWorkingDepartment(departmentId: any, token: any = null) {
    const _url = `${this.apiUrl}/queue/working/department/${departmentId}`;

    var _httpOptions = {};

    if (token) {
      _httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };
    } else {
      _httpOptions = this.httpOptions;
    }

    return this.httpClient.get(_url, _httpOptions).toPromise();
  }

  async getWorking(servicePointId: any, token: any = null) {
    const _url = `${this.apiUrl}/queue/working/${servicePointId}`;
    var _httpOptions = {};

    if (token) {
      _httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };
    } else {
      _httpOptions = this.httpOptions;
    }

    return this.httpClient.get(_url, _httpOptions).toPromise();
  }

  async getWorkingGroup(servicePointId: any, token: any = null) {
    const _url = `${this.apiUrl}/queue/working-group/${servicePointId}`;
    var _httpOptions = {};

    if (token) {
      _httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };
    } else {
      _httpOptions = this.httpOptions;
    }

    return this.httpClient.get(_url, _httpOptions).toPromise();
  }

  async getWorkingHistoryGroup(servicePointId: any, token: any = null) {
    const _url = `${this.apiUrl}/queue/working/history-group/${servicePointId}`;
    var _httpOptions: any = {};

    if (token) {
      _httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };
    } else {
      _httpOptions = this.httpOptions;
    }
    return this.httpClient.get(_url, _httpOptions).toPromise();
  }

  async getWorkingHistory(servicePointId: any, token: any = null) {
    const _url = `${this.apiUrl}/queue/working/history/${servicePointId}`;

    var _httpOptions: any = {};

    if (token) {
      _httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };
    } else {
      _httpOptions = this.httpOptions;
    }

    return this.httpClient.get(_url, _httpOptions).toPromise();
  }



  async getPending(servicePointId: any) {
    const _url = `${this.apiUrl}/queue/pending/${servicePointId}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async getPendingByDepartment(departmentId: any) {
    const _url = `${this.apiUrl}/queue/pending/department/${departmentId}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async servicePointList(token: any = null) {
    const _url = `${this.apiUrl}/queue/service-points`;

    var _httpOptions: any = {};

    if (token) {
      _httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };
    } else {
      _httpOptions = this.httpOptions;
    }

    return this.httpClient.get(_url, _httpOptions).toPromise();
  }

  async markPending(queueId: any, servicePointId: any, priorityId: any, pendigOldQueue: any) {
    const _url = `${this.apiUrl}/queue/pending`;
    return this.httpClient.post(_url, {
      queueId: queueId,
      servicePointId: servicePointId,
      priorityId: priorityId,
      pendigOldQueue: pendigOldQueue
    }, this.httpOptions).toPromise();
  }

  async markCancel(queueId: any) {
    const _url = `${this.apiUrl}/queue/cancel/${queueId}`;
    return this.httpClient.delete(_url, this.httpOptions).toPromise();
  }

  async callQueueGroups(servicePointId: any, roomId: any, roomNumber: any, isCompleted: any = 'Y', queue: any) {
    const _url = `${this.apiUrl}/queue/caller-groups`;

    return this.httpClient.post(_url, {
      servicePointId: servicePointId,
      roomNumber: roomNumber,
      roomId: roomId,
      isCompleted: isCompleted,
      queue: queue
    }, this.httpOptions).toPromise();
  }
  async callQueueGroup(servicePointId: any, queueNumber: any, roomId: any, roomNumber: any, queueId: any, isCompleted: any = 'Y', queueRunning: any) {
    const _url = `${this.apiUrl}/queue/caller-group/${queueId}`;
    return this.httpClient.post(_url, {
      servicePointId: servicePointId,
      queueNumber: queueNumber,
      roomNumber: roomNumber,
      roomId: roomId,
      isCompleted: isCompleted,
      queueRunning: queueRunning
    }, this.httpOptions).toPromise();
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

  async callQueueDepartment(departmentId: any, servicePointId: any, queueNumber: any, roomId: any, roomNumber: any, queueId: any, isCompleted: any = 'Y') {
    const _url = `${this.apiUrl}/queue/caller/department/${queueId}`;
    return this.httpClient.post(_url, {
      departmentId: departmentId,
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

  async getCurrentQueueList(token: any = null) {
    const _url = `${this.apiUrl}/queue/current-list`;

    var _httpOptions: any = {};

    if (token) {
      _httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };
    } else {
      _httpOptions = this.httpOptions;
    }

    return this.httpClient.get(_url, _httpOptions).toPromise();
  }

  async getSound(servicePointId: any, token: any = null) {
    const _url = `${this.apiUrl}/queue/sound/${servicePointId}`;
    var _httpOptions = {};

    if (token) {
      _httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };
    } else {
      _httpOptions = this.httpOptions;
    }

    return this.httpClient.get(_url, _httpOptions).toPromise();
  }
  
}
