import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { OuiProgressSpinner } from './progress-spinner';
import { By } from '@angular/platform-browser';

/**
 * Test components
 */

@Component({ template: '<oui-progress-spinner></oui-progress-spinner>' })
class BasicProgressSpinner {}

@Component({
  template:
    '<oui-progress-spinner [diameter]="diameter"></oui-progress-spinner>'
})
class ProgressSpinnerCustomDiameter {
  diameter: number;
}

@Component({
  template: `
    <oui-progress-spinner [value]="60" [color]="color"></oui-progress-spinner>
  `
})
class ProgressSpinnerWithColor {
  color: string = 'primary';
}

describe('OuiProgressSpinner', () => {
  let component: OuiProgressSpinner;
  let fixture: ComponentFixture<OuiProgressSpinner>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OuiProgressSpinner,
        BasicProgressSpinner,
        ProgressSpinnerCustomDiameter,
        ProgressSpinnerWithColor
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuiProgressSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply a mode of "indeterminate" if no value is provided.', () => {
    let fixture = TestBed.createComponent(BasicProgressSpinner);
    fixture.detectChanges();
    let testElement = fixture.debugElement.query(
      By.css('oui-progress-spinner')
    );

    expect(testElement.componentInstance.mode).toBe('indeterminate');
  });

  it('should define a default value of zero for the value attribute', () => {
    let fixture = TestBed.createComponent(BasicProgressSpinner);
    fixture.detectChanges();

    let testElement = fixture.debugElement.query(
      By.css('oui-progress-spinner')
    );
    expect(testElement.componentInstance.value).toBe(0);
  });

  it('should apply a mode of "determinate" if value is provided.', () => {
    let fixture = TestBed.createComponent(BasicProgressSpinner);

    let testElement = fixture.debugElement.query(
      By.css('oui-progress-spinner')
    );
    testElement.componentInstance.value = 50;
    fixture.detectChanges();
    expect(testElement.componentInstance.mode).toBe('determinate');
  });

  it('should clamp the value of the progress between 0 and 100', () => {
    let fixture = TestBed.createComponent(BasicProgressSpinner);
    fixture.detectChanges();

    let testElement = fixture.debugElement.query(
      By.css('oui-progress-spinner')
    );
    let progressComponent = testElement.componentInstance;

    progressComponent.value = 50;
    expect(progressComponent.value).toBe(50);

    progressComponent.value = 0;
    expect(progressComponent.value).toBe(0);

    progressComponent.value = 100;
    expect(progressComponent.value).toBe(100);

    progressComponent.value = 999;
    expect(progressComponent.value).toBe(100);

    progressComponent.value = -10;
    expect(progressComponent.value).toBe(0);
  });

  it('should default to a stroke width that is 10% of the diameter', () => {
    const fixture = TestBed.createComponent(ProgressSpinnerCustomDiameter);
    const spinner = fixture.debugElement.query(
      By.directive(OuiProgressSpinner)
    );

    fixture.componentInstance.diameter = 57;
    fixture.detectChanges();

    expect(spinner.componentInstance.strokeWidth).toBe(5.7);
  });

  it('should allow to set a custom diameter', () => {
    const fixture = TestBed.createComponent(ProgressSpinnerCustomDiameter);
    const spinner = fixture.debugElement.query(By.css('oui-progress-spinner'))
      .nativeElement;
    const svgElement = fixture.nativeElement.querySelector('svg');

    fixture.componentInstance.diameter = 32;
    fixture.detectChanges();

    expect(parseInt(spinner.style.width)).toBe(
      32,
      'Expected the custom diameter to be applied to the host element width.'
    );
    expect(parseInt(spinner.style.height)).toBe(
      32,
      'Expected the custom diameter to be applied to the host element height.'
    );
    expect(parseInt(svgElement.style.width)).toBe(
      32,
      'Expected the custom diameter to be applied to the svg element width.'
    );
    expect(parseInt(svgElement.style.height)).toBe(
      32,
      'Expected the custom diameter to be applied to the svg element height.'
    );
    expect(svgElement.getAttribute('viewBox')).toBe(
      '0 0 25.2 25.2',
      'Expected the custom diameter to be applied to the svg viewBox.'
    );
  });

  it('should set the color class on the oui-progress-spinner', () => {
    let fixture = TestBed.createComponent(ProgressSpinnerWithColor);
    fixture.detectChanges();

    let testElement = fixture.debugElement.query(
      By.css('oui-progress-spinner')
    );
    expect(testElement.nativeElement.classList).toContain('oui-primary');

    fixture.componentInstance.color = 'accent';
    fixture.detectChanges();

    expect(testElement.nativeElement.classList).toContain('oui-accent');
    expect(testElement.nativeElement.classList).not.toContain('oui-primary');
    expect(testElement.nativeElement.classList).not.toContain('oui-warn');
  });

  it('should update the elements size when changed dynamically', () => {
    let fixture = TestBed.createComponent(BasicProgressSpinner);
    let spinner = fixture.debugElement.query(By.directive(OuiProgressSpinner));

    spinner.componentInstance.diameter = 100;
    fixture.detectChanges();

    expect(spinner.nativeElement.style.width).toBe('100px');
    expect(spinner.nativeElement.style.height).toBe('100px');
  });
});
