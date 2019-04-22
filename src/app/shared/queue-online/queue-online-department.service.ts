import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueueOnlineDepartmentService {

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
    const _url = `${this.mophQueueUrl}/queue-online/departments`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async save(departmentName: any, prefix: any, hisDepCode: any, isActive: any = 'Y') {
    const _url = `${this.mophQueueUrl}/queue-online/departments`;
    const body: any = {
      departmentName: departmentName,
      prefix: prefix,
      hisDepCode: hisDepCode,
      isActive: isActive
    };
    return this.httpClient.post(_url, body, this.httpOptions).toPromise();
  }

  async update(departmentId: any, departmentName: any, prefix: any, hisDepCode: any, isActive: any = 'Y') {
    const _url = `${this.mophQueueUrl}/queue-online/departments/${departmentId}`;
    const body: any = {
      departmentName: departmentName,
      prefix: prefix,
      hisDepCode: hisDepCode,
      isActive: isActive
    };
    return this.httpClient.put(_url, body, this.httpOptions).toPromise();
  }

  async remove(departmentId: any) {
    const _url = `${this.mophQueueUrl}/queue-online/departments/${departmentId}`;
    return this.httpClient.delete(_url, this.httpOptions).toPromise();
  }


}
