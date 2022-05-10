import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  Optional,
  AfterViewChecked,
  forwardRef,
  OnDestroy,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OuiSelect } from '../select.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OuiOption } from '../../core/option/option';

@Component({
  selector: 'oui-select-search',
  templateUrl: './option-search.html',
  styleUrls: ['./option-search.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OuiSelectSearchComponent),
      multi: true,
    },
  ],
})
export class OuiSelectSearchComponent
  implements OnInit, AfterViewChecked, ControlValueAccessor, OnDestroy
{
  /** Previously selected values when using <oui-select multiple>*/
  private previousSelectedValues: any[];

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  /** Label of the search placeholder */
  @Input() placeholderLabel = '';

  /** Reference to the search input field */
  @ViewChild('searchSelectInput', { read: ElementRef, static: true })
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
    this.ouiSelect.openedChange.subscribe((opened) => {
      if (opened) {
        // focus the search field when opening
        this._focus();
      } else {
        // clear it when closing
        this._reset();
      }
    });
    this.initMultipleHandling();
    this.storeInitialValuesIntoPrevious();
  }

  private storeInitialValuesIntoPrevious() {
    this.ouiSelect._openedStream
      .pipe(
        takeUntil(this._onDestroy),
        filter(() => this.ouiSelect.multiple)
      )
      .subscribe(() => {
        this.previousSelectedValues = (
          this.ouiSelect.selected as OuiOption[]
        ).map((option) => option.value);
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
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
    const searchQueryString = '.oui-select-search-inner';
    if (this._document.querySelector(searchQueryString)) {
      this.scrollCalc(searchQueryString);
    }
    const actionItemsQueryString = '.oui-select-action-items';
    if (this._document.querySelector(actionItemsQueryString)) {
      this.scrollCalc(actionItemsQueryString);
    }
  }
  scrollCalc(selectQueryString: string) {
    const searchInput = this._document.querySelector(selectQueryString);
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
    setTimeout((_) => this.searchSelectInput.nativeElement.focus());
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
  private initMultipleHandling() {
    // In oui-search, if we filter something then the options which has disappeared, will be treated as deselected. To avoid this problem we can store the previously selected value and restore them if those values are not available in visible option.
    this.ouiSelect.valueChange
      .pipe(takeUntil(this._onDestroy))
      .subscribe((values) => {
        if (this.ouiSelect.multiple) {
          let restoreSelectedValues = false;
          if (
            this._value &&
            this._value.length &&
            this.previousSelectedValues &&
            Array.isArray(this.previousSelectedValues)
          ) {
            if (!values || !Array.isArray(values)) {
              values = [];
            }
            const optionValues = this.ouiSelect.options.map(
              (option) => option.value
            );
            this.previousSelectedValues.forEach((previousValue) => {
              if (
                values.indexOf(previousValue) === -1 &&
                optionValues.indexOf(previousValue) === -1
              ) {
                // if a value that was selected before is not found in the options due to filtering then it will be treated as deselected
                // to avoid this we can push them again.
                values.push(previousValue);
                restoreSelectedValues = true;
              }
            });
          }

          if (restoreSelectedValues) {
            this.ouiSelect._onChange(values);
          }

          this.previousSelectedValues = values;
        }
      });
  }
}
