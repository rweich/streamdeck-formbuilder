import HtmlElementInterface from '@/HtmlElementInterface';

export default class Headline implements HtmlElementInterface {
  private readonly text;

  public constructor(text: string) {
    this.text = text;
  }

  public getHtmlElement(): HTMLElement {
    const element = document.createElement('h4');
    element.textContent = this.text;
    return element;
  }
}
