import 'mocha';

import { expect } from 'chai';

import Input from '@/elements/Input';

describe('Input', () => {
  describe('Input-specific features', () => {
    it('should set the placeholder', () => {
      const input = new Input().setPlaceholder('place');
      expect(input.getHtmlElement().querySelector('input')?.placeholder).to.equal('place');
    });
    it('should set value on the input', () => {
      const input = new Input();
      input.setValue('new value');
      expect(input.getHtmlElement().querySelector('input')?.value).to.equal('new value');
    });
  });

  describe('default/parent features', () => {
    it('should set the label', () => {
      const input = new Input().setLabel('the label');
      expect(input.getHtmlElement().querySelector('.sdpi-item-label')?.textContent).to.equal('the label');
    });
    it('should set the main element value', () => {
      const input = new Input();
      input.setValue('the value');
      expect(input.value).to.equal('the value');
    });
    it('should return the same html for multiple getHtmlElement calls', () => {
      const input = new Input().setLabel('the label');
      const html = input.getHtmlElement().innerHTML;
      expect(input.getHtmlElement().innerHTML).to.equal(html);
    });
    it('should call the showOn callback directly after setting it', (done) => {
      const input = new Input();
      input.showOn(() => {
        done();
        return true;
      });
    });
    it('should call the showOn callback after a settings change got reported', (done) => {
      const input = new Input();
      let callback = () => {
        callback = () => {
          done();
          return true;
        };
        return true;
      };
      input.showOn(() => callback());
      input.reportSettingsChange();
    });
    it('should hide the element if showOn returned false and show it again after it returned true', () => {
      const input = new Input();
      const element: HTMLElement = input.getHtmlElement();
      input.showOn(() => false);
      expect(element.style.display).to.equal('none');
      input.showOn(() => true);
      expect(element.style.display).to.not.equal('none');
    });
    it('should emit the value-change-event after the input value got changed', (done) => {
      const input = new Input();
      input.on('change-value', () => done());
      const element = input.getHtmlElement().querySelector('input');
      element?.dispatchEvent(new Event('input'));
    });
  });
});
