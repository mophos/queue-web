import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
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
    const _url = `${this.apiUrl}/sounds`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }
  async save(servicePointId, soundId) {
    const _url = `${this.apiUrl}/sounds/${servicePointId}`;
    return this.httpClient.put(_url, {
      soundId: soundId
    }, this.httpOptions).toPromise();
  }
}

