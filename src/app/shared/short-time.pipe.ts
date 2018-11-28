import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'shortTime'
})
export class ShortTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    try {
      return moment(value).format('HH:mm:ss')
    } catch (error) {
      return '-'
    }
  }

}
