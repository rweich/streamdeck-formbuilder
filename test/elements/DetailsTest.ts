import 'mocha';

import { expect } from 'chai';

import Details from '@/elements/Details';

describe('Details', () => {
  it('should return the details element as html', () => {
    const details = new Details();
    expect(details.getHtmlElement().nodeName).to.equal('DETAILS');
  });
  it('should add the headline', () => {
    const details = new Details().addHeadline('the headline');
    expect(details.getHtmlElement().innerHTML).to.contain('<h4>the headline</h4>');
  });
  it('should add the summary', () => {
    const details = new Details().addSummary('sum');
    expect(details.getHtmlElement().innerHTML).to.contain('<summary>sum</summary>');
  });
  it('should add the paragraph', () => {
    const details = new Details().addParagraph('ppp');
    expect(details.getHtmlElement().innerHTML).to.contain('<p>ppp</p>');
  });
  it('should add the htmlelement', () => {
    const details = new Details().addElement(document.createElement('a'));
    expect(details.getHtmlElement().innerHTML).to.contain('<a></a>');
  });
  it('should create the elements in the right order', () => {
    const details = new Details();
    details.addHeadline('the headline');
    details.addParagraph('ppp');
    details.addSummary('sum');
    details.addParagraph('p2p2p2');
    expect(details.getHtmlElement().innerHTML).to.contain(
      '<h4>the headline</h4><p>ppp</p><summary>sum</summary><p>p2p2p2</p>',
    );
  });
  it('should create a link and call the callback on click', (done) => {
    const details = new Details();
    details.addParagraph('p with a [link](https://example.com) inside');
    details.onLinkClick(({ textContent, href }) => {
      expect(textContent).to.equal('link');
      expect(href).to.contain('https://example.com');
      done();
    });
    const link = details.getHtmlElement().querySelector('a');
    expect(link?.textContent).to.equal('link');
    link?.dispatchEvent(new Event('click'));
  });
});
