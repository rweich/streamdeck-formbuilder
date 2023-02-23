import '../assets/css/sdpi.css';
import '../assets/css/styles.css';

import { default as EventEmitter } from 'eventemitter3';
import { isSomething } from 'ts-type-guards';

import Details from '@/elements/Details';
import HtmlElement from '@/elements/details/HtmlElement';
import Range from '@/elements/Range';
import HtmlElementInterface from '@/HtmlElementInterface';

import ElementGroupInterface from './ElementGroupInterface';
import ElementInterface from './ElementInterface';
import AbstractElement from './elements/AbstractElement';
import Dropdown from './elements/Dropdown';
import Input from './elements/Input';
import { EventType } from './EventType';
import { FormDataType } from './FormDataType';

/** Value elements hold values, contrary to elements that e.g. only show things (like Details) */
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

  /**
   * Returns the currently set formdata (or settings) as an object
   */
  public getFormData(): T {
    const data = this.initialData;
    const valueElements: ValueElementBag<T>[] = this.elementBag.filter(isValueElementBag);
    for (const element of valueElements) {
      data[element.name] = element.element.value as T[typeof element.name];
    }

    return data;
  }

  /**
   * Allows to overwrite the formdata with whatever is passed
   */
  public setFormData(data: T): void {
    const valueElements: ValueElementBag<T>[] = this.elementBag.filter(isValueElementBag);
    for (const element of valueElements) {
      element.element.setValue(data[element.name]);
    }
  }

  /**
   * Builds the form and appends all its elements to the passed html element
   */
  public appendTo(element: HTMLElement): void {
    for (const formElement of this.elementBag) {
      if (isValueElementBag<T>(formElement)) {
        element.append(formElement.element.getHtmlElement());
      } else {
        element.append(formElement.getHtmlElement());
      }
    }
  }

  // TODO: wtf is the grouping stuff for? does it even work?
  /**
   * Adds a new form element to the form
   * @param {string} name
   * @param value A element or a group of elements (created by the create* methods)
   */
  public addElement<K extends keyof T>(
    name: K,
    value: T[K] extends Record<string, string>
      ? ElementGroupInterface & { elements: { [x in keyof T[K]]: ElementInterface } }
      : ElementInterface,
  ): void {
    this.elementBag.push({ element: value, name });
    value.setValue(this.initialData[name]);
  }

  /**
   * Allows to add an arbitrary object that returns a html element which then will be added to the form.
   * @param {HtmlElementInterface} element
   */
  public addHtml(element: HtmlElementInterface): void {
    this.elementBag.push(element);
  }

  /**
   * Adds a simple HTMLElement to the form
   */
  public addHtmlElement(element: HTMLElement): void {
    this.elementBag.push(new HtmlElement(element));
  }

  /** Creates a text input element */
  public createInput(): Input {
    return this.addEventsToElement(new Input());
  }

  /** Creates a drowpdown (or select) element */
  public createDropdown(): Dropdown {
    return this.addEventsToElement(new Dropdown());
  }

  /** Creates a collapsible detail element to output informational text */
  public createDetails(): Details {
    const details: Details = new Details();
    details.onLinkClick((link) => this.eventEmitter.emit('click-link', link));
    return details;
  }

  /** Creates a range-input (or slider) element */
  public createRange(min: number, max: number, step = 1): Range {
    return this.addEventsToElement(new Range(min, max, step));
  }

  /**
   * Allows to attach an eventlistener to formbuilder events
   * @param {'change-settings' | 'click-link'} event
   * @param callback The function that will get called once the event occurs
   */
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
