import { inject, async, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { OuiIconModule } from './icon.module';
import { OuiIconRegistry } from './icon-registery';

/** Returns the CSS classes assigned to an element as a sorted array. */
function sortedClassNames(element: Element): string[] {
  return element.className.split(' ').sort();
}

/**
 * Test components
 */
@Component({
  template: `
    <oui-icon></oui-icon>
  `
})
class IconWithLigature {}

@Component({
  template: `
    <oui-icon [color]="iconColor"></oui-icon>
  `
})
class IconWithColor {
  iconName = '';
  iconColor = 'primary';
}

@Component({
  template: `
    <oui-icon [svgIcon]="iconName"></oui-icon>
  `
})
class IconFromSvgName {
  iconName: string | undefined = '';
}

@Component({
  template: `
    <oui-icon [inline]="inline"></oui-icon>
  `
})
class InlineIcon {
  inline = false;
}

describe('OuiIcon', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OuiIconModule],
      declarations: [
        IconWithColor,
        IconWithLigature,
        IconFromSvgName,
        InlineIcon
      ]
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject(
    [OuiIconRegistry, HttpTestingController, DomSanitizer],
    () => {}
  ));

  it('should apply class based on color attribute', () => {
    const fixture = TestBed.createComponent(IconWithColor);
    const testComponent = fixture.componentInstance;
    const matIconElement = fixture.debugElement.nativeElement.querySelector(
      'oui-icon'
    );
    testComponent.iconName = 'home';
    testComponent.iconColor = 'primary';
    fixture.detectChanges();
    expect(sortedClassNames(matIconElement)).toEqual([
      'oui-icon',
      'oui-primary'
    ]);
  });

  it('should mark oui-icon as aria-hidden by default', () => {
    const fixture = TestBed.createComponent(IconWithLigature);
    const iconElement = fixture.debugElement.nativeElement.querySelector(
      'oui-icon'
    );
    expect(iconElement.getAttribute('aria-hidden')).toBe(
      'true',
      'Expected the oui-icon element has aria-hidden="true" by default'
    );
  });

  it('should apply inline styling', () => {
    const fixture = TestBed.createComponent(InlineIcon);
    const iconElement = fixture.debugElement.nativeElement.querySelector(
      'oui-icon'
    );
    expect(iconElement.classList.contains('oui-icon-inline')).toBeFalsy(
      'Expected the oui-icon element to not include the inline styling class'
    );

    fixture.debugElement.componentInstance.inline = true;
    fixture.detectChanges();
    expect(iconElement.classList.contains('oui-icon-inline')).toBeTruthy(
      'Expected the oui-icon element to include the inline styling class'
    );
  });
});
