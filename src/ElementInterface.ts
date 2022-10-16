import { ValueType } from './elements/ValueType';
import HtmlInputElementInterface from './HtmlInputElementInterface';

export default interface ElementInterface extends HtmlInputElementInterface {
  /** the current value of the element */
  value: ValueType;
}
