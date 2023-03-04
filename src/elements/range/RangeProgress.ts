import EventEmitter from 'eventemitter3';

import { RangeEvents } from '@/elements/range/RangeEvents';

/** Fix sdpi-bug, where the range progress is not displayed */
export default class RangeProgress {
  public attachListeners(eventEmitter: EventEmitter<RangeEvents>): void {
    // initially create the --min/--max/--val properties, so our css calculations work
    eventEmitter.on('create-range', (range: HTMLInputElement) => {
      range.style.setProperty('--min', range.min);
      range.style.setProperty('--max', range.max);
      range.style.setProperty('--val', '0');
    });
    // make sure the --val property is always up-to-date
    eventEmitter.on('update-value', (range: HTMLInputElement, newValue: string) =>
      range.style.setProperty('--val', newValue),
    );
  }
}
