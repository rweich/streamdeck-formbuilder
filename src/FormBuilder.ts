import '../assets/css/sdpi.css';
import '../assets/css/styles.css';

import AbstractElement from './elements/AbstractElement';
import Details from '@/elements/Details';
import Dropdown from './elements/Dropdown';
import ElementGroupInterface from './ElementGroupInterface';
import ElementInterface from './ElementInterface';
import EventEmitter from 'eventemitter3';
import { EventType } from './EventType';
import { FormDataType } from './FormDataType';
import HtmlElement from '@/elements/details/HtmlElement';
import HtmlElementInterface from '@/HtmlElementInterface';
import Input from './elements/Input';
import { isSomething } from 'ts-type-guards';

type ValueElement = ElementInterface | ElementGroupInterface;
type ValueElementBag<T extends FormDataType> = {
  name: keyof T;
  element: ValueElement;
};
type FormElement<T extends FormDataType> = ValueElementBag<T> | HtmlElementInterface;

function isValueElementBag<T extends FormDataType>(value: unknown): value is ValueElementBag<T> {
  return (
    isSomething(value)
    && (value as ValueElementBag<T>).name !== undefined
    && (value as ValueElementBag<T>).element !== undefined
  );
}

export default class FormBuilder<T extends FormDataType> {
  private readonly initialData: T;
  private elementBag: FormElement<T>[] = [];
  private eventEmitter = new EventEmitter<EventType>();

  constructor(initialData: T) {
    this.initialData = initialData;
  }

  public getFormData(): T {
    const data = this.initialData;
    const valueElements: ValueElementBag<T>[] = this.elementBag.filter(isValueElementBag);
    for (const element of valueElements) {
      data[element.name] = element.element.value as T[typeof element.name];
    }

    return data;
  }

  public setFormData(data: T): void {
    const valueElements: ValueElementBag<T>[] = this.elementBag.filter(isValueElementBag);
    for (const element of valueElements) {
      element.element.setValue(data[element.name]);
    }
  }

  public appendTo(element: HTMLElement): void {
    for (const formElement of this.elementBag) {
      if (isValueElementBag<T>(formElement)) {
        element.append(formElement.element.getHtmlElement());
      } else {
        element.append(formElement.getHtmlElement());
      }
    }
  }

  public addElement<K extends keyof T>(
    name: K,
    value: T[K] extends Record<string, string>
      ? ElementGroupInterface & { elements: { [x in keyof T[K]]: ElementInterface } }
      : ElementInterface,
  ): void {
    this.elementBag.push({ element: value, name });
    value.setValue(this.initialData[name]);
  }

  public addHtml(element: HtmlElementInterface): void {
    this.elementBag.push(element);
  }

  public addHtmlElement(element: HTMLElement): void {
    this.elementBag.push(new HtmlElement(element));
  }

  public createInput(): Input {
    return this.addEventsToElement(new Input());
  }

  public createDropdown(): Dropdown {
    return this.addEventsToElement(new Dropdown());
  }

  public createDetails(): Details {
    const details: Details = new Details();
    details.onLinkClick((link) => this.eventEmitter.emit('click-link', link));
    return details;
  }

  public on<K extends keyof Pick<EventType, 'change-settings' | 'click-link'>>(
    event: K,
    callback: EventEmitter.EventListener<EventType, K>,
  ): void {
    this.eventEmitter.on(event, callback);
  }

  private addEventsToElement<T extends AbstractElement>(element: T): T {
    element.on('change-value', () => this.onChangeElementValue());
    this.eventEmitter.on('change-settings', () => element.reportSettingsChange());
    return element;
  }

  private onChangeElementValue(): void {
    this.eventEmitter.emit('change-settings');
  }
}
