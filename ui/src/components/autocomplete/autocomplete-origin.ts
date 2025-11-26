import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Directive applied to an element to make it usable
 * as a connection point for an autocomplete panel.
 */
@Directive({
  selector: '[ouiAutocompleteOrigin]',
  exportAs: 'ouiAutocompleteOrigin',
  standalone: false,
})
export class OuiAutocompleteOrigin {
  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
}
