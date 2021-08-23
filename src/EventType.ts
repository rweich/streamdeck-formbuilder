export type EventType = {
  'change-settings': () => void;
  'change-value': () => void;
  'click-link': (element: HTMLAnchorElement) => void;
};
