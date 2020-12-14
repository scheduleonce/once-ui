import { action } from '@storybook/addon-actions';
import { select, boolean, object } from '@storybook/addon-knobs';
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
  title: 'Form Field/Autocomplete',
  component: OuiAutocomplete,
};

export const Regular = () => ({
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
  component: OuiAutocompleteStorybook,
  props: {
    appearance: select('appearance', ['standard', 'underline'], 'standard'),
    options: object('options', OPTIONS),
    autoActiveFirstOption: boolean('autoActiveFirstOption', false),
    closed: action('closed'),
    disabled: boolean('disabled', false),
    opened: action('opened'),
    optionSelected: action('optionSelected'),
  },
});

export const With_Groups = () => ({
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
  component: OuiAutocompleteGroupStorybook,
  props: {
    appearance: select('appearance', APPEARANCE, APPEARANCE[0]),
    stateGroups: object('options', STATEGROUPS),
    autoActiveFirstOption: boolean('autoActiveFirstOption', false),
    closed: action('closed'),
    disabled: boolean('disabled', false),
    opened: action('opened'),
    optionSelected: action('optionSelected'),
  },
});
