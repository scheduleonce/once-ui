import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  Optional,
  AfterViewChecked,
  forwardRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OuiSelect } from '../select.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'oui-select-search',
  templateUrl: './option-search.html',
  styleUrls: ['./option-search.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OuiSelectSearchComponent),
      multi: true
    }
  ]
})
export class OuiSelectSearchComponent
  implements OnInit, AfterViewChecked, ControlValueAccessor {
  /** Label of the search placeholder */
  @Input() placeholderLabel = '';

  /** Reference to the search input field */
  @ViewChild('searchSelectInput', { read: ElementRef })
  searchSelectInput: ElementRef;
  private _value: string;
  private onChange: (value: any) => void = () => {};
  onTouched = () => {};

  constructor(
    @Inject(OuiSelect) public ouiSelect: OuiSelect,
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {}
  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnInit() {
    // when the select dropdown panel is opened or closed
    this.ouiSelect.openedChange.subscribe(opened => {
      if (opened) {
        // focus the search field when opening
        this._focus();
      } else {
        // clear it when closing
        this._reset();
      }
    });
  }

  writeValue(value: any): void {
    this.onChange(value);
  }

  onInputChange(value) {
    const valueChanged = value !== this._value;
    if (valueChanged) {
      this._value = value;
      this.onChange(value);
    }
  }

  ngAfterViewChecked() {
    if (this._document.querySelector('.oui-select-search-inner')) {
      this.scrollCalc();
    }
  }
  scrollCalc() {
    const searchInput = this._document.querySelector(
      '.oui-select-search-inner'
    );
    const outter = this._document.querySelector('.oui-select-panel');
    let inner = this._document.querySelector('.oui-option');
    if (inner === null) {
      inner = 0;
    }
    const scrollbarWidth = outter.offsetWidth - inner.offsetWidth;
    if (scrollbarWidth > 5) {
      searchInput.style.width = `${inner.offsetWidth}px`;
    } else {
      searchInput.style.width = `calc(100% + 8px)`;
    }
  }

  /**
   * Focuses the search input field
   */
  public _focus() {
    if (!this.searchSelectInput) {
      return;
    }
    // focus
    setTimeout(_ => this.searchSelectInput.nativeElement.focus());
    this.ouiSelect.ouiSelectInputOuter();
  }

  /**
   * Resets the current search value
   * focus whether to focus after resetting
   */
  public _reset(focus?: boolean) {
    if (!this.searchSelectInput) {
      return;
    }
    this.searchSelectInput.nativeElement.value = '';
    this.onInputChange('');
    if (focus) {
      this._focus();
    }
  }
}
