import { action } from '@storybook/addon-actions';
import { STATEGROUPS, OPTIONS } from './const';
import { APPEARANCE } from '../const';
import {
  OuiAutocompleteModule,
  OuiFormFieldModule,
  OuiInputModule,
  OuiAutocomplete,
} from '../../components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  OuiAutocompleteStorybook,
  OuiAutocompleteGroupStorybook,
} from './autocomplete.component';

export default {
  title: 'FORM FIELD/Autocomplete',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [
        OuiFormFieldModule,
        OuiInputModule,
        OuiAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      schemas: [],
      declarations: [OuiAutocompleteStorybook],
    },

    template: `<oui-autocomplete-storybook 
        [appearance]=appearance 
        [autoActiveFirstOption]=autoActiveFirstOption 
        [options]=options
        [disabled]=disabled>
        </oui-autocomplete-storybook>`,

    component: OuiAutocompleteStorybook,

    props: {
      ...props,
      opened: action('opened'),
      optionSelected: action('optionSelected'),
    },
  }),

  name: 'Regular',
  height: '200px',

  parameters: {
    docs: {
      source: {
        code: `
          <oui-form-field>
            <input oui-input [ouiAutocomplete]="auto" />
          </oui-form-field>
          <oui-autocomplete #auto="ouiAutocomplete">
            <oui-option *ngFor="let option of options" [value]="option">
              {{ option }}
            </oui-option>
          </oui-autocomplete>`,
      },
    },
  },

  args: {
    options: OPTIONS,
    appearance: 'standard',
    autoActiveFirstOption: false,
  },

  argTypes: {
    options: {
      control: {
        type: 'object',
      },
    },

    appearance: {
      options: ['standard', 'underline'],

      control: {
        type: 'select',
      },
    },
  },
};

export const WithGroup = {
  render: (props) => ({
    moduleMetadata: {
      imports: [
        OuiFormFieldModule,
        OuiInputModule,
        OuiAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
      ],

      schemas: [],
      declarations: [OuiAutocompleteGroupStorybook],
    },

    template: `<oui-autocomplete-group-storybook 
        [appearance]=appearance 
        [autoActiveFirstOption]=autoActiveFirstOption 
        [stateGroups]=stateGroups
        [disabled]=disabled >
        </oui-autocomplete-group-storybook>`,

    component: OuiAutocompleteGroupStorybook,

    props: {
      ...props,
      closed: action('closed'),
      opened: action('opened'),
      optionSelected: action('optionSelected'),
    },
  }),

  name: 'With group',
  height: '400px',

  parameters: {
    docs: {
      source: {
        code: `
            <oui-form-field>
              <input oui-input [ouiAutocomplete]="auto" />
            </oui-form-field>
            <oui-autocomplete #auto="ouiAutocomplete">
              <oui-option *ngFor="let option of options" [value]="option">
                {{ option }}
              </oui-option>
            </oui-autocomplete>`,
      },
    },

    component: OuiAutocompleteGroupStorybook,
  },

  args: {
    disabled: false,
    appearance: 'standard',
    stateGroups: STATEGROUPS,
    autoActiveFirstOption: false,
  },

  argTypes: {
    appearance: {
      options: ['standard', 'underline'],

      control: {
        type: 'select',
      },
    },
  },
};
