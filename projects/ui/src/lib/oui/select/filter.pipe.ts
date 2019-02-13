/**
 * Pipe for search in drop down
 * Searched drop down options
 * disabled is true when grouping is in array
 */
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterOptions'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, field: string = 'value'): any[] {
    if (!items) {
      return [];
    }
    const noResultObject = Object.keys(items[0]);

    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    items = items.filter(i => i.value !== '-1');
    items = items.filter(it => {
      return it[field] && it[field].toLowerCase().includes(searchText);
    });

    if (!items.length) {
      items = [];

      let noResult =
        noResultObject[0] === field
          ? {
              [noResultObject[0]]: `No results match "${searchText}"`,
              [noResultObject[1]]: ''
            }
          : {
              [noResultObject[1]]: `No results match "${searchText}"`,
              [noResultObject[0]]: ''
            };

      items.push(noResult);
    }
    return items;
  }
}
