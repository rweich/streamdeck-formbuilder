import EventEmitter from 'eventemitter3';
import { is, isString } from 'ts-type-guards';

import AbstractElement from '@/elements/AbstractElement';
import { RangeEvents } from '@/elements/range/RangeEvents';
import RangeProgress from '@/elements/range/RangeProgress';
import RangeTicks from '@/elements/range/RangeTicks';
import { ValueType } from '@/elements/ValueType';

export default class Range extends AbstractElement {
  private readonly min: string;
  private readonly max: string;
  private readonly step: number;
  private showLabels = false;
  private range: HTMLInputElement | undefined;
  private readonly internalEventEmitter = new EventEmitter<RangeEvents>();

  constructor(min: number, max: number, step: number) {
    super();
    this.htmlContainer.setAttribute('type', 'range');
    this.min = String(min);
    this.max = String(max);
    this.step = step;

    new RangeTicks().attachListeners(this.internalEventEmitter);
    new RangeProgress().attachListeners(this.internalEventEmitter);
  }

  /** Show labels displaying the min-max values in front and behind the slider */
  public enableMinMaxLabels(): this {
    this.showLabels = true;
    return this;
  }

  public enableTicks(): this {
    this.internalEventEmitter.emit('enable-ticks');
    return this;
  }

  protected getElementsToAppend(): HTMLElement[] {
    if (!this.showLabels) {
      return [this.getRange()];
    }

    const wrap = document.createElement('div');
    wrap.className = 'sdpi-item-value';

    const label = document.createElement('span');
    label.textContent = this.min;
    wrap.append(label);

    wrap.append(this.getRange());

    const label2 = document.createElement('span');
    label2.textContent = this.max;
    wrap.append(label2);

    return [wrap];
  }

  protected propagateValue(value: ValueType): void {
    if (!isString(value)) {
      return;
    }
    const range = this.getRange();
    range.value = value;
    this.internalEventEmitter.emit('update-value', range, value);
  }

  private getRange(): HTMLInputElement {
    if (this.range !== undefined) {
      return this.range;
    }
    this.range = document.createElement('input');
    this.range.type = 'range';
    this.range.min = this.min;
    this.range.max = this.max;
    this.range.step = String(this.step);
    this.range.addEventListener('input', (event) => this.onInput(event));

    this.internalEventEmitter.emit('create-range', this.range);

    return this.range;
  }

  private onInput(event: Event): void {
    if (is(HTMLInputElement)(event.target)) {
      this.changeValue(event.target.value);
      this.internalEventEmitter.emit('update-value', event.target, event.target.value);
    }
  }
}
