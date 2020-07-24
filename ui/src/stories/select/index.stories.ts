import { storiesOf } from '@storybook/angular';
import {
  OuiSelectModule,
  OuiFormFieldModule,
  OuiInputModule
} from '../../components';
import {
  array,
  boolean,
  text,
  object,
  select
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import markdownText from '../../components/select/README.md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APPEARANCE } from '../const';

storiesOf('Form Field/Select', module)
  .add(
    'Regular',
    () => ({
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
          'Sweets'
        ]),
        placeholder: text('placeholder', 'Favorite food'),
        disabled: boolean('disabled', false),
        large: boolean('large', false),
        onChange: action('change'),
        appearance: select('appearance', APPEARANCE, APPEARANCE[0])
      },
      moduleMetadata: {
        imports: [
          OuiFormFieldModule,
          OuiInputModule,
          OuiSelectModule,
          FormsModule,
          ReactiveFormsModule
        ]
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Multi select',
    () => ({
      template: `
    <div style="width: 213px;">
    <oui-form-field [appearance]="appearance">
        <oui-select (selectionChange)="onChange($event)" [large]="large" [placeholder]="placeholder" multiple [disabled]="disabled">
          <oui-option *ngFor="let food of foods" [value]="food">
            {{food}}
          </oui-option>
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
        appearance: select('appearance', APPEARANCE, APPEARANCE[0])
      },
      moduleMetadata: {
        imports: [
          OuiFormFieldModule,
          OuiInputModule,
          OuiSelectModule,
          FormsModule,
          ReactiveFormsModule
        ]
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Groups',
    () => ({
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
            foods: ['Apple', 'Orange']
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
              'Tomato'
            ]
          },
          {
            name: 'Meats',
            foods: ['Steak', 'Chicken']
          }
        ]),
        disabled: boolean('disabled', false),
        large: boolean('large', false),
        placeholder: text('placeholder', 'Foods'),
        onChange: action('change'),
        appearance: select('appearance', APPEARANCE, APPEARANCE[0])
      },
      moduleMetadata: {
        imports: [
          OuiFormFieldModule,
          OuiInputModule,
          OuiSelectModule,
          FormsModule,
          ReactiveFormsModule
        ]
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Search options',
    () => ({
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
        appearance: select('appearance', APPEARANCE, APPEARANCE[0])
      },
      moduleMetadata: {
        imports: [
          OuiFormFieldModule,
          OuiInputModule,
          OuiSelectModule,
          FormsModule,
          ReactiveFormsModule
        ]
      }
    }),
    { notes: { markdown: markdownText } }
  );
