import { OuiDateFormats } from './date-formats';

export const OUI_NATIVE_DATE_FORMATS: OuiDateFormats = {
  parse: {
    dateInput: null
  },
  display: {
    dateInput: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
