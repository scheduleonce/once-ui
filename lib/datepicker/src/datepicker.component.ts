import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE
} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import * as moment_ from 'moment';

const moment = moment_;

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

@Component({
    selector: 'once-ui-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: [
        './datepicker.component.scss',
        '../../../node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css',
        './material2-extended.scss',
        './border-less.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
    encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements OnInit {
    @Input() model: any;
    @Input() minDate?: any;
    @Input() maxDate?: any;
    @Input() isBorderLess?: boolean;
    @Output() dateChangeEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    ngOnInit() {
        this.minDate = moment(new Date(this.minDate));
        this.maxDate = moment(new Date(this.maxDate));
    }

    dateChange($event): void {
        let data = '';
        if ($event && $event.value)
            data = $event.value.toDate();
        this.dateChangeEvent.emit(data);
    }

}
