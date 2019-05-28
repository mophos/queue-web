import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KioskService {

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

  async getInfo(token: any = null) {
    const _url = `${this.apiUrl}/info`;
    let _httpOptions = {};

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

  async getServicePoint(token: any = null) {
    const _url = `${this.apiUrl}/service-points/kios`;
    let _httpOptions = {};

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

  async print(token: any = null, data) {
    const _url = `${this.apiUrl}/print/queue/prepare/print`;
    let _httpOptions = {};

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

    return this.httpClient.post(_url, data, _httpOptions).toPromise();
  }

  async register(token: any = null, data) {
    const _url = `${this.apiUrl}/queue/register`;
    let _httpOptions = {};

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

    return this.httpClient.post(_url, data, _httpOptions).toPromise();
  }

  async getPatient(token: any = null, data) {
    const _url = `${this.apiUrl}/kiosk/patient/info`;
    let _httpOptions = {};
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
    return this.httpClient.post(_url, data, _httpOptions).toPromise();
  }

  async getNhso(token, data) {
    const _url = `${this.apiUrl}/kiosk/nhso`;
    let _httpOptions = {};
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
    return this.httpClient.post(_url, { data: data }, _httpOptions).toPromise();
  }
  async test(token) {
    const _url = `${this.apiUrl}/kiosk/test`;
    let _httpOptions = {};
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
    return this.httpClient.post(_url, _httpOptions).toPromise();
  }
}
