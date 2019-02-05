import { InjectionToken } from '@angular/core';

export type OuiDateFormats = {
  parse: {
    dateInput: any;
  };
  display: {
    dateInput: any;
    monthYearLabel: any;
    dateA11yLabel: any;
    monthYearA11yLabel: any;
  };
};

export const OUI_DATE_FORMATS = new InjectionToken<OuiDateFormats>(
  'oui-date-formats'
);
