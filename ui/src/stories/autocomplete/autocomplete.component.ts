import { Component, OnInit, inject, input, effect } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UntypedFormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

export interface StateGroup {
  letter: string;
  names: string[];
}
export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'oui-autocomplete-storybook',
  template: `
    <oui-form-field
      [appearance]="appearance()"
      style="max-width:300px;display:block;"
    >
      <input [formControl]="myControl" oui-input [ouiAutocomplete]="auto" />
    </oui-form-field>
    <oui-autocomplete
      (closed)="closed()"
      (opened)="opened()"
      (click)="optionSelected($event)"
      [autoActiveFirstOption]="autoActiveFirstOption()"
      #auto="ouiAutocomplete"
    >
      @for (option of filteredOptions | async; track option) {
      <oui-option [value]="option">
        {{ option }}
      </oui-option>
      }
    </oui-autocomplete>
  `,
  standalone: false,
})
export class OuiAutocompleteStorybook implements OnInit {
  filteredOptions: Observable<any[]>;
  myControl = new UntypedFormControl();
  readonly options = input<any[]>();
  readonly appearance = input<string>();
  readonly autoActiveFirstOption = input<boolean>();
  readonly disabled = input<boolean>();
  constructor() {
    effect(() => {
      if (this.disabled()) {
        this.myControl.disable();
      } else {
        this.myControl.enable();
      }
    });
  }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith<string>(''),
      map((value) => (typeof value === 'string' ? value : value)),
      map((option) =>
        option ? this._filter(option) : (this.options() ?? []).slice()
      )
    );
  }
  private _filter(option): string[] {
    const filterValue = option.toLowerCase();

    return (this.options() ?? []).filter(
      // eslint-disable-next-line no-shadow
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }
}

@Component({
  selector: 'oui-autocomplete-group-storybook',
  template: `
    <oui-form-field
      [formGroup]="stateForm"
      [appearance]="appearance()"
      style="max-width:300px;display:block;"
    >
      <input
        type="text"
        formControlName="stateGroup"
        oui-input
        [ouiAutocomplete]="autoGroup"
      />
      <oui-autocomplete
        (closed)="closed()"
        (opened)="opened()"
        (click)="optionSelected($event)"
        #autoGroup="ouiAutocomplete"
        class="autocomplete-group"
        [autoActiveFirstOption]="autoActiveFirstOption()"
      >
        @for (group of stateGroupOptions | async; track group) {
        <oui-optgroup [label]="group.letter">
          @for (name of group.names; track name) {
          <oui-option [value]="name">
            {{ name }}
          </oui-option>
          }
        </oui-optgroup>
        }
      </oui-autocomplete>
    </oui-form-field>
  `,
  standalone: false,
})
export class OuiAutocompleteGroupStorybook implements OnInit {
  private fb = inject(UntypedFormBuilder);

  readonly stateGroups = input<StateGroup[]>();
  readonly appearance = input<string>();
  readonly autoActiveFirstOption = input<boolean>();
  readonly disabled = input<boolean>();
  stateForm: UntypedFormGroup = this.fb.group({
    stateGroup: '',
  });
  stateGroupOptions: Observable<StateGroup[]>;

  constructor() {
    effect(() => {
      if (this.disabled()) {
        this.stateForm.get('stateGroup')!.disable();
      } else {
        this.stateForm.get('stateGroup')!.enable();
      }
    });
  }
  ngOnInit() {
    this.stateGroupOptions = this.stateForm
      .get('stateGroup')!
      .valueChanges.pipe(
        startWith(''),
        map((value: string) => this._filterGroup(value))
      );
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return (this.stateGroups() ?? [])
        .map((group) => ({
          letter: group.letter,
          names: _filter(group.names, value),
        }))
        .filter((group) => group.names.length > 0);
    }

    return this.stateGroups() ?? [];
  }
}
