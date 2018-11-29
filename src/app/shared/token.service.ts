import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(@Inject('API_URL') private apiUrl: string, private httpClient: HttpClient) { }

  async list() {
    const _url = `${this.apiUrl}/token`;
    return this.httpClient.get(_url).toPromise();
  }

  async generate() {
    const _url = `${this.apiUrl}/token`;
    return this.httpClient.post(_url, {}).toPromise();
  }

  async remove(token: any) {
    const _url = `${this.apiUrl}/token?token=${token}`;
    return this.httpClient.delete(_url).toPromise();
  }

}
