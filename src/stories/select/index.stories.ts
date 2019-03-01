import { storiesOf } from '@storybook/angular';
import {
  OuiSelectModule,
  OuiFormFieldModule,
  OuiInputModule
} from '../../../projects/ui/src/lib/oui';
import { array, boolean, text, object } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import markdownText from '../../../projects/ui/src/lib/oui/select/README.md';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';

/**
 * Select Customizing the trigger label
 */
@Component({
  selector: 'oui-select-storybook',
  template: `
    <div style="max-width: 270px;">
      <oui-form-field [appearance]="'underline'" [color]="color">
        <oui-select [placeholder]="placeholder" [formControl]="toppings">
          <oui-select-search [(ngModel)]="keyword"></oui-select-search>
          <oui-option
            *ngFor="let topping of (toppingList | filterOptions: keyword)"
            [value]="topping"
            >{{ topping }}
          </oui-option>
          <div
            *ngIf="!(toppingList | filterOptions: keyword).length"
            class="noResults"
          >
            No results match "{{ keyword }}"
          </div>
        </oui-select>
      </oui-form-field>
    </div>
  `
})
export class OuiSelectCustomizeTriggerStorybook {
  @Input() placeholder: string = '';
  toppings = new FormControl();
  toppingList = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato'
  ];
}

storiesOf('Form Field/Select', module)
  .add(
    'regular',
    () => ({
      template: `
    <div style="width: 213px;">
      <oui-form-field>
        <oui-select (change)="onChange($event)" [placeholder]="placeholder" [disabled]="disabled">
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
        onChange: action('change')
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
    'multi Select',
    () => ({
      template: `
    <div style="width: 213px;">
      <oui-form-field>
        <oui-select (change)="onChange($event)" [placeholder]="placeholder" multiple [disabled]="disabled">
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
        onChange: action('change')
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
    'groups',
    () => ({
      template: `
    <div style="width: 213px;">
      <oui-form-field>
        <oui-select (change)="onChange($event)" [placeholder]="placeholder" [disabled]="disabled">
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
        placeholder: text('placeholder', 'Foods'),
        onChange: action('change')
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
    'search options',
    () => ({
      template: `
    <div style="width: 213px;">
      <oui-form-field>
        <oui-select (change)="onChange($event)" [placeholder]="placeholder" [disabled]="disabled">
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
        onChange: action('change')
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
    'customize trigger',
    () => ({
      moduleMetadata: {
        imports: [
          OuiFormFieldModule,
          OuiInputModule,
          OuiSelectModule,
          FormsModule,
          ReactiveFormsModule
        ],
        schemas: [],
        declarations: [OuiSelectCustomizeTriggerStorybook]
      },
      template: `<oui-select-storybook [placeholder]="placeholder"></oui-select-storybook>`,
      props: {
        placeholder: text('placeholder', 'Favourite topping'),
        onChange: action('change')
      }
    }),
    { notes: { markdown: markdownText } }
  );
