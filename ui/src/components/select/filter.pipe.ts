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
  transform(items: any[], searchText: string, field: string | string[]): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }
    searchText = searchText.trim();
    let results;

    if (typeof field === 'string') {
      return items.filter((item) => {
        // Support both array and the json object
        if (item[field]) {
          results = item[field]
            .toLowerCase()
            .includes(searchText.toLowerCase());
        } else {
          results = item.toLowerCase().includes(searchText.toLowerCase());
        }
        return results;
      });
    } else {
      return items.filter((item) => {
        return field.some((f) => {
          if (item[f]) {
            results = item[f].toLowerCase().includes(searchText.toLowerCase());
          }
          return results;
        });
      });
    }
  }
}
