import EventEmitter from 'eventemitter3';

import { CustomizeRangeEventTypes } from '@/elements/element-customizer/CustomizeRangeEventTypes';

export interface CustomizeRangeInterface {
  attachListeners(eventEmitter: EventEmitter<CustomizeRangeEventTypes>): void;
}
