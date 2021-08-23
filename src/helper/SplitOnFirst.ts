// @see split-on-first package
// for some weird reason mocha couldn't import this without throwing an error every time -.-
export default function splitOnFirst(string: string, separator: string): string[] {
  if (string === '' || separator === '') {
    return [];
  }

  const separatorIndex = string.indexOf(separator);

  if (separatorIndex === -1) {
    return [];
  }

  return [string.slice(0, separatorIndex), string.slice(separatorIndex + separator.length)];
}
