import EventEmitter from 'eventemitter3';
import Headline from '@/elements/details/Headline';
import HtmlElement from '@/elements/details/HtmlElement';
import HtmlElementInterface from '@/HtmlElementInterface';
import { LinkEvents } from '@/helper/LinkHelper';
import Paragraph from '@/elements/details/Paragraph';
import Summary from '@/elements/details/Summary';

export default class Details implements HtmlElementInterface {
  private readonly elements: HtmlElementInterface[] = [];
  private readonly eventEmitter = new EventEmitter<LinkEvents>();

  public getHtmlElement(): HTMLElement {
    const detailsElement = document.createElement('details');
    for (const element of this.elements) {
      detailsElement.append(element.getHtmlElement());
    }
    return detailsElement;
  }

  public addSummary(text: string): this {
    this.elements.push(new Summary(text));
    return this;
  }

  public addHeadline(text: string): this {
    this.elements.push(new Headline(text));
    return this;
  }

  public addParagraph(text: string): this {
    const paragraph = new Paragraph(text);
    paragraph.onLinkClick((event) => this.eventEmitter.emit('click', event));
    this.elements.push(paragraph);
    return this;
  }

  public addElement(element: HTMLElement): this {
    this.elements.push(new HtmlElement(element));
    return this;
  }

  public onLinkClick(callback: (event: HTMLAnchorElement) => void): void {
    this.eventEmitter.on('click', callback);
  }
}
