/**
 * Decode html characters
 */
function decodeHtml(text: string): string {
  if (text) {
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#92;/g, '\\')
      .replace(/&#39;/g, "'")
      .replace(/%40/g, '@')
      .replace(/%25/g, '=');
  }
  return text;
}

/**
 * Truncate a string over a given length and add ellipsis if necessary
 */
function truncate(str, limit) {
  return str.length > limit ? str.substring(0, limit) + ' ...' : str;
}

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'decode' })
export class DecodePipe implements PipeTransform {
  transform(value, isWithImage) {
    let decodedValue = decodeHtml(value);
    if (isWithImage) {
      decodedValue = truncate(decodedValue, 20);
    }
    return decodedValue;
  }
}
