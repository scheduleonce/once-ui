import { Input, Component, OnInit } from '@angular/core';
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
      [appearance]="appearance"
      style="max-width:300px;display:block;"
    >
      <input [formControl]="myControl" oui-input [ouiAutocomplete]="auto" />
    </oui-form-field>
    <oui-autocomplete
      (closed)="closed()"
      (opened)="opened()"
      (click)="optionSelected($event)"
      [autoActiveFirstOption]="autoActiveFirstOption"
      #auto="ouiAutocomplete"
    >
      <oui-option
        *ngFor="let option of filteredOptions | async"
        [value]="option"
      >
        {{ option }}
      </oui-option>
    </oui-autocomplete>
  `,
})
export class OuiAutocompleteStorybook implements OnInit {
  filteredOptions: Observable<any[]>;
  myControl = new UntypedFormControl();
  @Input() options: any[];
  @Input()
  set disabled(value: boolean) {
    if (value) {
      this.myControl.disable();
    } else {
      this.myControl.enable();
    }
  }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith<string>(''),
      map((value) => (typeof value === 'string' ? value : value)),
      map((option) => (option ? this._filter(option) : this.options.slice()))
    );
  }
  private _filter(option): string[] {
    const filterValue = option.toLowerCase();

    return this.options.filter(
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
      [appearance]="appearance"
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
        [autoActiveFirstOption]="autoActiveFirstOption"
      >
        <oui-optgroup
          *ngFor="let group of stateGroupOptions | async"
          [label]="group.letter"
        >
          <oui-option *ngFor="let name of group.names" [value]="name">
            {{ name }}
          </oui-option>
        </oui-optgroup>
      </oui-autocomplete>
    </oui-form-field>
  `,
})
export class OuiAutocompleteGroupStorybook implements OnInit {
  @Input() stateGroups: StateGroup[];
  @Input()
  set disabled(value: boolean) {
    if (value) {
      this.stateForm.get('stateGroup')!.disable();
    } else {
      this.stateForm.get('stateGroup')!.enable();
    }
  }
  stateForm: UntypedFormGroup = this.fb.group({
    stateGroup: '',
  });
  stateGroupOptions: Observable<StateGroup[]>;

  constructor(private fb: UntypedFormBuilder) {}
  ngOnInit() {
    console.log(this.stateGroups);
    this.stateGroupOptions = this.stateForm
      .get('stateGroup')!
      .valueChanges.pipe(
        startWith(''),
        map((value: string) => this._filterGroup(value))
      );
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map((group) => ({
          letter: group.letter,
          names: _filter(group.names, value),
        }))
        .filter((group) => group.names.length > 0);
    }

    return this.stateGroups;
  }
}
