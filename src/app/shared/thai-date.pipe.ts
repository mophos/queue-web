import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'thaiDate'
})
export class ThaiDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    try {
      const _date = moment(value).format('DD MMM');
      const _year = moment(value).get('year') + 543;

      const thaiDate = `${_date} ${_year}`;
      return thaiDate;
    } catch (error) {
      return '-';
    }
  }

}
