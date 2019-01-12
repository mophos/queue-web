import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  async list() {
    const _url = `${this.apiUrl}/users`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async servicePointList(userId: any) {
    const _url = `${this.apiUrl}/users/service-points/list/${userId}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async saveServicePointList(userId: any, items: any) {
    const _url = `${this.apiUrl}/users/service-points/${userId}`;
    return this.httpClient.put(_url, { items: items }, this.httpOptions).toPromise();
  }

  async info(userId: any) {
    const _url = `${this.apiUrl}/users/${userId}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async save(data: object) {
    const _url = `${this.apiUrl}/users`;
    return this.httpClient.post(_url, data, this.httpOptions).toPromise();
  }

  async update(userId: any, data: object) {
    const _url = `${this.apiUrl}/users/${userId}`;
    return this.httpClient.put(_url, data, this.httpOptions).toPromise();
  }

  async remove(userId: any) {
    const _url = `${this.apiUrl}/users/${userId}`;
    return this.httpClient.delete(_url, this.httpOptions).toPromise();
  }

}
