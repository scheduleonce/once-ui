import { action } from 'storybook/actions';
import {
  OuiAutocompleteModule,
  OuiChipsModule,
  OuiFormFieldModule,
  OuiIconModule,
} from '../../components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { THEME } from '../const';
import { OuiChipsAutocompleteStorybook } from './chips-autocomplete.component';

export default {
  title: 'FORM FIELD/Chips',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [
        OuiFormFieldModule,
        OuiAutocompleteModule,
        OuiChipsModule,
        OuiIconModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      schemas: [],
      declarations: [OuiChipsAutocompleteStorybook],
    },

    template: `<oui-chips-autocomplete-storybook
        [appearance]="appearance"
        [disabled]="disabled"
        [addOnBlur]="addOnBlur"
        ngClass="{{theme}}"
        (chipAdded)="onChipAdded($event)"
        (chipRemoved)="onChipRemoved($event)"
        (autocompleteOptionSelected)="onAutocompleteOptionSelected($event)"
      ></oui-chips-autocomplete-storybook>`,

    component: OuiChipsAutocompleteStorybook,

    props: {
      ...props,
      onChipAdded: action('chips/chipAdded'),
      onChipRemoved: action('chips/chipRemoved'),
      onAutocompleteOptionSelected: action('chips/autocompleteOptionSelected'),
    },
  }),

  name: 'Regular',
  height: '240px',

  parameters: {
    docs: {
      source: {
        code: `
          <oui-form-field>
            <oui-chip-grid #chipGrid [value]="fruits" (change)="onChange($event)">
              @for (fruit of fruits; track fruit) {
                <oui-chip-row [value]="fruit" (removed)="remove(fruit)">
                  {{fruit}}
                  <button ouiChipRemove aria-label="remove">
                    <oui-icon svgIcon="x-close-small"></oui-icon>
                  </button>
                </oui-chip-row>
              }
            </oui-chip-grid>
            <input
              placeholder="New fruit..."
              [ouiChipAutocomplete]="auto"
              [formControl]="currentFruitCtrl"
              [ouiChipInputFor]="chipGrid"
              [ouiChipInputSeparatorKeyCodes]="separatorKeysCodes"
              [ouiChipInputAddOnBlur]="addOnBlur"
              (ouiChipInputTokenEnd)="add($event)"
            />
            <oui-chips-autocomplete #auto="ouiChipsAutocomplete" (optionSelected)="selected($event)">
              @for (fruit of filteredFruits; track fruit) {
                <oui-chips-option [value]="fruit">{{fruit}}</oui-chips-option>
              }
            </oui-chips-autocomplete>
          </oui-form-field>
        `,
      },
    },
  },

  args: {
    appearance: 'standard',
    disabled: false,
    addOnBlur: true,
    theme: THEME[0],
  },

  argTypes: {
    appearance: {
      options: ['standard', 'underline'],
      control: {
        type: 'select',
      },
    },
    theme: {
      options: THEME,
      control: {
        type: 'select',
      },
    },
  },
};
