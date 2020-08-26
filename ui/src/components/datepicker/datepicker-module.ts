import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiButtonModule } from '../button/button-module';
import { OuiDialogModule } from '../dialog/dialog-module';
import { OuiCalendar, OuiCalendarHeader } from './calendar';
import { OuiCalendarBody } from './calendar-body';
import {
  OuiDatepicker,
  OuiDatepickerContent,
  OUI_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './datepicker';
import { OuiDatepickerInput } from './datepicker-input';
import { OuiDatepickerIntl } from './datepicker-intl';
import {
  OuiDatepickerToggle,
  OuiDatepickerToggleIcon,
} from './datepicker-toggle';
import { OuiMonthView } from './month-view';
import { OuiMultiYearView } from './multi-year-view';
import { OuiYearView } from './year-view';
import { OuiNativeDateModule } from './native-date.module';
import { OuiIconModule } from '../icon/icon.module';

@NgModule({
  imports: [
    CommonModule,
    OuiButtonModule,
    OuiDialogModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    OuiNativeDateModule,
    OuiIconModule,
  ],
  exports: [
    OuiCalendar,
    OuiCalendarBody,
    OuiDatepicker,
    OuiDatepickerContent,
    OuiDatepickerInput,
    OuiDatepickerToggle,
    OuiDatepickerToggleIcon,
    OuiMonthView,
    OuiYearView,
    OuiMultiYearView,
    OuiCalendarHeader,
  ],
  declarations: [
    OuiCalendar,
    OuiCalendarBody,
    OuiDatepicker,
    OuiDatepickerContent,
    OuiDatepickerInput,
    OuiDatepickerToggle,
    OuiDatepickerToggleIcon,
    OuiMonthView,
    OuiYearView,
    OuiMultiYearView,
    OuiCalendarHeader,
  ],
  providers: [
    OuiDatepickerIntl,
    OUI_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  ],
})
export class OuiDatepickerModule {}
