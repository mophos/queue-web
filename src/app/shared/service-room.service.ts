import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceRoomService {

  constructor(@Inject('API_URL') private apiUrl: string, private httpClient: HttpClient) { }

  async list(servicePointId: any) {
    const _url = `${this.apiUrl}/service-rooms/${servicePointId}`;
    return this.httpClient.get(_url).toPromise();
  }

  async save(data: object) {
    const _url = `${this.apiUrl}/service-rooms`;
    return this.httpClient.post(_url, data).toPromise();
  }

  async update(roomId: any, data: object) {
    const _url = `${this.apiUrl}/service-rooms/${roomId}`;
    return this.httpClient.put(_url, data).toPromise();
  }

  async remove(roomId: any) {
    const _url = `${this.apiUrl}/service-rooms/${roomId}`;
    return this.httpClient.delete(_url).toPromise();
  }

}
