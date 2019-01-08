import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OuiProgressSpinner } from './progress-spinner';
import { OuiProgressSpinnerModule } from '..';

describe('OuiProgressSpinner', () => {
  let component: OuiProgressSpinner;
  let fixture: ComponentFixture<OuiProgressSpinner>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OuiProgressSpinnerModule],
      declarations: []
    }).compileComponents();
  }));
});
