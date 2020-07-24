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
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  @ViewChild('searchSelectInput', { read: ElementRef, static: true })
  searchSelectInput: ElementRef;
  private _value: string;
  private onChange: (value: any) => void = () => {};
  onTouched = () => {};

  /** Previously selected values when using <oui-select [multiple]="true">*/
  private previousSelectedValues: any[];
  
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();
  
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
    this.initMultipleHandling();
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
  private initMultipleHandling() {
    // if <oui-select [multiple]="true">
    // store previously selected values and restore them when they are deselected
    // because the option is not available while we are currently filtering
    this.ouiSelect.valueChange
      .pipe(takeUntil(this._onDestroy))
      .subscribe((values) => {
        if (this.ouiSelect.multiple) {
          let restoreSelectedValues = false;
          if (this._value && this._value.length
            && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
            if (!values || !Array.isArray(values)) {
              values = [];
            }
            const optionValues = this.ouiSelect.options.map(option => option.value);
            this.previousSelectedValues.forEach(previousValue => {
              if (values.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1) {
                // if a value that was selected before is deselected and not found in the options, it was deselected
                // due to the filtering, so we restore it.
                values.push(previousValue);
                restoreSelectedValues = true;
              }
            });
          }

          if (restoreSelectedValues) {
            this.ouiSelect._onChange(values);
          }

          this.previousSelectedValues = values;
          if(!this.previousSelectedValues || this.previousSelectedValues.length == 0){
            this.ouiSelect.initialValue = "";
          }
        }
      });
  }
}
