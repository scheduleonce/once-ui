/**
 * Pipe for search in drop down
 * Searched drop down options
 * disabled is true when grouping is in array
 */
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterOptions',
  standalone: false,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, field: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    return items.filter((it) => {
      let results;
      // Support both array and the json object
      if (it[field]) {
        results = it[field].toLowerCase().includes(searchText.toLowerCase());
      } else {
        results = it.toLowerCase().includes(searchText.toLowerCase());
      }
      return results;
    });
  }
}
