import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from 'storybook/actions';
import { OuiDatepickerModule } from '../../components/datepicker';

const START_VIEWS = ['month', 'year', 'multi-year'];
const TODAY = new Date();

function getDate(daysFromToday: number): Date {
  const date = new Date(TODAY);
  date.setDate(date.getDate() + daysFromToday);
  return date;
}

function weekdaysOnly(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export default {
  title: 'Calendar',
};

export const Regular = (props) => ({
  moduleMetadata: {
    imports: [OuiDatepickerModule, BrowserAnimationsModule],
  },
  template: `
    <div style="width: 280px; font-size: 12px">
      <oui-calendar
        [startAt]="startAt"
        [startView]="startView"
        [selected]="selected"
        (selectedChange)="selectedChange($event)"
        (monthSelected)="monthSelected($event)"
        (yearSelected)="yearSelected($event)"
      ></oui-calendar>
    </div>
  `,
  props: {
    ...props,
    selectedChange: action('selectedChange'),
    monthSelected: action('monthSelected'),
    yearSelected: action('yearSelected'),
  },
});

Regular.args = {
  startAt: TODAY,
  startView: START_VIEWS[0],
  selected: TODAY,
};

Regular.argTypes = {
  startView: {
    options: START_VIEWS,
    control: { type: 'select' },
  },
};

export const WithDateConstraints = (props) => ({
  moduleMetadata: {
    imports: [OuiDatepickerModule, BrowserAnimationsModule],
  },
  template: `
    <div style="width: 280px; font-size: 12px">
      <oui-calendar
        [startAt]="startAt"
        [selected]="selected"
        [minDate]="minDate"
        [maxDate]="maxDate"
        [dateFilter]="dateFilter"
        (selectedChange)="selectedChange($event)"
      ></oui-calendar>
    </div>
  `,
  props: {
    ...props,
    selectedChange: action('selectedChange'),
  },
});

WithDateConstraints.args = {
  startAt: TODAY,
  selected: TODAY,
  minDate: getDate(-7),
  maxDate: getDate(21),
  dateFilter: weekdaysOnly,
};

WithDateConstraints.argTypes = {
  dateFilter: {
    control: false,
    description: 'Only weekdays are selectable in this example.',
  },
};

export const YearView = (props) => ({
  moduleMetadata: {
    imports: [OuiDatepickerModule, BrowserAnimationsModule],
  },
  template: `
    <div style="width: 280px; font-size: 12px">
      <oui-calendar
        [startAt]="startAt"
        [startView]="startView"
        [selected]="selected"
        (monthSelected)="monthSelected($event)"
        (yearSelected)="yearSelected($event)"
      ></oui-calendar>
    </div>
  `,
  props: {
    ...props,
    monthSelected: action('monthSelected'),
    yearSelected: action('yearSelected'),
  },
});

YearView.args = {
  startAt: TODAY,
  startView: 'year',
  selected: TODAY,
};

export const MultiYearView = (props) => ({
  moduleMetadata: {
    imports: [OuiDatepickerModule, BrowserAnimationsModule],
  },
  template: `
    <div style="width: 280px; font-size: 12px">
      <oui-calendar
        [startAt]="startAt"
        [startView]="startView"
        [selected]="selected"
        (yearSelected)="yearSelected($event)"
      ></oui-calendar>
    </div>
  `,
  props: {
    ...props,
    yearSelected: action('yearSelected'),
  },
});

MultiYearView.args = {
  startAt: TODAY,
  startView: 'multi-year',
  selected: TODAY,
};

export const MultipleDateSelection = (props) => {
  const selectedDates = new Set<string>();
  let selectedChangeHandled = false;

  const dateKey = (date: Date): string =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const toggleDate = (date: Date): void => {
    const key = dateKey(date);
    if (selectedDates.has(key)) {
      selectedDates.delete(key);
    } else {
      selectedDates.add(key);
    }
  };

  return {
    moduleMetadata: {
      imports: [OuiDatepickerModule, BrowserAnimationsModule],
    },
    template: `
      <style>
        .oui-calendar-body-cell.oui-calendar-multiple-selected
          > .oui-calendar-body-cell-content {
          background-color: #006bb1 !important;
          color: #ffffff !important;
          border-radius: 50%;
        }
      </style>
      <div style="width: 280px; font-size: 12px">
        <oui-calendar
          #calendar
          [dateClass]="dateClass"
          [minDate]="disablePreviousDates ? today : null"
          [maxDate]="maxDate"
          (selectedChange)="dateChanged($event, calendar)"
          (_userSelection)="userSelection(calendar)"
        ></oui-calendar>
        <p>Selected dates: {{ selectedDates.size }}</p>
      </div>
    `,
    props: {
      ...props,
      today: TODAY,
      selectedDates,
      dateClass: (date: Date) =>
        selectedDates.has(dateKey(date))
          ? 'oui-calendar-multiple-selected'
          : '',
      dateChanged: (
        date: Date,
        calendar: { updateTodaysDate: () => void }
      ) => {
        selectedChangeHandled = true;
        toggleDate(date);
        calendar.updateTodaysDate();
        action('selectedChange')(date);
      },
      userSelection: (calendar: {
        selected: () => Date | null;
        updateTodaysDate: () => void;
      }) => {
        if (selectedChangeHandled) {
          selectedChangeHandled = false;
          return;
        }
        const date = calendar.selected();
        if (date) {
          toggleDate(date);
          calendar.updateTodaysDate();
          action('selectedChange')(date);
        }
      },
    },
  };
};

MultipleDateSelection.args = {
  disablePreviousDates: true,
  maxDate: getDate(60),
};

MultipleDateSelection.argTypes = {
  disablePreviousDates: {
    control: { type: 'boolean' },
    description: 'When enabled, dates before today cannot be selected.',
  },
};
