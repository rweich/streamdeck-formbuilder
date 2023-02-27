export type CustomizeRangeEventTypes = {
  changeValue: (range: HTMLInputElement, newValue: string) => void;
  createRange: (range: HTMLInputElement) => void;
};
