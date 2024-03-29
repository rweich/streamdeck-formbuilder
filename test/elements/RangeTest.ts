import 'mocha';

import { expect } from 'chai';

import Range from '@/elements/Range';

describe('Range', () => {
  describe('Range-specific features', () => {
    it('should create the range-input with the values', () => {
      const range = new Range(5, 100, 1);

      const input = range.getHtmlElement().querySelector('input');
      expect(input).to.be.instanceOf(HTMLInputElement);
      expect(input?.min).to.equal('5');
      expect(input?.max).to.equal('100');
    });
    it('should have the correct default step value', () => {
      expect(new Range(5, 100, 1).getHtmlElement().querySelector('input')?.step).to.equal('1');
    });
    it('should have the correct set step value', () => {
      expect(new Range(5, 100, 15).getHtmlElement().querySelector('input')?.step).to.equal('15');
    });
    it('should create the min-max-labels', () => {
      const range = new Range(8, 66, 1).enableMinMaxLabels();

      const labels = range.getHtmlElement().querySelectorAll('span');
      expect(labels.length).to.be.equal(2);
      expect(labels[0].textContent).to.be.equal('8');
      expect(labels[1].textContent).to.be.equal('66');
    });
    it('should show the step-ticks', () => {
      const range = new Range(8, 66, 1).enableTicks();

      const element = range.getHtmlElement().querySelector('input');
      expect(Array.from(element?.classList ?? [])).to.contain('with-ticks');
    });
    it('should set value on the range-input', () => {
      const input = new Range(1, 100, 1);
      input.setValue('55');
      expect(input.getHtmlElement().querySelector('input')?.value).to.equal('55');
    });
    it('should not change the value if its something it cannot handle', () => {
      const input = new Range(1, 100, 1);
      input.setValue({ foo: '123' });
      expect(input.getHtmlElement().querySelector('input')?.value).to.equal('50');
    });
  });

  describe('default/parent features', () => {
    it('should set the label', () => {
      const range = new Range(0, 100, 1);
      range.setLabel('the label');
      expect(
        Array.from(range.getHtmlElement().querySelectorAll('div')).filter((div) => div.textContent === 'the label'),
      ).to.be.lengthOf(1);
    });
    it('should set the main element value', () => {
      const range = new Range(0, 100, 1);
      range.setValue('5');
      expect(range.value).to.equal('5');
    });
    it('should return the same html for multiple getHtmlElement calls', () => {
      const input = new Range(0, 11, 1).setLabel('the label');
      const html = input.getHtmlElement().innerHTML;
      expect(input.getHtmlElement().innerHTML).to.equal(html);
    });
    it('should call the showOn callback directly after setting it', (done) => {
      const range = new Range(0, 100, 1);
      range.showOn(() => {
        done();
        return true;
      });
    });
    it('should call the showOn callback after a settings change got reported', (done) => {
      const range = new Range(0, 100, 1);
      let callback = () => {
        callback = () => {
          done();
          return true;
        };
        return true;
      };
      range.showOn(() => callback());
      range.reportSettingsChange();
    });
    it('should hide the element if showOn returned false and show it again after it returned true', () => {
      const range = new Range(0, 100, 1);
      const element: HTMLElement = range.getHtmlElement();
      range.showOn(() => false);
      expect(element.style.display).to.equal('none');
      range.showOn(() => true);
      expect(element.style.display).to.not.equal('none');
    });
    it('should emit the value-change-event after the input value got changed', (done) => {
      const range = new Range(0, 100, 1);
      range.on('change-value', () => done());
      const element = range.getHtmlElement().querySelector('input');
      element?.dispatchEvent(new Event('input'));
    });
  });
});
