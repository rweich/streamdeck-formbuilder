import 'mocha';

import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { is } from 'ts-type-guards';

import Details from '@/elements/Details';
import Dropdown from '@/elements/Dropdown';
import Input from '@/elements/Input';
import Range from '@/elements/Range';
import FormBuilder from '@/FormBuilder';

describe('FormBuilder', () => {
  describe('getFormData', () => {
    it('should return the initial data if no elements were attached', () => {
      const builder = new FormBuilder({ a: '1', b: '2' });
      const data = builder.getFormData();
      expect(data.a).to.equal('1');
      expect(data.b).to.equal('2');
      expect(Object.values(data)).to.be.lengthOf(2);
    });
    it('should return the initial data if elements were attached', () => {
      const builder = new FormBuilder({ a: '1', b: '2' });
      builder.addElement('a', builder.createInput());
      builder.addElement('b', builder.createInput());
      const data = builder.getFormData();
      expect(data.a).to.equal('1');
      expect(data.b).to.equal('2');
      expect(Object.values(data)).to.be.lengthOf(2);
    });
    it('should return the changed data after inputs were changed', () => {
      const builder = new FormBuilder({ a: '1', b: '2' });
      builder.addElement('a', builder.createInput());
      builder.addElement('b', builder.createInput());
      const dom = new JSDOM();
      builder.appendTo(dom.window.document.body);
      const inputs: HTMLInputElement[] = Array.from(dom.window.document.querySelectorAll('input'));
      inputs[0].value = 'foo';
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = 'bar';
      inputs[1].dispatchEvent(new Event('input'));
      const data = builder.getFormData();
      expect(data.a).to.equal('foo');
      expect(data.b).to.equal('bar');
      expect(Object.values(data)).to.be.lengthOf(2);
    });
  });
  describe('appendTo', () => {
    it('should append the right input-elements to the passed html-element', () => {
      const builder = new FormBuilder({ a: '1', b: '2' });
      builder.addElement('a', builder.createInput());
      builder.addElement('b', builder.createInput());
      const dom = new JSDOM();
      builder.appendTo(dom.window.document.body);
      const inputs: HTMLInputElement[] = Array.from(dom.window.document.querySelectorAll('input'));
      expect(inputs).to.be.lengthOf(2);
      expect(inputs[0].value).to.equal('1');
      expect(inputs[1].value).to.equal('2');
    });
    it('should append the elements in the order they were added to the builder', () => {
      const builder = new FormBuilder({ a: '1', b: '2' });
      builder.addElement('a', builder.createInput());
      builder.addHtml(new Details().addHeadline('foo'));
      builder.addElement('b', builder.createInput());
      builder.addHtml(new Details().addHeadline('bar'));
      const dom = new JSDOM();
      builder.appendTo(dom.window.document.body);
      const childs = dom.window.document.body.children;
      expect(childs).to.be.lengthOf(4);
      expect(childs[0].querySelector('input')?.value).to.equal('1');
      expect(childs[1].innerHTML).to.contain('foo');
      expect(childs[2].querySelector('input')?.value).to.equal('2');
      expect(childs[3].innerHTML).to.contain('bar');
    });
  });
  describe('on', () => {
    it('should emit the change-settings event if one value changed', (done) => {
      const builder = new FormBuilder({ a: '1', b: '2' });
      builder.addElement('a', builder.createInput());
      builder.addElement('b', builder.createInput());
      const dom = new JSDOM();
      builder.appendTo(dom.window.document.body);
      builder.on('change-settings', () => {
        done();
      });
      const inputs: HTMLInputElement[] = Array.from(dom.window.document.querySelectorAll('input'));
      inputs[0].dispatchEvent(new Event('input'));
    });
  });
  describe('create.. methods return the correct instances', () => {
    describe('createInput', () => {
      it('should return an input element', () => {
        const builder = new FormBuilder({ a: '1' });
        expect(is(Input)(builder.createInput())).to.be.true;
      });
    });
    describe('createDropdown', () => {
      it('should return an dropdown element', () => {
        const builder = new FormBuilder({ a: '1' });
        expect(is(Dropdown)(builder.createDropdown())).to.be.true;
      });
    });
    describe('createDetails', () => {
      it('should return an details element', () => {
        const builder = new FormBuilder({ a: '1' });
        expect(is(Details)(builder.createDetails())).to.be.true;
        builder.addHtml(builder.createDetails());
        const htmlElement = document.createElement('div');
        builder.appendTo(htmlElement);
      });
    });
    describe('createRange', () => {
      it('should return an range-input element', () => {
        const builder = new FormBuilder({ a: '1' });
        expect(is(Range)(builder.createRange(1, 2))).to.be.true;
      });
    });
  });
  describe('addXX methods add the elements to the final html', () => {
    describe('addHtml with Details', () => {
      it('should add details', () => {
        const builder = new FormBuilder({ a: '1' });
        builder.addHtml(builder.createDetails().addHeadline('a headline'));
        const htmlElement = document.createElement('div');
        builder.appendTo(htmlElement);
        expect(htmlElement.innerHTML).to.contain('<details><h4>a headline</h4></details>');
      });
    });
    describe('addHtmlElement', () => {
      it('should add the passed element', () => {
        const builder = new FormBuilder({ a: '1' });
        const element = document.createElement('p');
        element.textContent = 'foobar';
        builder.addHtmlElement(element);
        const htmlElement = document.createElement('div');
        builder.appendTo(htmlElement);
        const result = htmlElement.querySelector('p');
        expect(result?.nodeName).to.equal('P');
        expect(result?.textContent).to.equal('foobar');
      });
    });
  });
  describe('setFormData', () => {
    it('should set the new data', () => {
      const builder = new FormBuilder({ a: '1', b: '2' });
      builder.addElement('a', builder.createInput());
      builder.addElement('b', builder.createInput());
      builder.setFormData({ a: '3', b: '4' });
      const data = builder.getFormData();
      expect(data.a).to.equal('3');
      expect(data.b).to.equal('4');
    });
  });
});
