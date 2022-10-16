import HtmlElementInterface from '@/HtmlElementInterface';

export default interface HtmlInputElementInterface extends HtmlElementInterface {
  /** sets the value of the element */
  setValue(value: string | Record<string, string>): void;
}
