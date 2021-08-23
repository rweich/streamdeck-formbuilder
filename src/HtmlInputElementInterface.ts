import HtmlElementInterface from '@/HtmlElementInterface';

export default interface HtmlInputElementInterface extends HtmlElementInterface {
  setValue(value: string | Record<string, string>): void;
}
