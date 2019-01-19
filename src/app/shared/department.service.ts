import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  token: string = null;
  httpOptions: any;

  constructor(
    @Inject('API_URL') private apiUrl: string,
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
    const _url = `${this.apiUrl}/departments`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async save(data: object) {
    const _url = `${this.apiUrl}/departments`;
    return this.httpClient.post(_url, data, this.httpOptions).toPromise();
  }

  async update(departmentId: any, data: object) {
    const _url = `${this.apiUrl}/departments/${departmentId}`;
    return this.httpClient.put(_url, data, this.httpOptions).toPromise();
  }

  async remove(departmentId: any) {
    const _url = `${this.apiUrl}/departments/${departmentId}`;
    return this.httpClient.delete(_url, this.httpOptions).toPromise();
  }
}
