import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(@Inject('API_URL') private apiUrl: string, private httpClient: HttpClient) { }

  async list() {
    const _url = `${this.apiUrl}/users`;
    return this.httpClient.get(_url).toPromise();
  }

  async info(userId: any) {
    const _url = `${this.apiUrl}/users/${userId}`;
    return this.httpClient.get(_url).toPromise();
  }

  async save(data: object) {
    const _url = `${this.apiUrl}/users`;
    return this.httpClient.post(_url, data).toPromise();
  }

  async update(userId: any, data: object) {
    const _url = `${this.apiUrl}/users/${userId}`;
    return this.httpClient.put(_url, data).toPromise();
  }

  async remove(userId: any) {
    const _url = `${this.apiUrl}/users/${userId}`;
    return this.httpClient.delete(_url).toPromise();
  }

}
