import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'serviceTime'
})
export class ServiceTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    try {
      return moment(value, 'HH:mm:ss').format('HH:mm')
    } catch (error) {
      return '-'
    }
  }

}
