import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action, configureActions } from '@storybook/addon-actions';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { boolean, number, text, withKnobs, object, array } from '@storybook/addon-knobs/dist/angular';
import {
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
} from '@angular/material';
import { ReactiveFormsModule, FormControl  } from '@angular/forms';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE
} from '@angular/material/core';
import * as moment from 'moment';
import { DatepickerComponent } from '../../lib/datepicker/src/datepicker.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { withReadme, withDocs }  from 'storybook-readme';
import * as ReadmeFile from '../../lib/datepicker/README.md';
export const MY_FORMATS = {
    parse: {
        dateInput: 'LL'
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    }
};
const minDate = moment();
const maxDate = moment().add(30, 'day');

const stories = storiesOf('Datepicker', module)
    stories.addDecorator(moduleMetadata({
        imports: [
            CommonModule,
            MatDatepickerModule,
            MatFormFieldModule,
            MatNativeDateModule,
            MatInputModule,
            ReactiveFormsModule,
            BrowserModule,
            BrowserAnimationsModule,
            NoopAnimationsModule
        ],
        schemas: [],
        declarations: [
        ],
        providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
        })
    )
    .addDecorator(withReadme(ReadmeFile))
    .add('default', () => ({
        component: DatepickerComponent,
        props: {
            model: new FormControl(new Date()),
            minDate: text('minDate', minDate),
            maxDate: text('maxDate', maxDate),
            isBorderLess: boolean('isBorderLess', false),
            dateChangeEvent: action('Date changed'),
        }
    }));