import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { UserService } from 'src/app/shared/user.service';
import { AlertService } from 'src/app/shared/alert.service';
import { TokenService } from 'src/app/shared/token.service';

@Component({
  selector: 'app-generate-token',
  templateUrl: './generate-token.component.html',
  styles: []
})
export class GenerateTokenComponent implements OnInit {

  tokens: any = [];

  constructor(
    private alertService: AlertService,
    private _clipboardService: ClipboardService,
    private tokenService: TokenService) { }

  ngOnInit() {
    this.getList();
  }

  async generateToken() {
    const confirm = await this.alertService.confirm('ต้องการสร้าง Token ใช่หรือไม่?');

    if (confirm) {
      try {
        const rs: any = await this.tokenService.generate();
        if (rs.statusCode === 200) {
          this.alertService.success();
          this.getList();
        } else {
          this.alertService.error(rs.message);
        }
      } catch (error) {
        console.log(error);
        this.alertService.error();
      }
    }
  }

  async getList() {
    try {
      const rs: any = await this.tokenService.list();
      if (rs.statusCode === 200) {
        var data = [];
        rs.results.forEach(v => {
          var obj: any = {};
          obj.token = v.token;
          obj.short_token = v.token.split('.')[2];
          obj.created_date = v.created_date;
          obj.expired_date = v.expired_date;

          data.push(obj);
        });
        this.tokens = data;
      } else {
        this.alertService.error(rs.message);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error();
    }
  }

  copyToken(token: any) {
    this._clipboardService.copyFromContent(token);
  }

  async removeToken(token: any) {
    const confirm = await this.alertService.confirm('ต้องการยกเลิก Token นี้ใช่หรือไม่?');
    if (confirm) {
      try {
        const rs: any = await this.tokenService.remove(token);
        if (rs.statusCode === 200) {
          this.getList();
        } else {
          this.alertService.error(rs.message);
        }
      } catch (error) {
        console.log(error);
        this.alertService.error();
      }
    }
  }
}
