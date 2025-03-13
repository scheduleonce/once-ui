import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { OuiProgressSpinner } from './progress-spinner';
import { By } from '@angular/platform-browser';

/**
 * Test components
 */

@Component({
    template: '<oui-progress-spinner></oui-progress-spinner>',
    standalone: false
})
class BasicProgressSpinner {}

@Component({
    template: '<oui-progress-spinner [diameter]="diameter"></oui-progress-spinner>',
    standalone: false
})
class ProgressSpinnerCustomDiameter {
  diameter: number;
}

@Component({
    template: `
    <oui-progress-spinner [value]="60" [color]="color"></oui-progress-spinner>
  `,
    standalone: false
})
class ProgressSpinnerWithColor {
  color = 'primary';
}

describe('OuiProgressSpinner', () => {
  let component: OuiProgressSpinner;
  let fixture: ComponentFixture<OuiProgressSpinner>;
  let basicProgressSpinnerFixture: ComponentFixture<BasicProgressSpinner>;
  let progressSpinnerDiameterFixture: ComponentFixture<ProgressSpinnerCustomDiameter>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OuiProgressSpinner,
        BasicProgressSpinner,
        ProgressSpinnerCustomDiameter,
        ProgressSpinnerWithColor,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuiProgressSpinner);
    basicProgressSpinnerFixture = TestBed.createComponent(BasicProgressSpinner);
    progressSpinnerDiameterFixture = TestBed.createComponent(
      ProgressSpinnerCustomDiameter
    );

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
    expect(testElement.componentInstance.value).toBe(0);
  });

  it('should apply a mode of "determinate" if value is provided.', () => {
    const testElement = basicProgressSpinnerFixture.debugElement.query(
      By.css('oui-progress-spinner')
    );
    testElement.componentInstance.value = 50;
    basicProgressSpinnerFixture.detectChanges();
    expect(testElement.componentInstance.mode).toBe('determinate');
  });

  it('should clamp the value of the progress between 0 and 100', () => {
    basicProgressSpinnerFixture.detectChanges();

    const testElement = basicProgressSpinnerFixture.debugElement.query(
      By.css('oui-progress-spinner')
    );
    const progressComponent = testElement.componentInstance;

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

  it('should default to a stroke width of the 2', () => {
    const spinner = progressSpinnerDiameterFixture.debugElement.query(
      By.directive(OuiProgressSpinner)
    );

    progressSpinnerDiameterFixture.componentInstance.diameter = 57;
    progressSpinnerDiameterFixture.detectChanges();

    expect(spinner.componentInstance.strokeWidth).toBe(2);
  });

  it('should allow to set a custom diameter', () => {
    const spinner = progressSpinnerDiameterFixture.debugElement.query(
      By.css('oui-progress-spinner')
    ).nativeElement as HTMLElement;
    const svgElement =
      progressSpinnerDiameterFixture.nativeElement.querySelector(
        'svg'
      ) as HTMLElement;

    progressSpinnerDiameterFixture.componentInstance.diameter = 32;
    progressSpinnerDiameterFixture.detectChanges();

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
    const progressSpinnerWithColorfixture = TestBed.createComponent(
      ProgressSpinnerWithColor
    );
    progressSpinnerWithColorfixture.detectChanges();

    const testElement = progressSpinnerWithColorfixture.debugElement.query(
      By.css('oui-progress-spinner')
    );
    expect(testElement.nativeElement.classList).toContain('oui-primary');

    progressSpinnerWithColorfixture.componentInstance.color = 'accent';
    progressSpinnerWithColorfixture.detectChanges();

    expect(testElement.nativeElement.classList).toContain('oui-accent');
    expect(testElement.nativeElement.classList).not.toContain('oui-primary');
    expect(testElement.nativeElement.classList).not.toContain('oui-warn');
  });

  it('should update the elements size when changed dynamically', () => {
    const spinner = basicProgressSpinnerFixture.debugElement.query(
      By.directive(OuiProgressSpinner)
    );

    spinner.componentInstance.diameter = 100;
    basicProgressSpinnerFixture.detectChanges();

    expect(spinner.nativeElement.style.width).toBe('100px');
    expect(spinner.nativeElement.style.height).toBe('100px');
  });
});
