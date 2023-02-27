import EventEmitter from 'eventemitter3';

import { CustomizeRangeEventTypes } from '@/elements/element-customizer/CustomizeRangeEventTypes';
import { CustomizeRangeInterface } from '@/elements/element-customizer/CustomizeRangeInterface';

/** Fix sdpi-bug, where the range progress is not displayed */
export default class RangeProgress implements CustomizeRangeInterface {
  public attachListeners(eventEmitter: EventEmitter<CustomizeRangeEventTypes>): void {
    // initially create the --min/--max/--val properties, so our css calculations work
    eventEmitter.on('createRange', (range: HTMLInputElement) => {
      range.style.setProperty('--min', range.min);
      range.style.setProperty('--max', range.max);
      range.style.setProperty('--val', '0');
    });
    // make sure the --val property is always up-to-date
    eventEmitter.on('changeValue', (range: HTMLInputElement, newValue: string) =>
      range.style.setProperty('--val', newValue),
    );
  }
}
