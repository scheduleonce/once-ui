import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OuiProgressSpinner } from './progress-spinner';
import { By } from '@angular/platform-browser';

/**
 * Test components
 */

@Component({
  template: '<oui-progress-spinner></oui-progress-spinner>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class BasicProgressSpinner {}

@Component({
  template: `
    <oui-progress-spinner [value]="60" [color]="color"></oui-progress-spinner>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ProgressSpinnerWithColor {
  color = 'primary';
}

describe('OuiProgressSpinner', () => {
  let component: OuiProgressSpinner;
  let fixture: ComponentFixture<OuiProgressSpinner>;
  let basicProgressSpinnerFixture: ComponentFixture<BasicProgressSpinner>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OuiProgressSpinner,
        BasicProgressSpinner,
        ProgressSpinnerWithColor,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuiProgressSpinner);
    basicProgressSpinnerFixture = TestBed.createComponent(BasicProgressSpinner);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply a mode of "indeterminate" if no value is provided.', () => {
    basicProgressSpinnerFixture.detectChanges();
    const testElement = basicProgressSpinnerFixture.debugElement.query(
      By.css('oui-progress-spinner')
    );

    expect(testElement.componentInstance.mode).toBe('indeterminate');
  });

  it('should define a default value of zero for the value attribute', () => {
    basicProgressSpinnerFixture.detectChanges();

    const testElement = basicProgressSpinnerFixture.debugElement.query(
      By.css('oui-progress-spinner')
    );
    expect(testElement.componentInstance.value()).toBe(0);
  });

  it('should apply a mode of "determinate" if value is provided.', () => {
    const spinnerFixture = TestBed.createComponent(OuiProgressSpinner);
    spinnerFixture.componentRef.setInput('value', 50);
    spinnerFixture.detectChanges();
    expect(spinnerFixture.componentInstance.mode).toBe('determinate');
  });

  it('should clamp the value of the progress between 0 and 100', () => {
    const spinnerFixture = TestBed.createComponent(OuiProgressSpinner);
    spinnerFixture.detectChanges();

    const progressComponent = spinnerFixture.componentInstance;

    spinnerFixture.componentRef.setInput('value', 50);
    expect(progressComponent.value()).toBe(50);

    spinnerFixture.componentRef.setInput('value', 0);
    expect(progressComponent.value()).toBe(0);

    spinnerFixture.componentRef.setInput('value', 100);
    expect(progressComponent.value()).toBe(100);

    spinnerFixture.componentRef.setInput('value', 999);
    expect(progressComponent.value()).toBe(100);

    spinnerFixture.componentRef.setInput('value', -10);
    expect(progressComponent.value()).toBe(0);
  });

  it('should default to a stroke width of the 2', () => {
    const spinnerFixture = TestBed.createComponent(OuiProgressSpinner);
    spinnerFixture.componentRef.setInput('diameter', 57);
    spinnerFixture.detectChanges();

    expect(spinnerFixture.componentInstance.strokeWidth()).toBe(2);
  });

  it('should allow to set a custom diameter', () => {
    const spinnerFixture = TestBed.createComponent(OuiProgressSpinner);
    spinnerFixture.componentRef.setInput('diameter', 32);
    spinnerFixture.detectChanges();

    const spinner = spinnerFixture.nativeElement as HTMLElement;
    const svgElement = spinnerFixture.nativeElement.querySelector(
      'svg'
    ) as HTMLElement;

    expect(parseInt(spinner.style.width, 10)).toBe(
      32,
      'Expected the custom diameter to be applied to the host element width.'
    );
    expect(parseInt(spinner.style.height, 10)).toBe(
      32,
      'Expected the custom diameter to be applied to the host element height.'
    );
    expect(parseInt(svgElement.style.width, 10)).toBe(
      32,
      'Expected the custom diameter to be applied to the svg element width.'
    );
    expect(parseInt(svgElement.style.height, 10)).toBe(
      32,
      'Expected the custom diameter to be applied to the svg element height.'
    );
    expect(svgElement.getAttribute('viewBox')).toBe(
      '0 0 32 32',
      'Expected the custom diameter to be applied to the svg viewBox.'
    );
  });

  it('should set the color class on the oui-progress-spinner', () => {
    const spinnerFixture = TestBed.createComponent(OuiProgressSpinner);
    spinnerFixture.componentRef.setInput('color', 'primary');
    spinnerFixture.detectChanges();

    const testElement = spinnerFixture.nativeElement as HTMLElement;
    expect(testElement.classList).toContain('oui-primary');

    spinnerFixture.componentRef.setInput('color', 'accent');
    spinnerFixture.detectChanges();

    expect(testElement.classList).toContain('oui-accent');
    expect(testElement.classList).not.toContain('oui-primary');
    expect(testElement.classList).not.toContain('oui-warn');
  });

  it('should update the elements size when changed dynamically', () => {
    const spinnerFixture = TestBed.createComponent(OuiProgressSpinner);
    spinnerFixture.componentRef.setInput('diameter', 100);
    spinnerFixture.detectChanges();

    const spinner = spinnerFixture.nativeElement as HTMLElement;

    expect(spinner.style.width).toBe('100px');
    expect(spinner.style.height).toBe('100px');
  });
});
