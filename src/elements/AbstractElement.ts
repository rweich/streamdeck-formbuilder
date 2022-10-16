import { default as EventEmitter } from 'eventemitter3';
import { is } from 'ts-type-guards';

import { EventType } from '@/EventType';

import ElementInterface from '../ElementInterface';
import { ValueType } from './ValueType';

export default abstract class AbstractElement implements ElementInterface {
  private readonly htmlContainer: HTMLElement;
  private label = '';
  private eventEmitter = new EventEmitter<EventType>();
  private elementValue: ValueType = '';

  constructor() {
    this.htmlContainer = document.createElement('div');
  }

  /** the current value of the element */
  get value(): ValueType {
    return this.elementValue;
  }

  protected abstract getInput(): HTMLElement;

  public getHtmlElement(): HTMLElement {
    this.htmlContainer.classList.add('sdpi-item');
    const label = this.createLabel();
    if (label) {
      this.htmlContainer.append(label);
    }

    this.htmlContainer.append(this.getInput());
    return this.htmlContainer;
  }

  public setValue(value: ValueType): void {
    this.elementValue = value;
    const input = this.getInput();
    if (typeof value === 'string' && (is(HTMLInputElement)(input) || is(HTMLSelectElement)(input))) {
      input.value = value;
    }
  }

  /** sets the label to the passed value */
  public setLabel(label: string): this {
    this.label = label;
    return this;
  }

  /**
   * allows to set a callback to be called on every change. based on the return value of the callback this element
   * will be shown (when true) or hidden (when false).
   */
  public showOn(callback: () => boolean): this {
    const setDisplay = () => (this.htmlContainer.style.display = callback() ? 'flex' : 'none');
    this.eventEmitter.on('change-settings', setDisplay);
    setDisplay();
    return this;
  }

  /** @internal */
  public on<K extends keyof EventType>(eventname: K, callback: EventEmitter.EventListener<EventType, K>): void {
    this.eventEmitter.on(eventname, callback);
  }

  /** @internal */
  public reportSettingsChange(): void {
    this.eventEmitter.emit('change-settings');
  }

  protected createLabel(): HTMLElement | undefined {
    if (!this.label) {
      return;
    }
    const label = document.createElement('div');
    label.classList.add('sdpi-item-label');
    label.textContent = this.label;
    return label;
  }

  protected changeValue(value: string): void {
    this.setValue(value);
    this.eventEmitter.emit('change-value');
  }
}
