import { inject, async, fakeAsync, tick, TestBed } from '@angular/core/testing';
import {
  SafeResourceUrl,
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { OuiIconModule } from './icon.module';
import { OuiIconRegistry } from './icon-registery';
import { OUI_ICON_LOCATION } from './public-api';

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
@Component({
  template: `
    <oui-icon>{{ iconName }}</oui-icon>
  `
})
class IconWithLigature {
  iconName = '';
}

@Component({
  template: `
    <oui-icon [color]="iconColor">{{ iconName }}</oui-icon>
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

@Component({ template: '<oui-icon aria-hidden="false">face</oui-icon>' })
class IconWithAriaHiddenFalse {}

@Component({
  template: `
    <oui-icon [svgIcon]="iconName" *ngIf="showIcon">{{ iconName }}</oui-icon>
  `
})
class IconWithBindingAndNgIf {
  iconName = 'fluffy';
  showIcon = true;
}

@Component({
  template: `
    <oui-icon [inline]="inline">{{ iconName }}</oui-icon>
  `
})
class InlineIcon {
  inline = false;
}

@Component({
  template: `
    <oui-icon [svgIcon]="iconName"><div>Hello</div></oui-icon>
  `
})
class SvgIconWithUserContent {
  iconName: string | undefined = '';
}

@Component({ template: '<oui-icon [svgIcon]="iconName">house</oui-icon>' })
class IconWithLigatureAndSvgBinding {
  iconName: string | undefined;
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

fdescribe('OuiIcon', () => {
  let fakePath: string;

  beforeEach(async(() => {
    // The $ prefix tells Karma not to try to process the
    // request so that we don't get warnings in our logs.
    fakePath = '/$fake-path';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OuiIconModule],
      declarations: [
        IconWithColor,
        IconWithLigature,
        IconFromSvgName,
        IconWithAriaHiddenFalse,
        IconWithBindingAndNgIf,
        InlineIcon,
        SvgIconWithUserContent,
        IconWithLigatureAndSvgBinding
      ],
      providers: [
        {
          provide: OUI_ICON_LOCATION,
          useValue: { getPathname: () => fakePath }
        }
      ]
    });

    TestBed.compileComponents();
  }));

  let iconRegistry: OuiIconRegistry;
  let http: HttpTestingController;
  let sanitizer: DomSanitizer;

  beforeEach(inject(
    [OuiIconRegistry, HttpTestingController, DomSanitizer],
    (mir: OuiIconRegistry, h: HttpTestingController, ds: DomSanitizer) => {
      iconRegistry = mir;
      http = h;
      sanitizer = ds;
    }
  ));

  describe('Icons from URLs', () => {
    it('should register icon URLs by name', fakeAsync(() => {
      iconRegistry.addSvgIcon('fluffy', trustUrl('cat.svg'));
      iconRegistry.addSvgIcon('fido', trustUrl('dog.svg'));

      const fixture = TestBed.createComponent(IconFromSvgName);
      let svgElement: SVGElement;
      const testComponent = fixture.componentInstance;
      const iconElement = fixture.debugElement.nativeElement.querySelector(
        'oui-icon'
      );

      testComponent.iconName = 'fido';
      fixture.detectChanges();
      http.expectOne('dog.svg').flush(FAKE_SVGS.dog);
      svgElement = verifyAndGetSingleSvgChild(iconElement);
      verifyPathChildElement(svgElement, 'woof');

      // Using an icon from a previously loaded URL should not cause another HTTP request.
      testComponent.iconName = 'fido';
      fixture.detectChanges();
      http.expectNone('dog.svg');
      svgElement = verifyAndGetSingleSvgChild(iconElement);
      verifyPathChildElement(svgElement, 'woof');

      // Assert that a registered icon can be looked-up by url.
      iconRegistry.getSvgIconFromUrl(trustUrl('cat.svg')).subscribe(element => {
        verifyPathChildElement(element, 'meow');
      });

      tick();
    }));

    it('should not wrap <svg> elements in icon sets in another svg tag', () => {
      iconRegistry.addSvgIconSet(trustUrl('arrow-set.svg'));

      const fixture = TestBed.createComponent(IconFromSvgName);
      const testComponent = fixture.componentInstance;
      const ouiIconElement = fixture.debugElement.nativeElement.querySelector(
        'oui-icon'
      );
      let svgElement: any;

      testComponent.iconName = 'left-arrow';
      fixture.detectChanges();
      http.expectOne('arrow-set.svg').flush(FAKE_SVGS.arrows);

      // arrow-set.svg stores its icons as nested <svg> elements, so they should be used
      // directly and not wrapped in an outer <svg> tag like the <g> elements in other sets.
      svgElement = verifyAndGetSingleSvgChild(ouiIconElement);
      verifyPathChildElement(svgElement, 'left');
    });

    it('should not throw when toggling an icon that has a binding in IE11', () => {
      iconRegistry.addSvgIcon('fluffy', trustUrl('cat.svg'));

      const fixture = TestBed.createComponent(IconWithBindingAndNgIf);

      fixture.detectChanges();
      http.expectOne('cat.svg').flush(FAKE_SVGS.cat);

      expect(() => {
        fixture.componentInstance.showIcon = false;
        fixture.detectChanges();

        fixture.componentInstance.showIcon = true;
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should keep non-SVG user content inside the icon element', fakeAsync(() => {
      iconRegistry.addSvgIcon('fido', trustUrl('dog.svg'));

      const fixture = TestBed.createComponent(SvgIconWithUserContent);
      const testComponent = fixture.componentInstance;
      const iconElement = fixture.debugElement.nativeElement.querySelector(
        'oui-icon'
      );

      testComponent.iconName = 'fido';
      fixture.detectChanges();
      http.expectOne('dog.svg').flush(FAKE_SVGS.dog);

      const userDiv = iconElement.querySelector('div');

      expect(userDiv).toBeTruthy();
      expect(iconElement.textContent.trim()).toContain('Hello');

      tick();
    }));
  });

  describe('Icons from HTML string', () => {
    it('should register icon HTML strings by name', fakeAsync(() => {
      iconRegistry.addSvgIconLiteral(`fluffy`, trustHtml(FAKE_SVGS.cat));
      iconRegistry.addSvgIconLiteral(`fido`, trustHtml(FAKE_SVGS.dog));

      const fixture = TestBed.createComponent(IconFromSvgName);
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

    it('should use latest path when prefixing the `url()` references', fakeAsync(() => {
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

      let fixture = TestBed.createComponent(IconFromSvgName);
      fixture.componentInstance.iconName = 'fido';
      fixture.detectChanges();
      let circle = fixture.nativeElement.querySelector('oui-icon svg circle');

      expect(circle.getAttribute('filter')).toMatch(
        /^url\(['"]?\#blur['"]?\)$/
      );
      tick();
      fixture.destroy();

      fakePath = '/$another-fake-path';
      fixture = TestBed.createComponent(IconFromSvgName);
      fixture.componentInstance.iconName = 'fido';
      fixture.detectChanges();
      circle = fixture.nativeElement.querySelector('oui-icon svg circle');

      expect(circle.getAttribute('filter')).toMatch(
        /^url\(['"]?\#blur['"]?\)$/
      );
      tick();
    }));

    it('should update the `url()` references when the path changes', fakeAsync(() => {
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

      fakePath = '/$different-path';
      fixture.detectChanges();

      expect(circle.getAttribute('filter')).toMatch(
        /^url\(['"]?\#blur['"]?\)$/
      );
    }));
  });

  /** Marks an SVG icon url as explicitly trusted. */
  function trustUrl(iconUrl: string): SafeResourceUrl {
    return sanitizer.bypassSecurityTrustResourceUrl(iconUrl);
  }

  /** Marks an SVG icon string as explicitly trusted. */
  function trustHtml(iconHtml: string): SafeHtml {
    return sanitizer.bypassSecurityTrustHtml(iconHtml);
  }
});
