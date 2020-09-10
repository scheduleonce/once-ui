import {
  OuiSelectModule,
  OuiFormFieldModule,
  OuiInputModule,
  OuiSelect,
} from '../../components';
import { array, boolean, text, object, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APPEARANCE } from '../const';

export default {
  title: 'Form Field/Select',
  component: OuiSelect,
};

export const Regular = () => ({
  template: `
    <div style="width: 213px;">
    <oui-form-field [appearance]="appearance">
        <oui-select (selectionChange)="onChange($event)" [large]="large" [placeholder]="placeholder" [disabled]="disabled">
          <oui-option *ngFor="let food of foods" [value]="food">
            {{food}}
          </oui-option>
        </oui-select>
      </oui-form-field>
    </div>
    `,
  props: {
    foods: array('foods', [
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
    ]),
    placeholder: text('placeholder', 'Favorite food'),
    disabled: boolean('disabled', false),
    large: boolean('large', false),
    onChange: action('change'),
    appearance: select('appearance', APPEARANCE, APPEARANCE[0]),
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
});

export const Multi = () => ({
  template: `
    <div style="width: 213px;">
    <oui-form-field [appearance]="appearance">
        <oui-select (selectionChange)="onChange($event)" [large]="large" [(ngModel)]="currentValue" [placeholder]="placeholder" multiple [disabled]="disabled">
        <oui-select-search [(ngModel)]="keyword"></oui-select-search>
        <oui-option *ngFor="let food of (foods | filterOptions: keyword)" [value]="food">
            {{food}}
          </oui-option>
        </oui-select>
      </oui-form-field>
    </div>
    <br><br><br><br><br><br>
    <button (click)="clearCurrentValue()">Clear</button>
    `,
  props: {
    foods: array('foods', ['Pizza', 'Burgers', 'Steak', 'Tacos']),
    placeholder: text('placeholder', 'Favorite food'),
    disabled: boolean('disabled', false),
    large: boolean('large', false),
    onChange: action('change'),
    currentValue:["Pizza"],
    clearCurrentValue : function(){
      this.currentValue = [];
    },
    appearance: select('appearance', APPEARANCE, APPEARANCE[0]),
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
});

export const Groups = () => ({
  template: `
    <div style="width: 213px;">
    <oui-form-field [appearance]="appearance">
        <oui-select (selectionChange)="onChange($event)" [large]="large" [placeholder]="placeholder" [disabled]="disabled">
          <oui-option>-- None --</oui-option>
          <oui-optgroup *ngFor="let group of foodGroups" [label]="group.name">
            <oui-option *ngFor="let food of group.foods" [value]="food">
              {{food}}
            </oui-option>
          </oui-optgroup>
        </oui-select>
      </oui-form-field>
    </div>
    `,
  props: {
    foodGroups: object('foodGroups', [
      {
        name: 'Fruit',
        foods: ['Apple', 'Orange'],
      },
      {
        name: 'Vegetables',
        foods: [
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
        foods: ['Steak', 'Chicken'],
      },
    ]),
    disabled: boolean('disabled', false),
    large: boolean('large', false),
    placeholder: text('placeholder', 'Foods'),
    onChange: action('change'),
    appearance: select('appearance', APPEARANCE, APPEARANCE[0]),
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
});

export const Search_Options = () => ({
  template: `
    <div style="width: 213px;">
      <oui-form-field [appearance]="appearance">
        <oui-select (selectionChange)="onChange($event)" [large]="large" [placeholder]="placeholder" [disabled]="disabled">
          <oui-select-search [(ngModel)]="keyword"></oui-select-search>
          <oui-option *ngFor="let food of (foods | filterOptions: keyword)" [value]="food">
            {{food}}
          </oui-option>
          <div
            *ngIf="!(foods | filterOptions: keyword).length"
            class="noResults"
          >
            No results match "{{ keyword }}"
          </div>
        </oui-select>
      </oui-form-field>
    </div>
    `,
  props: {
    foods: array('foods', ['Pizza', 'Burgers', 'Steak', 'Tacos']),
    placeholder: text('placeholder', 'Favorite food'),
    disabled: boolean('disabled', false),
    large: boolean('large', false),
    onChange: action('change'),
    appearance: select('appearance', APPEARANCE, APPEARANCE[0]),
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
});
