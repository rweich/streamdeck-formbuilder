import 'mocha';

import { expect } from 'chai';

import Paragraph from '@/elements/details/Paragraph';

describe('Paragraph', () => {
  it('should return the paragraph element as html', () => {
    const pElement: HTMLElement = new Paragraph('foo').getHtmlElement();
    expect(pElement.nodeName).to.equal('P');
    expect(pElement.textContent).to.equal('foo');
  });
  describe('getHtmlElement', () => {
    it('should replace links', () => {
      const element = new Paragraph('foo [foobar](https://example.com) bar').getHtmlElement();
      expect(element.childNodes.length).to.equal(3);
    });
    it('should add the clickevent to the links', (done) => {
      const paragraph = new Paragraph('foo [foobar](https://example.com) bar');
      paragraph.onLinkClick((event) => {
        expect(event.textContent).to.equal('foobar');
        expect(event.href).to.contain('https://example.com');
        done();
      });
      const element = paragraph.getHtmlElement();
      element.querySelector('a')?.dispatchEvent(new Event('click'));
    });
  });
});
