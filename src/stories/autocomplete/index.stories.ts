import { storiesOf } from '@storybook/angular';
import { setOptions } from '@storybook/addon-options';
import { action } from '@storybook/addon-actions';
import { select, boolean, object } from '@storybook/addon-knobs';
import { STATEGROUPS, OPTIONS } from './const';
import { APPEARANCE } from '../const';
import {
  OuiAutocompleteModule,
  OuiFormFieldModule,
  OuiInputModule
} from '../../../projects/ui/src/lib/oui';
import markdownText from '../../../projects/ui/src/lib/oui/autocomplete/README.md';
import { Input, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

export interface StateGroup {
  letter: string;
  names: string[];
}
export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
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
      (optionSelected)="optionSelected($event)"
      [autoActiveFirstOption]="autoActiveFirstOption"
      #auto="ouiAutocomplete"
    >
      <oui-option
        *ngFor="let option of (filteredOptions | async)"
        [value]="option"
      >
        {{ option }}
      </oui-option>
    </oui-autocomplete>
  `
})
export class OuiAutocompleteStorybook implements OnInit {
  filteredOptions: Observable<any[]>;
  myControl = new FormControl();
  @Input() options: any[];
  @Input()
  set disabled(value: boolean) {
    if (value) this.myControl.disable();
    else this.myControl.enable();
  }
  constructor() {}
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith<string>(''),
      map(value => (typeof value === 'string' ? value : value)),
      map(option => (option ? this._filter(option) : this.options.slice()))
    );
  }
  private _filter(option: string): any[] {
    const filterValue = option.toLowerCase();

    return this.options.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
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
        (optionSelected)="optionSelected($event)"
        #autoGroup="ouiAutocomplete"
        class="autocomplete-group"
        [autoActiveFirstOption]="autoActiveFirstOption"
      >
        <oui-optgroup
          *ngFor="let group of (stateGroupOptions | async)"
          [label]="group.letter"
        >
          <oui-option *ngFor="let name of group.names" [value]="name">
            {{ name }}
          </oui-option>
        </oui-optgroup>
      </oui-autocomplete>
    </oui-form-field>
  `
})
export class OuiAutocompleteGroupStorybook implements OnInit {
  @Input() stateGroups: any[];
  @Input()
  set disabled(value: boolean) {
    if (value) this.stateForm.get('stateGroup')!.disable();
    else this.stateForm.get('stateGroup')!.enable();
  }
  stateForm: FormGroup = this.fb.group({
    stateGroup: ''
  });
  stateGroupOptions: Observable<StateGroup[]>;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.stateGroupOptions = this.stateForm
      .get('stateGroup')!
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({
          letter: group.letter,
          names: _filter(group.names, value)
        }))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }
}

storiesOf('Form Field/Autocomplete', module)
  .add(
    'Regular',
    () => ({
      setOptions: setOptions({ downPanelInRight: true }),
      moduleMetadata: {
        imports: [
          OuiFormFieldModule,
          OuiInputModule,
          OuiAutocompleteModule,
          FormsModule,
          ReactiveFormsModule
        ],
        schemas: [],
        declarations: []
      },
      component: OuiAutocompleteStorybook,
      props: {
        appearance: select('appearance', ['standard', 'underline'], 'standard'),
        options: object('options', OPTIONS),
        autoActiveFirstOption: boolean('autoActiveFirstOption', false),
        closed: action('closed'),
        disabled: boolean('disabled', false),
        opened: action('opened'),
        optionSelected: action('optionSelected')
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'With groups',
    () => ({
      setOptions: setOptions({ downPanelInRight: true }),
      moduleMetadata: {
        imports: [
          OuiFormFieldModule,
          OuiInputModule,
          OuiAutocompleteModule,
          FormsModule,
          ReactiveFormsModule
        ],
        schemas: [],
        declarations: []
      },
      component: OuiAutocompleteGroupStorybook,
      props: {
        appearance: select('appearance', APPEARANCE, APPEARANCE[0]),
        stateGroups: object('options', STATEGROUPS),
        autoActiveFirstOption: boolean('autoActiveFirstOption', false),
        closed: action('closed'),
        disabled: boolean('disabled', false),
        opened: action('opened'),
        optionSelected: action('optionSelected')
      }
    }),
    { notes: { markdown: markdownText } }
  );
