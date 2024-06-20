import {
  OuiSelectModule,
  OuiFormFieldModule,
  OuiInputModule,
  OuiSelect,
} from '../../components';
import { action } from '@storybook/addon-actions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APPEARANCE, THEME } from '../const';

export default {
  title: 'FORM FIELD/Select',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [
        OuiFormFieldModule,
        OuiInputModule,
        OuiSelectModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    },

    template: `
    <div style="width: 213px;">
      <oui-form-field [appearance]="appearance">
        <oui-select (selectionChange)="onChange($event)" ngClass="{{theme}}" [large]="large" [placeholder]="placeholder" [disabled]="disabled">
          <oui-option *ngFor="let option of options" [value]="option">
            {{option}}
          </oui-option>
        </oui-select>
      </oui-form-field>
    </div>
    `,

    props: {
      ...props,
      onChange: action('change'),
    },
  }),

  name: 'Regular',
  height: '350px',

  parameters: {
    docs: {
      source: {
        code: `<oui-form-field>
  <oui-select large placeholder="Favorite food">
    <oui-option *ngFor="let food of foods" [value]="food">
      {{food array}}
    </oui-option>
  </oui-select>
</oui-form-field>`,
      },
    },
  },

  args: {
    large: false,
    theme: THEME[0],
    disabled: false,
    appearance: APPEARANCE[0],
    placeholder: 'Favorite food',

    options: [
      'Pizza',
      'Burgers',
      'Steak',
      'Tacos',
      'Pasta',
      'Fries',
      'Momos',
      'Kababs',
      'Rolls',
      'Biryani',
      'Sweets',
    ],
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },

    appearance: {
      options: ['standard', 'underline'],

      control: {
        type: 'select',
      },
    },

    options: {
      control: {
        type: 'object',
      },
    },
  },
};

export const MultiSelect = {
  render: (props) => ({
    template: `
    <div style="width: 213px;">
    <oui-form-field [appearance]="appearance">
        <oui-select (saveSelectionChange)="onChange($event)" ngClass="{{theme}}" [large]="large" [placeholder]="placeholder" multiple actionItems [allowNoSelection]="allowNoSelection" [disabled]="disabled" [cancelLabel]="cancelLabel" [doneLabel]="doneLabel">
          <oui-option *ngFor="let option of options" [value]="option">
            {{option}}
          </oui-option>
        </oui-select>
      </oui-form-field>
    </div>
    `,

    props: {
      ...props,
      onChange: action('change'),
    },

    moduleMetadata: {
      imports: [
        OuiFormFieldModule,
        OuiInputModule,
        OuiSelectModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    },
  }),

  name: 'Multi select',
  height: '300px',

  parameters: {
    docs: {
      source: {
        code: `<oui-form-field>
  <oui-select large placeholder="Favorite food" multiple actionItems>
    <oui-option *ngFor="let food of foods" [value]="food">
      {{food array}}
    </oui-option>
  </oui-select>
</oui-form-field>`,
      },
    },
  },

  args: {
    large: false,
    theme: THEME[0],
    disabled: false,
    appearance: APPEARANCE[0],
    placeholder: 'Favorite food',

    options: [
      'Pizza',
      'Burgers',
      'Steak',
      'Tacos',
      'Pasta',
      'Fries',
      'Momos',
      'Kababs',
      'Rolls',
      'Biryani',
      'Sweets',
    ],

    cancelLabel: 'Discard',
    doneLabel: 'Apply',
    allowNoSelection: false,
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },

    appearance: {
      options: ['standard', 'underline'],

      control: {
        type: 'select',
      },
    },

    options: {
      control: {
        type: 'object',
      },
    },
  },
};

export const Groups = {
  render: (props) => ({
    template: `
    <div style="width: 213px;">
    <oui-form-field [appearance]="appearance">
        <oui-select ngClass="{{theme}}" (selectionChange)="onChange($event)" [large]="large" [placeholder]="placeholder" [disabled]="disabled">
          <oui-option>-- None --</oui-option>
          <oui-optgroup *ngFor="let group of groups" [label]="group.name">
            <oui-option *ngFor="let option of group.options" [value]="option">
              {{option}}
            </oui-option>
          </oui-optgroup>
        </oui-select>
      </oui-form-field>
    </div>
    `,

    props: {
      ...props,
      onChange: action('change'),
    },

    moduleMetadata: {
      imports: [
        OuiFormFieldModule,
        OuiInputModule,
        OuiSelectModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    },
  }),

  name: 'Groups',
  height: '350px',

  parameters: {
    docs: {
      source: {
        code: `<oui-form-field>
  <oui-select large placeholder="Favorite food" multiple>
    <oui-option>-- None --</oui-option>
    <oui-optgroup *ngFor="let group of foodGroups" [label]="group.name">
        <oui-option *ngFor="let food of foods" [value]="food">
        {{food array}}
        </oui-option>
    </oui-optgroup>
  </oui-select>
</oui-form-field>`,
      },
    },
  },

  args: {
    large: false,
    theme: THEME[0],
    disabled: false,
    appearance: APPEARANCE[0],
    placeholder: 'Favorite food',

    groups: [
      {
        name: 'Fruit',
        options: ['Apple', 'Orange'],
      },
      {
        name: 'Vegetables',
        options: [
          'Lettuce',
          'Broccoli',
          'Corn',
          'Cucumber',
          'Lettuce',
          'Pumpkin',
          'Tomato',
        ],
      },
      {
        name: 'Meats',
        options: ['Steak', 'Chicken'],
      },
    ],
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },

    appearance: {
      options: ['standard', 'underline'],

      control: {
        type: 'select',
      },
    },

    groups: {
      control: {
        type: 'object',
      },
    },
  },
};

export const SearchOptions = {
  render: (props) => ({
    template: `
    <div style="width: 213px;">
      <oui-form-field [appearance]="appearance">
        <oui-select (selectionChange)="onChange($event)" ngClass="{{theme}}" [large]="large" [placeholder]="placeholder" [disabled]="disabled">
          <oui-select-search [(ngModel)]="keyword"></oui-select-search>
          <oui-option *ngFor="let option of (options | filterOptions: keyword)" [value]="option">
            {{option}}
          </oui-option>
          <div
            *ngIf="!(options | filterOptions: keyword).length"
            class="noResults"
          >
            No results match "{{ keyword }}"
          </div>
        </oui-select>
      </oui-form-field>
    </div>
    `,

    props: {
      ...props,
      onChange: action('change'),
    },

    moduleMetadata: {
      imports: [
        OuiFormFieldModule,
        OuiInputModule,
        OuiSelectModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    },
  }),

  name: 'Search options',
  height: '300px',

  parameters: {
    docs: {
      source: {
        code: `<oui-form-field>
  <oui-select large placeholder="Favorite food" multiple actionItems>
    <oui-select-search [(ngModel)]="keyword"></oui-select-search>
    <oui-option *ngFor="let food of (foods | filterOptions: keyword)" [value]="food">
      {{food array}}
    </oui-option>
  </oui-select>
</oui-form-field>`,
      },
    },
  },

  args: {
    large: false,
    theme: THEME[0],
    disabled: false,
    appearance: APPEARANCE[0],
    placeholder: 'Favorite food',

    options: [
      'Pizza',
      'Burgers',
      'Steak',
      'Tacos',
      'Pasta',
      'Fries',
      'Momos',
      'Kababs',
      'Rolls',
      'Biryani',
      'Sweets',
    ],
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },

    appearance: {
      options: ['standard', 'underline'],

      control: {
        type: 'select',
      },
    },

    options: {
      control: {
        type: 'object',
      },
    },
  },
};
