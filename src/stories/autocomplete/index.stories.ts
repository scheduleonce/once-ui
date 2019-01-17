import { storiesOf } from '@storybook/angular';
import { setOptions } from '@storybook/addon-options';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  select,
  boolean,
  number,
  object
} from '@storybook/addon-knobs';
import {
  OuiAutocompleteModule,
  OuiFormFieldModule,
  OuiInputModule
} from '../../../projects/ui/src/lib/oui';

let options: string[] = ['Scheduleonce', 'Inviteonce', 'Chatonce'];
let stateGroups = [
  {
    letter: 'A',
    names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
  },
  {
    letter: 'C',
    names: ['California', 'Colorado', 'Connecticut']
  },
  {
    letter: 'D',
    names: ['Delaware']
  },
  {
    letter: 'F',
    names: ['Florida']
  }
];

storiesOf('Autocomplete', module)
  .add('default', () => ({
    setOptions: setOptions({ downPanelInRight: true }),
    moduleMetadata: {
      imports: [OuiFormFieldModule, OuiInputModule, OuiAutocompleteModule],
      schemas: [],
      declarations: []
    },
    template: `<oui-form-field [appearance]="appearance" style="max-width:300px;display:block;">
                <input [disabled]="disabled" oui-input [ouiAutocomplete]="auto"/>
              </oui-form-field>
              <oui-autocomplete (closed)="closed()" (opened)="opened()" (optionSelected)="optionSelected($event)" [autoActiveFirstOption]="autoActiveFirstOption" #auto="ouiAutocomplete">
                <oui-option *ngFor="let option of options" [value]="option">
                  {{option}}
                </oui-option>
              </oui-autocomplete>`,
    props: {
      appearance: select('appearance', ['standard', 'underline'], 'standard'),
      options: object('options', options),
      // autoActiveFirstOption:boolean("autoActiveFirstOption",false), will be added
      closed: action('closed'),
      disabled: boolean('disabled', false),
      opened: action('opened'),
      optionSelected: action('optionSelected')
    }
  }))
  .add('with groups', () => ({
    setOptions: setOptions({ downPanelInRight: true }),
    moduleMetadata: {
      imports: [OuiFormFieldModule, OuiInputModule, OuiAutocompleteModule],
      schemas: [],
      declarations: []
    },
    template: `<oui-form-field [appearance]="appearance" style="max-width:300px;display:block;">
                <input [disabled]="disabled" type="text" oui-input [ouiAutocomplete]="autoGroup"/>
                  <oui-autocomplete (closed)="closed()" (opened)="opened()" (optionSelected)="optionSelected($event)" #autoGroup="ouiAutocomplete" class="autocomplete-group">
                    <oui-optgroup *ngFor="let group of stateGroups" [label]="group.letter">
                      <oui-option *ngFor="let name of group.names" [value]="name">
                        {{name}}
                      </oui-option>
                  </oui-optgroup>
                </oui-autocomplete>
              </oui-form-field>`,
    props: {
      appearance: select('appearance', ['standard', 'underline'], 'standard'),
      stateGroups: object('options', stateGroups),
      // autoActiveFirstOption:boolean("autoActiveFirstOption",false), will be added
      closed: action('closed'),
      disabled: boolean('disabled', false),
      opened: action('opened'),
      optionSelected: action('optionSelected')
    }
  }));
