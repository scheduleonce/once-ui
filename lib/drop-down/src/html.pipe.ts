/**
 * Decode html characters
 * param {string} text
 * returns {string}
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
 * param {string} str - string to be truncated
 * param {integer} limit - max length of the string before truncating
 * return {string} truncated string
 */
function truncate(str, limit) {
  return str.length > limit ? str.substring(0, limit) + ' ...' : str;
}

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'decode' })
export class DecodePipe implements PipeTransform {
  transform(value, truncateLimit, isNoResults = false) {
    let decodedValue = decodeHtml(value);
    truncateLimit = truncateLimit === 'false' ? 0 : truncateLimit;
    const limit = parseInt(truncateLimit, 10);
    if (limit && !isNoResults) {
      decodedValue = truncate(decodedValue, limit);
    }
    return decodedValue;
  }
}