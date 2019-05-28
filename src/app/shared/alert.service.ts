import { Injectable } from '@angular/core';
import { default as swal, SweetAlertType, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  error(text: any = 'เกิดข้อผิดพลาด', title: any = '', timer = null) {

    const option: SweetAlertOptions = {
      title: title,
      text: text,
      type: 'error',
      confirmButtonText: 'ตกลง'
    };
    if (timer) {
      option.timer = timer;
    }
    swal.fire(option);

  }

  info(text: any) {

    const option: SweetAlertOptions = {
      text: text,
      type: 'info',
      confirmButtonText: 'ตกลง'
    };
    swal.fire(option);

  }

  success(title = 'ดำเนินการเสร็จเรียบร้อย', text = '') {

    const option: SweetAlertOptions = {
      title: title,
      text: text,
      timer: 2000,
      type: 'success',
      confirmButtonText: 'ตกลง'
    };
    swal.fire(option)
      .then(
        function () { },
        // handling the promise rejection
        function (dismiss) {
          if (dismiss === 'timer') { }
        }
      )
  }

  serverError() {

    const option: SweetAlertOptions = {
      title: 'เกิดข้อผิดพลาด',
      text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
      type: 'error',
      confirmButtonText: 'ตกลง'
    };
    swal.fire(option);

  }

  async confirm(text = 'คุณต้องการดำเนินการนี้ ใช่หรือไม่?', ) {
    const option: SweetAlertOptions = {
      title: '',
      text: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ดำเนินการ!',
      cancelButtonText: 'ยกเลิก',
    };

    let result = await swal.fire(option);
    if (result.dismiss) return false;
    if (result.value) return true;

    return false;
  }

  async showLoading() {
    const resp = await swal.fire({
      title: 'ประมวลผล!',
      html: 'กรุณารอซักครู่ระบบกำลังประมวลผล.',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading();
      }
    });
    if (resp.dismiss === swal.DismissReason.timer) { }

  }

}
