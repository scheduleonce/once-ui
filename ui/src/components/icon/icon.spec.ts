import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OuiIconModule } from './icon.module';
import { OuiIconRegistry } from './icon-registery';
import { OUI_ICON_LOCATION } from './public-api';

// Fake timers replace Zone-based fakeAsync; tick advances them.
const drainMicrotasks = async () => {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
};
const tick = async (ms = 0) => {
  vi.advanceTimersByTime(ms);
  await drainMicrotasks();
};

/** Returns the CSS classes assigned to an element as a sorted array. */
function sortedClassNames(element: Element): string[] {
  return element.className.split(' ').sort();
}

export const FAKE_SVGS = {
  cat: '<svg><path id="meow" name="meow"></path></svg>',
  dog: '<svg><path id="woof" name="woof"></path></svg>',
  arrows: `
    <svg>
      <defs>
        <svg id="left-arrow" name="left-arrow"><path name="left"></path></svg>
        <svg id="right-arrow" name="right-arrow"><path name="right"></path></svg>
      </defs>
    </svg>  `,
};

/**
 * Test components
 */
@Component({
  template: ` <oui-icon></oui-icon> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class IconWithLigature {
  iconName = '';
}

@Component({
  template: ` <oui-icon [color]="iconColor"></oui-icon> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class IconWithColor {
  iconName = '';
  iconColor = 'primary';
}

@Component({
  template: ` <oui-icon [svgIcon]="iconName"></oui-icon> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class IconFromSvgName {
  iconName: string | undefined = '';
}

@Component({
  template: ` @if (showIcon) {<oui-icon [svgIcon]="iconName"></oui-icon>} `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class IconWithBindingAndNgIf {
  iconName = 'fluffy';
  showIcon = true;
}

@Component({
  template: ` <oui-icon [inline]="inline"></oui-icon> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class InlineIcon {
  inline = false;
}

@Component({
  template: ` <oui-icon [svgIcon]="iconName"><div>Hello</div></oui-icon> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SvgIconWithUserContent {
  iconName: string | undefined = '';
}

/**
 * Verifies that an element contains a single `<svg>` child element, and returns that child.
 */
function verifyAndGetSingleSvgChild(element: SVGElement): SVGElement {
  expect(element.id).toBeFalsy();
  expect(element.childNodes.length).toBe(1);
  const svgChild = element.childNodes[0] as SVGElement;
  expect(svgChild.tagName.toLowerCase()).toBe('svg');
  return svgChild;
}

/**
 * Verifies that an element contains a single `<path>` child element whose "id" attribute has
 * the specified value.
 */
function verifyPathChildElement(
  element: Element,
  attributeValue: string
): void {
  expect(element.childNodes.length).toBe(1);
  const pathElement = element.childNodes[0] as SVGPathElement;
  expect(pathElement.tagName.toLowerCase()).toBe('path');

  // The testing data SVGs have the name attribute set for verification.
  expect(pathElement.getAttribute('name')).toBe(attributeValue);
}

// Declared in a module so host components share the TestBed injector with OuiIconRegistry.
@NgModule({
  imports: [CommonModule, OuiIconModule],
  declarations: [
    IconWithColor,
    IconWithLigature,
    IconFromSvgName,
    IconWithBindingAndNgIf,
    InlineIcon,
    SvgIconWithUserContent,
  ],
})
class IconTestModule {}

describe('OuiIcon', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'requestAnimationFrame',
        'cancelAnimationFrame',
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  let fakePath: string;

  beforeEach(async () => {
    // The $ prefix tells Karma not to try to process the
    // request so that we don't get warnings in our logs.
    fakePath = '/$fake-path';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IconTestModule],

      providers: [
        {
          provide: OUI_ICON_LOCATION,
          useValue: { getPathname: () => fakePath },
        },
      ],
    });

    await TestBed.compileComponents();
  });

  let iconRegistry: OuiIconRegistry;
  let http: HttpTestingController;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    iconRegistry = TestBed.inject(OuiIconRegistry);
    http = TestBed.inject(HttpTestingController);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should apply class based on color attribute', async () => {
    const fixture = TestBed.createComponent(IconWithColor);
    const testComponent = fixture.componentInstance;
    const ouiIconElement = fixture.debugElement.nativeElement.querySelector(
      'oui-icon'
    ) as HTMLElement;
    testComponent.iconName = 'home';
    testComponent.iconColor = 'primary';
    fixture.detectChanges();
    await tick();
    expect(sortedClassNames(ouiIconElement)).toEqual([
      'oui-icon',
      'oui-primary',
    ]);
  });

  it('should mark oui-icon as aria-hidden by default', () => {
    const fixture = TestBed.createComponent(IconWithLigature);
    const iconElement =
      fixture.debugElement.nativeElement.querySelector('oui-icon');
    expect(iconElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should apply inline styling', async () => {
    const fixture = TestBed.createComponent(InlineIcon);
    const iconElement =
      fixture.debugElement.nativeElement.querySelector('oui-icon');
    expect(iconElement.classList.contains('oui-icon-inline')).toBeFalsy();

    fixture.debugElement.componentInstance.inline = true;
    fixture.detectChanges();
    await tick();
    expect(iconElement.classList.contains('oui-icon-inline')).toBeTruthy();
  });

  describe('Icons from URLs', () => {
    it('should not wrap <svg> elements in icon sets in another svg tag', async () => {
      iconRegistry.addSvgIconSet(
        sanitizer.bypassSecurityTrustResourceUrl('arrow-set.svg')
      );

      const fixture = TestBed.createComponent(IconFromSvgName);
      const testComponent = fixture.componentInstance;
      const ouiIconElement = fixture.debugElement.nativeElement.querySelector(
        'oui-icon'
      ) as SVGElement;

      testComponent.iconName = 'left-arrow';
      fixture.detectChanges();
      await tick();
      http.expectOne('arrow-set.svg').flush(FAKE_SVGS.arrows);

      // arrow-set.svg stores its icons as nested <svg> elements, so they should be used
      // directly and not wrapped in an outer <svg> tag like the <g> elements in other sets.
      const svgElement = verifyAndGetSingleSvgChild(ouiIconElement);
      verifyPathChildElement(svgElement, 'left');
    });

    it('should not throw when toggling an icon that has a binding in IE11', async () => {
      iconRegistry.addSvgIcon(
        'fluffy',
        sanitizer.bypassSecurityTrustResourceUrl('cat.svg')
      );

      const fixture = TestBed.createComponent(IconWithBindingAndNgIf);

      fixture.detectChanges();
      await tick();
      http.expectOne('cat.svg').flush(FAKE_SVGS.cat);

      expect(() => {
        fixture.componentInstance.showIcon = false;
        fixture.detectChanges();

        fixture.componentInstance.showIcon = true;
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should keep non-SVG user content inside the icon element', async () => {
      iconRegistry.addSvgIcon(
        'fido',
        sanitizer.bypassSecurityTrustResourceUrl('dog.svg')
      );

      const fixture = TestBed.createComponent(SvgIconWithUserContent);
      const testComponent = fixture.componentInstance;
      const iconElement =
        fixture.debugElement.nativeElement.querySelector('oui-icon');

      testComponent.iconName = 'fido';
      fixture.detectChanges();
      await tick();
      http.expectOne('dog.svg').flush(FAKE_SVGS.dog);

      const userDiv = iconElement.querySelector('div');

      expect(userDiv).toBeTruthy();
      expect(iconElement.textContent.trim()).toContain('Hello');

      await tick();
    });
  });

  describe('Icons from HTML string', () => {
    it('should register icon HTML strings by name', async () => {
      iconRegistry.addSvgIconLiteral(
        `fluffy`,
        sanitizer.bypassSecurityTrustHtml(FAKE_SVGS.cat)
      );
      iconRegistry.addSvgIconLiteral(
        `fido`,
        sanitizer.bypassSecurityTrustHtml(FAKE_SVGS.dog)
      );

      const fixture = TestBed.createComponent(IconFromSvgName);
      const testComponent = fixture.componentInstance;
      const iconElement = fixture.debugElement.nativeElement.querySelector(
        'oui-icon'
      ) as SVGElement;

      testComponent.iconName = 'fluffy';
      fixture.detectChanges();
      await tick();
      const svgElement = verifyAndGetSingleSvgChild(iconElement);
      verifyPathChildElement(svgElement, 'meow');

      // Assert that a registered icon can be looked-up by name.
      iconRegistry.getNamedSvgIcon('fluffy').subscribe((element) => {
        verifyPathChildElement(element, 'meow');
      });

      await tick();
    });

    it('should prepend the current path to attributes with `url()` references', async () => {
      iconRegistry.addSvgIconLiteral(
        'fido',
        sanitizer.bypassSecurityTrustHtml(`
        <svg>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>

          <circle cx="170" cy="60" r="50" fill="green" filter="url('#blur')" />
        </svg>
      `)
      );

      const fixture = TestBed.createComponent(IconFromSvgName);
      fixture.componentInstance.iconName = 'fido';
      fixture.detectChanges();
      await tick();
      const circle = fixture.nativeElement.querySelector('oui-icon svg circle');

      // We use a regex to match here, rather than the exact value, because different browsers
      // return different quotes through `getAttribute`, while some even omit the quotes altogether.
      expect(circle.getAttribute('filter')).toMatch(
        /^url\(['"]?\#blur['"]?\)$/
      );

      await tick();
    });

    it('should use latest path when prefixing the `url()` references', async () => {
      iconRegistry.addSvgIconLiteral(
        'fido',
        sanitizer.bypassSecurityTrustHtml(`
        <svg>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>

          <circle cx="170" cy="60" r="50" fill="green" filter="url('#blur')" />
        </svg>
      `)
      );

      let fixture = TestBed.createComponent(IconFromSvgName);
      fixture.componentInstance.iconName = 'fido';
      fixture.detectChanges();
      await tick();
      let circle = fixture.nativeElement.querySelector('oui-icon svg circle');

      expect(circle.getAttribute('filter')).toMatch(
        /^url\(['"]?\#blur['"]?\)$/
      );
      await tick();
      fixture.destroy();

      fakePath = '/$another-fake-path';
      fixture = TestBed.createComponent(IconFromSvgName);
      fixture.componentInstance.iconName = 'fido';
      fixture.detectChanges();
      await tick();
      circle = fixture.nativeElement.querySelector('oui-icon svg circle');

      expect(circle.getAttribute('filter')).toMatch(
        /^url\(['"]?\#blur['"]?\)$/
      );
      await tick();
    });

    it('should update the `url()` references when the path changes', async () => {
      iconRegistry.addSvgIconLiteral(
        'fido',
        sanitizer.bypassSecurityTrustHtml(`
        <svg>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>

          <circle cx="170" cy="60" r="50" fill="green" filter="url('#blur')" />
        </svg>
      `)
      );

      const fixture = TestBed.createComponent(IconFromSvgName);
      fixture.componentInstance.iconName = 'fido';
      fixture.detectChanges();
      await tick();
      const circle = fixture.nativeElement.querySelector('oui-icon svg circle');

      // We use a regex to match here, rather than the exact value, because different browsers
      // return different quotes through `getAttribute`, while some even omit the quotes altogether.
      expect(circle.getAttribute('filter')).toMatch(
        /^url\(['"]?\#blur['"]?\)$/
      );
      await tick();

      fakePath = '/$different-path';
      fixture.detectChanges();
      await tick();

      expect(circle.getAttribute('filter')).toMatch(
        /^url\(['"]?\#blur['"]?\)$/
      );
    });
  });
});
