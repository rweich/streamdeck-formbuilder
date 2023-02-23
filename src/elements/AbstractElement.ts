import { default as EventEmitter } from 'eventemitter3';

import { EventType } from '@/EventType';

import ElementInterface from '../ElementInterface';
import { ValueType } from './ValueType';

export default abstract class AbstractElement implements ElementInterface {
  protected readonly eventEmitter = new EventEmitter<EventType>();
  protected readonly htmlContainer: HTMLElement;
  private label = '';
  private elementValue: ValueType = '';

  constructor() {
    this.htmlContainer = document.createElement('div');
  }

  /** the current value of the element */
  get value(): ValueType {
    return this.elementValue;
  }

  /** returns all the (input) elements to append to the html-container */
  protected abstract getElementsToAppend(): HTMLElement[];

  /** propagates this elements value to all the inputs included in this element */
  protected abstract propagateValue(value: ValueType): void;

  public getHtmlElement(): HTMLElement {
    if (this.htmlContainer.childElementCount === 0) {
      this.fillHtmlContainer();
    }

    return this.htmlContainer;
  }

  public setValue(value: ValueType): void {
    this.elementValue = value;
    this.propagateValue(value);
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

  private fillHtmlContainer(): void {
    this.htmlContainer.classList.add('sdpi-item');
    const label = this.createLabel();
    if (label) {
      this.htmlContainer.append(label);
    }

    for (const element of this.getElementsToAppend()) {
      this.htmlContainer.append(element);
    }
  }
}
