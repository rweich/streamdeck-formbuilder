import EventEmitter from 'eventemitter3';

import { RangeEvents } from '@/elements/range/RangeEvents';

/** Fix sdpi-bug, where the range ticks are not displayed */
export default class RangeTicks {
  private enableTicks = false;

  public attachListeners(eventEmitter: EventEmitter<RangeEvents>): void {
    // initially create the --max/--step properties, so our css calculations work
    eventEmitter.on('create-range', (range: HTMLInputElement) => {
      range.style.setProperty('--max', range.max);
      range.style.setProperty('--step', range.step);
      if (this.enableTicks) {
        console.log('foo');
        range.classList.add('with-ticks');
      }
    });
    eventEmitter.on('enable-ticks', () => (this.enableTicks = true));
  }
}
