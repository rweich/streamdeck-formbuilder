import HtmlElementInterface from '@/HtmlElementInterface';

export default class Summary implements HtmlElementInterface {
  private readonly text;

  constructor(text: string) {
    this.text = text;
  }

  public getHtmlElement(): HTMLElement {
    const element = document.createElement('summary');
    element.textContent = this.text;
    return element;
  }
}
