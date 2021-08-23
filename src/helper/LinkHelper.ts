import splitOnFirst from '@/helper/SplitOnFirst';

export type LinkEvents = {
  click: (event: HTMLAnchorElement) => void;
};

type LinkMatch = {
  href: string;
  match: string;
  text: string;
  title?: string;
};

export default class LinkHelper {
  // @see https://github.com/markedjs/marked/blob/master/src/rules.js
  private readonly regex =
    /!?\[((?:\[(?:\\.|[^[\\\]])*]|\\.|`[^`]*`|[^[\\\]`])*?)]\(\s*(<(?:\\.|[^\n<>\\])+>|[^\s\u0000-\u001F]*)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/g;

  public extractLinks(text: string): LinkMatch[] {
    const matches: LinkMatch[] = [];
    let result;
    while ((result = this.regex.exec(text)) !== null) {
      matches.push({
        href: result[2],
        match: result[0],
        text: result[1],
        title: result[3] === undefined ? undefined : result[3].slice(1, -1),
      });
    }
    return matches;
  }

  public addLinkedText(parentElement: HTMLElement, text: string, links: LinkMatch[]): HTMLElement {
    for (const [index, match] of links.entries()) {
      const splits = splitOnFirst(text, match.match);
      if (splits[0].length > 0) {
        parentElement.append(splits[0]);
      }
      const anchor = document.createElement('a');
      anchor.text = match.text;
      anchor.href = match.href;
      if (match.title) {
        anchor.title = match.title;
      }
      parentElement.append(anchor);
      if (splits[1] !== undefined && splits[1].length > 0) {
        if (index + 1 < links.length) {
          text = splits[1];
        } else {
          parentElement.append(splits[1]);
        }
      }
    }
    return parentElement;
  }
}
