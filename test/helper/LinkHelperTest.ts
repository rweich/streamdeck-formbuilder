import 'mocha';

import LinkHelper from '@/helper/LinkHelper';
import { expect } from 'chai';

describe('LinkHelper', () => {
  const text = `
    a text with [a link](https://example.com) links
    and [more](https://test.me "with title") links
    and other stuff
  `;
  describe('extractLinks', () => {
    it('should extract links', () => {
      const links = new LinkHelper().extractLinks(text);
      expect(links.length).to.equal(2);
      expect(links[0].text).to.equal('a link');
      expect(links[0].href).to.equal('https://example.com');
      expect(links[0].title).to.be.undefined;
      expect(links[1].text).to.equal('more');
      expect(links[1].href).to.equal('https://test.me');
      expect(links[1].title).to.equal('with title');
    });
  });
  describe('replaceLinks', () => {
    it('should extract links', () => {
      const linkHelper = new LinkHelper();
      const element = linkHelper.addLinkedText(document.createElement('p'), text, linkHelper.extractLinks(text));
      expect(element.childNodes.length).to.equal(5);
      expect(element.childNodes[0].nodeName).to.equal('#text');
      expect(element.childNodes[0].textContent).to.contain('a text with');
      expect(element.childNodes[1].nodeName).to.equal('A');
      expect(element.childNodes[1].textContent).to.equal('a link');
      expect((element.childNodes[1] as HTMLAnchorElement).href).to.contain('https://example.com');
      expect(element.childNodes[2].nodeName).to.equal('#text');
      expect(element.childNodes[2].textContent).to.match(/links\s+and/);
      expect(element.childNodes[3].nodeName).to.equal('A');
      expect(element.childNodes[3].textContent).to.equal('more');
      expect((element.childNodes[3] as HTMLAnchorElement).href).to.contain('https://test.me');
      expect((element.childNodes[3] as HTMLAnchorElement).title).to.equal('with title');
      expect(element.childNodes[4].nodeName).to.equal('#text');
      expect(element.childNodes[4].textContent).to.match(/links\s+and other stuff/);
    });
    it('should work with a link at the start', () => {
      const linkHelper = new LinkHelper();
      const text = '[foo](https://example.com) and stuff';
      const element = linkHelper.addLinkedText(document.createElement('p'), text, linkHelper.extractLinks(text));
      expect(element.childNodes.length).to.equal(2);
      expect(element.childNodes[0].nodeName).to.equal('A');
      expect(element.childNodes[1].nodeName).to.equal('#text');
    });
    it('should work with a link at the end', () => {
      const linkHelper = new LinkHelper();
      const text = 'stuff and [foo](https://example.com)';
      const element = linkHelper.addLinkedText(document.createElement('p'), text, linkHelper.extractLinks(text));
      expect(element.childNodes.length).to.equal(2);
      expect(element.childNodes[0].nodeName).to.equal('#text');
      expect(element.childNodes[1].nodeName).to.equal('A');
    });
    it('should work with two of same links', () => {
      const linkHelper = new LinkHelper();
      const text = '[foo](https://example.com) and stuff and [foo](https://example.com)';
      const element = linkHelper.addLinkedText(document.createElement('p'), text, linkHelper.extractLinks(text));
      expect(element.childNodes.length).to.equal(3);
      expect(element.childNodes[0].nodeName).to.equal('A');
      expect(element.childNodes[1].nodeName).to.equal('#text');
      expect(element.childNodes[2].nodeName).to.equal('A');
    });
  });
});
