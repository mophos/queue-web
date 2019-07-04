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

  async save(servicePointId, soundId, speed) {
    const _url = `${this.apiUrl}/sounds/service-point/${servicePointId}`;
    return this.httpClient.put(_url, {
      soundId: soundId,
      speed: speed
    }, this.httpOptions).toPromise();
  }

  async saveRoom(roomId, soundId) {
    const _url = `${this.apiUrl}/sounds/service-room/${roomId}`;
    return this.httpClient.put(_url, {
      soundId: soundId
    }, this.httpOptions).toPromise();
  }
}

