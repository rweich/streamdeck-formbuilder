import EventEmitter from 'eventemitter3';
import { is, isString } from 'ts-type-guards';

import AbstractElement from '@/elements/AbstractElement';
import { CustomizeRangeEventTypes } from '@/elements/element-customizer/CustomizeRangeEventTypes';
import { CustomizeRangeInterface } from '@/elements/element-customizer/CustomizeRangeInterface';
import { ValueType } from '@/elements/ValueType';

export default class Range extends AbstractElement {
  private readonly min: string;
  private readonly max: string;
  private readonly step: number;
  private showLabels = false;
  private tickSteps: number[] = [];
  private range: HTMLInputElement | undefined;
  private readonly customizeEmitter = new EventEmitter<CustomizeRangeEventTypes>();

  constructor(min: number, max: number, step: number, customizers: CustomizeRangeInterface[]) {
    super();
    this.htmlContainer.setAttribute('type', 'range');
    this.min = String(min);
    this.max = String(max);
    this.step = step;

    for (const customizer of customizers) {
      customizer.attachListeners(this.customizeEmitter);
    }
  }

  /** Show labels displaying the min-max values in front and behind the slider */
  public enableMinMaxLabels(): this {
    this.showLabels = true;
    return this;
  }

  /** Allows to set steps, which add tick marks and make the slider snap to the values */
  public setTickSteps(...steps: number[]): this {
    this.tickSteps = steps;
    return this;
  }

  protected getElementsToAppend(): HTMLElement[] {
    const wrapContainer = this.showLabels || this.tickSteps.length > 0;

    if (!wrapContainer) {
      return [this.getRange()];
    }

    const wrap = document.createElement('div');
    wrap.className = 'sdpi-item-value';

    if (this.showLabels) {
      const label = document.createElement('span');
      label.textContent = this.min;
      wrap.append(label);
    }

    const range = this.getRange();
    wrap.append(range);

    if (this.tickSteps.length > 0) {
      const list = document.createElement('datalist');
      list.id = 'numbers';
      range.setAttribute('list', 'numbers');
      for (const step of this.tickSteps) {
        const option = document.createElement('option');
        option.textContent = String(step);
        list.append(option);
      }
      wrap.append(list);
    }

    if (this.showLabels) {
      const label = document.createElement('span');
      label.textContent = this.max;
      wrap.append(label);
    }

    return [wrap];
  }

  protected propagateValue(value: ValueType): void {
    if (!isString(value)) {
      return;
    }
    const range = this.getRange();
    range.value = value;
    this.customizeEmitter.emit('changeValue', range, value);
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

    this.customizeEmitter.emit('createRange', this.range);

    return this.range;
  }

  private onInput(event: Event): void {
    if (is(HTMLInputElement)(event.target)) {
      this.changeValue(event.target.value);
      this.customizeEmitter.emit('changeValue', event.target, event.target.value);
    }
  }
}
