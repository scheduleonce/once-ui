import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { OuiProgressBar } from './progress-bar';
import { By } from '@angular/platform-browser';

/**
 * Test components
 */

@Component({ template: '<oui-progress-bar></oui-progress-bar>' })
class BasicProgressBar {}

@Component({
  template: `
    <oui-progress-bar [strokeWidth]="4" [color]="color"></oui-progress-bar>
  `,
})
class ProgressBarWithColor {
  color = 'primary';
}

describe('OuiProgressBar', () => {
  let component: OuiProgressBar;
  let fixture: ComponentFixture<OuiProgressBar>;
  let BasicProgressBarFixture: ComponentFixture<BasicProgressBar>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OuiProgressBar, BasicProgressBar, ProgressBarWithColor],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuiProgressBar);
    BasicProgressBarFixture = TestBed.createComponent(BasicProgressBar);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply a mode of "indeterminate" if no value is provided.', () => {
    BasicProgressBarFixture.detectChanges();

    const testElement = BasicProgressBarFixture.debugElement.query(
      By.css('oui-progress-bar')
    );
    expect(testElement.componentInstance.mode).toBe('indeterminate');
  });

  it('should apply a mode of "determinate" if value is provided.', () => {
    const testElement = BasicProgressBarFixture.debugElement.query(
      By.css('oui-progress-bar')
    );
    testElement.componentInstance.value = 50;
    BasicProgressBarFixture.detectChanges();
    expect(testElement.componentInstance.mode).toBe('determinate');
  });

  it('should clamp the value of the progress between 0 and 100', () => {
    BasicProgressBarFixture.detectChanges();

    const testElement = BasicProgressBarFixture.debugElement.query(
      By.css('oui-progress-bar')
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

  it('should set the color class on the oui-progress-bar', () => {
    const progressBarWithColorfixture =
      TestBed.createComponent(ProgressBarWithColor);
    progressBarWithColorfixture.detectChanges();

    const testElement = progressBarWithColorfixture.debugElement.query(
      By.css('oui-progress-bar')
    );
    expect(testElement.nativeElement.classList).toContain('oui-primary');

    progressBarWithColorfixture.componentInstance.color = 'accent';
    progressBarWithColorfixture.detectChanges();

    expect(testElement.nativeElement.classList).toContain('oui-accent');
    expect(testElement.nativeElement.classList).not.toContain('oui-primary');
    expect(testElement.nativeElement.classList).not.toContain('oui-warn');
  });
});
