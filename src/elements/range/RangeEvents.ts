export interface RangeEvents {
  'update-value': (range: HTMLInputElement, newValue: string) => void;
  'create-range': (range: HTMLInputElement) => void;
  'enable-ticks': () => void;
}
