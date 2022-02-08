import { default as EventEmitter } from 'eventemitter3';
import { is } from 'ts-type-guards';

import LinkHelper, { LinkEvents } from '@/helper/LinkHelper';
import HtmlElementInterface from '@/HtmlElementInterface';

export default class Paragraph implements HtmlElementInterface {
  private readonly text;
  private readonly eventEmitter = new EventEmitter<LinkEvents>();
  private readonly linkHelper = new LinkHelper();

  constructor(text: string) {
    this.text = text;
  }

  public getHtmlElement(): HTMLElement {
    let element: HTMLElement = document.createElement('p');
    const text = this.text;
    const links = this.linkHelper.extractLinks(text);
    if (links.length > 0) {
      element = this.linkHelper.addLinkedText(element, text, links);
      for (const linkElement of element.querySelectorAll('a'))
        linkElement.addEventListener('click', (event) => {
          if (is(HTMLAnchorElement)(event.target)) {
            event.preventDefault();
            this.eventEmitter.emit('click', event.target);
          }
        });
      return element;
    }
    element.innerHTML = text;
    return element;
  }

  public onLinkClick(callback: (event: HTMLAnchorElement) => void): void {
    this.eventEmitter.on('click', callback);
  }
}
