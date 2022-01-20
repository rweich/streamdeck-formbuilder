import { ValueType } from './elements/ValueType';
import HtmlInputElementInterface from './HtmlInputElementInterface';

export default interface ElementInterface extends HtmlInputElementInterface {
  value: ValueType;
}
