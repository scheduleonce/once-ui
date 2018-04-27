/**
 * Pipe for search in drop down
 * Searched drop down options
 * disabled is true when grouping is in array
 */
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, field: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    items = items.filter(i => i.value !== '-1');
    items = items.filter(it => {
      return it[field].toLowerCase().includes(searchText);
    });
    if (!items.length) {
      items = [];
      items.push({
        [field]: `No results match "${searchText}"`,
        value: 'no_result'
      });
    }
    return items;
  }
}