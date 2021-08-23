import HtmlElementInterface from '@/HtmlElementInterface';

export default class HtmlElement implements HtmlElementInterface {
  private readonly element;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public getHtmlElement(): HTMLElement {
    return this.element;
  }
}
