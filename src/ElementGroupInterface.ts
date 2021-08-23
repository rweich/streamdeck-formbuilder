import ElementInterface from './ElementInterface';
import HtmlInputElementInterface from './HtmlInputElementInterface';

export default interface ElementGroupInterface extends HtmlInputElementInterface {
  value: Record<string, string>;
  elements: { [x: string]: ElementInterface };
}
