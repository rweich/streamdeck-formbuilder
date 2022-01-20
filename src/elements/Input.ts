import { is } from 'ts-type-guards';

import AbstractElement from './AbstractElement';

export default class Input extends AbstractElement {
  private placeholder = '';
  private input: HTMLInputElement | undefined;

  public setPlaceholder(placeholder: string): this {
    this.placeholder = placeholder;
    return this;
  }

  protected getInput(): HTMLElement {
    if (!this.input) {
      this.input = document.createElement('input');
      this.input.classList.add('sdpi-item-value');
      this.input.addEventListener('input', (error) => this.onInput(error));
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
