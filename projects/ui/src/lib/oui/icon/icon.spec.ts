import { inject, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { OuiIconModule } from './icon.module';
import { OuiIconRegistry } from './icon-registery';

/** Returns the CSS classes assigned to an element as a sorted array. */
function sortedClassNames(element: Element): string[] {
  return element.className.split(' ').sort();
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
  let iconRegistry: OuiIconRegistry;
  let sanitizer: DomSanitizer;
  beforeEach(inject(
    [OuiIconRegistry, DomSanitizer],
    (oir: OuiIconRegistry, ds: DomSanitizer) => {
      iconRegistry = oir;
      sanitizer = ds;
    }
  ));

  it('should apply class based on color attribute', () => {
    const fixture = TestBed.createComponent(IconWithColor);
    const testComponent = fixture.componentInstance;
    const ouiIconElement = fixture.debugElement.nativeElement.querySelector(
      'oui-icon'
    );
    testComponent.iconName = 'home';
    testComponent.iconColor = 'primary';
    fixture.detectChanges();
    expect(sortedClassNames(ouiIconElement)).toEqual([
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

  describe('Icons from HTML string', () => {
    it('should register icon HTML strings by name', fakeAsync(() => {
      iconRegistry.addSvgIconLiteral(`fluffy`, trustHtml(FAKE_SVGS.cat));
      iconRegistry.addSvgIconLiteral(`fido`, trustHtml(FAKE_SVGS.dog));

      let fixture = TestBed.createComponent(IconFromSvgName);
      let svgElement: SVGElement;
      const testComponent = fixture.componentInstance;
      const iconElement = fixture.debugElement.nativeElement.querySelector(
        'oui-icon'
      );

      testComponent.iconName = 'fluffy';
      fixture.detectChanges();
      svgElement = verifyAndGetSingleSvgChild(iconElement);
      verifyPathChildElement(svgElement, 'meow');

      // Assert that a registered icon can be looked-up by name.
      iconRegistry.getNamedSvgIcon('fluffy').subscribe(element => {
        verifyPathChildElement(element, 'meow');
      });

      tick();
    }));

    it('should throw an error when using untrusted HTML', () => {
      // Stub out console.warn so we don't pollute our logs with Angular's warnings.
      // Jasmine will tear the spy down at the end of the test.

      spyOn(console, 'warn');

      expect(() => {
        iconRegistry.addSvgIconLiteral('circle', '<svg><circle></svg>');
      }).toThrowError(/was not trusted as safe HTML/);
    });

    it('should add an extra string to the end of `style` tags inside SVG', fakeAsync(() => {
      iconRegistry.addSvgIconLiteral(
        'fido',
        trustHtml(`
        <svg>
          <style>#woof {color: blue;}</style>
          <path id="woof" name="woof"></path>
        </svg>
      `)
      );

      const fixture = TestBed.createComponent(IconFromSvgName);
      fixture.componentInstance.iconName = 'fido';
      fixture.detectChanges();
      const styleTag = fixture.nativeElement.querySelector(
        'oui-icon svg style'
      );

      // Note the extra whitespace at the end which is what we're testing for. This is a
      // workaround for IE and Edge ignoring `style` tags in dynamically-created SVGs.
      expect(styleTag.textContent).toBe('#woof {color: blue;}');

      tick();
    }));

    it('should prepend the current path to attributes with `url()` references', fakeAsync(() => {
      iconRegistry.addSvgIconLiteral(
        'fido',
        trustHtml(`
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
      const circle = fixture.nativeElement.querySelector('oui-icon svg circle');

      // We use a regex to match here, rather than the exact value, because different browsers
      // return different quotes through `getAttribute`, while some even omit the quotes altogether.
      expect(circle.getAttribute('filter')).toMatch(
        /^url\(['"]?\#blur['"]?\)$/
      );

      tick();
    }));
  });

  /** Marks an SVG icon string as explicitly trusted. */
  function trustHtml(iconHtml: string): SafeHtml {
    return sanitizer.bypassSecurityTrustHtml(iconHtml);
  }
});

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
export const FAKE_SVGS = {
  cat: '<svg><path id="meow" name="meow"></path></svg>',
  dog: '<svg><path id="woof" name="woof"></path></svg>',
  dogWithSpaces: '<svg><path id="woof says the dog" name="woof"></path></svg>',
  farmSet1: `
    <svg>
      <defs>
        <g id="pig" name="pig"><path name="oink"></path></g>
        <g id="cow" name="cow"><path name="moo"></path></g>
      </defs>
    </svg>
  `,
  farmSet2: `
    <svg>
      <defs>
        <g id="cow" name="cow"><path name="moo moo"></path></g>
        <g id="sheep" name="sheep"><path name="baa"></path></g>
      </defs>
    </svg>
  `,
  farmSet3: `
    <svg>
      <symbol id="duck" name="duck">
        <path id="quack" name="quack"></path>
      </symbol>
    </svg>
  `,
  farmSet4: `
    <svg>
      <defs>
        <g id="pig with spaces" name="pig"><path name="oink"></path></g>
      </defs>
    </svg>
  `,
  arrows: `
    <svg>
      <defs>
        <svg id="left-arrow" name="left-arrow"><path name="left"></path></svg>
        <svg id="right-arrow" name="right-arrow"><path name="right"></path></svg>
      </defs>
    </svg>  `
};
