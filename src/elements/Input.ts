import { is, isString } from 'ts-type-guards';

import { ValueType } from '@/elements/ValueType';

import AbstractElement from './AbstractElement';

export default class Input extends AbstractElement {
  private placeholder = '';
  private input: HTMLInputElement | undefined;

  /** Sets the placeholder that will be displayed in the field when its empty */
  public setPlaceholder(placeholder: string): this {
    this.placeholder = placeholder;
    return this;
  }

  protected getElementsToAppend(): HTMLElement[] {
    return [this.getInput()];
  }

  protected propagateValue(value: ValueType): void {
    if (!isString(value)) {
      return;
    }
    this.getInput().value = value;
  }

  private getInput(): HTMLInputElement {
    if (!this.input) {
      this.input = document.createElement('input');
      this.input.classList.add('sdpi-item-value');
      this.input.addEventListener('input', (event) => this.onInput(event));
    }
    if (this.placeholder !== '') {
      this.input.placeholder = this.placeholder;
    }
    return this.input;
  }

  private onInput(event: Event): void {
    if (is(HTMLInputElement)(event.target)) {
      this.changeValue(event.target.value);
    }
  }
}
