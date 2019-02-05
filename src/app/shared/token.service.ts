import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

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
    const _url = `${this.apiUrl}/token`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async generate() {
    const _url = `${this.apiUrl}/token`;
    return this.httpClient.post(_url, {}, this.httpOptions).toPromise();
  }

  async remove(token: any) {
    const _url = `${this.apiUrl}/token?token=${token}`;
    return this.httpClient.delete(_url, this.httpOptions).toPromise();
  }

}
