import 'mocha';

import { expect } from 'chai';

import Dropdown from '@/elements/Dropdown';

describe('Dropdown', () => {
  describe('Dropdown-specific features', () => {
    it('should have all option elements', () => {
      const dropdown = new Dropdown().addOption('the o1', 'o1').addOption('the o2', 'o2').addOption('the o3', 'o3');
      const options = Array.from(dropdown.getHtmlElement().querySelectorAll('option'));
      expect(options).to.be.lengthOf(3);
      expect(options[0].textContent).to.equal('the o1');
      expect(options[1].textContent).to.equal('the o2');
      expect(options[2].textContent).to.equal('the o3');
    });
    it('should set value on the dropdown', () => {
      const input = new Dropdown().addOption('test', 'new value');
      input.setValue('new value');
      expect(input.getHtmlElement().querySelector('select')?.value).to.equal('new value');
    });
  });

  describe('default/parent features', () => {
    it('should set the label', () => {
      const dropdown = new Dropdown();
      dropdown.setLabel('the new label');
      expect(
        Array.from(dropdown.getHtmlElement().querySelectorAll('div')).filter(
          (div) => div.textContent === 'the new label',
        ),
      ).to.be.lengthOf(1);
    });
    it('should set the main element value', () => {
      const dropdown = new Dropdown().addOption('o0', 'the old value').addOption('o1', 'the new value');
      dropdown.setValue('the new value');
      expect(dropdown.value).to.equal('the new value');
    });
    it('should return the same html for multiple getHtmlElement calls', () => {
      const input = new Dropdown().setLabel('the label').addOption('one', '1').addOption('two', '2');
      const html = input.getHtmlElement().innerHTML;
      expect(input.getHtmlElement().innerHTML).to.equal(html);
    });
    it('should call the showOn callback directly after setting it', (done) => {
      const input = new Dropdown();
      input.showOn(() => {
        done();
        return true;
      });
    });
    it('should call the showOn callback after a settings change got reported', (done) => {
      const input = new Dropdown();
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
      const input = new Dropdown();
      const element: HTMLElement = input.getHtmlElement();
      input.showOn(() => false);
      expect(element.style.display).to.equal('none');
      input.showOn(() => true);
      expect(element.style.display).to.not.equal('none');
    });
    it('should emit the value-change-event after the elements value got changed', (done) => {
      const input = new Dropdown();
      input.on('change-value', () => done());
      const element = input.getHtmlElement().querySelector('select');
      element?.dispatchEvent(new Event('change'));
    });
  });
});
