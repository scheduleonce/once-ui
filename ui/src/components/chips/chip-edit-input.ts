import { Directive, ElementRef, inject, DOCUMENT } from '@angular/core';

/**
 * A directive that makes a span editable and exposes functions to modify and retrieve the
 * element's contents.
 */
@Directive({
  selector: 'span[ouiChipEditInput]',
  host: {
    class: 'oui-chip-edit-input',
    role: 'textbox',
    tabindex: '-1',
    contenteditable: 'true',
  },
})
export class OuiChipEditInput {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _document = inject(DOCUMENT);

  initialize(initialValue: string) {
    this.getNativeElement().focus();
    this.setValue(initialValue);
  }

  getNativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  setValue(value: string) {
    this.getNativeElement().textContent = value;
    this._moveCursorToEndOfInput();
  }

  getValue(): string {
    return this.getNativeElement().textContent || '';
  }

  private _moveCursorToEndOfInput() {
    const range = this._document.createRange();
    range.selectNodeContents(this.getNativeElement());
    range.collapse(false);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
