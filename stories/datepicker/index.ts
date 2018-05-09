import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action, configureActions } from '@storybook/addon-actions';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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

import * as moment from 'moment';

import { DatepickerComponent } from '../../lib/datepicker/src/datepicker.component';

storiesOf('Datepicker', module)
    .addDecorator(moduleMetadata({
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
    .add('Datepicker without boundries', () => ({
        component: DatepickerComponent,
        props: {
            model: new FormControl(new Date()),
            customClick: action('clicked')
        }
    }))
    .add('Datepicker with date boundaries', () => ({
        component: DatepickerComponent,
        props: {
            model: new FormControl(new Date()),
            minDate: moment(),
            maxDate: moment().add(30, 'day'),
            customClick: action('clicked')
        }
    }));