/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiButtonModule, OuiDialogModule } from '../';
import { OuiCalendar, OuiCalendarHeader } from './calendar';
import { OuiCalendarBody } from './calendar-body';
import {
  OuiDatepicker,
  OuiDatepickerContent,
  OUI_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './datepicker';
import { OuiDatepickerInput } from './datepicker-input';
import { OuiDatepickerIntl } from './datepicker-intl';
import {
  OuiDatepickerToggle,
  OuiDatepickerToggleIcon
} from './datepicker-toggle';
import { OuiMonthView } from './month-view';
import { OuiMultiYearView } from './multi-year-view';
import { OuiYearView } from './year-view';

@NgModule({
  imports: [
    CommonModule,
    OuiButtonModule,
    OuiDialogModule,
    OverlayModule,
    A11yModule,
    PortalModule
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
    OuiCalendarHeader
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
    OuiCalendarHeader
  ],
  providers: [
    OuiDatepickerIntl,
    OUI_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
  ],
  entryComponents: [OuiDatepickerContent, OuiCalendarHeader]
})
export class OuiDatepickerModule {}
