import HtmlInputElementInterface from './HtmlInputElementInterface';
import { ValueType } from './elements/ValueType';

export default interface ElementInterface extends HtmlInputElementInterface {
  value: ValueType;
}
