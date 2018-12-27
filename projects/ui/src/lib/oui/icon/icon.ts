import {
  Component,
  ViewEncapsulation,
  Input,
  OnInit,
  ElementRef,
  Attribute,
  ChangeDetectionStrategy
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { OuiIconRegistry } from './icon-registery';
import { take } from 'rxjs/operators';

/**
 * oui-icon makes it easier to use vector-based icons in your app. This directive supports only SVG icons.
 * To associate a name with an icon URL, use the addSvgIcon. The methods of OuiIconRegistry. After registering an icon, it
 * can be displayed by setting the svgIcon input. For an icon in the default namespace, use the name directly.
 * Component to display an icon. It can be used in the following ways:
 * -  Specify the svgIcon input to load an SVG icon from a URL previously registered with the addSvgIcon, addSvgIconSet.
 *    Examples:
 *    <oui-icon svgIcon="[name]"></oui-icon>
 * -  Use a font ligature as an icon by putting the ligature text in the content of the <oui-icon> component.
 *    Example: <oui-icon>home</oui-icon> <oui-icon>sun</oui-icon>
 */
@Component({
  template: '<ng-content></ng-content>',
  selector: 'oui-icon',
  exportAs: 'ouiIcon',
  styleUrls: ['icon.scss'],
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['color'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    role: 'img',
    class: 'oui-icon',
    '[class.oui-icon-inline]': 'inline',
    '[class.oui-icon-no-color]':
      'color !== "primary" && color !== "accent" && color !== "warn"',
    '[class.oui-primary]': 'color === "primary"',
    '[class.oui-accent]': 'color === "accent"',
    '[class.oui-warn]': 'color === "warn"'
  },

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Icon implements OnInit {
  /**
   * Whether the icon should be inlined, automatically sizing the icon to match the font size of
   * the element the icon is contained in.
   */
  @Input()
  get inline(): boolean {
    return this._inline;
  }
  set inline(inline: boolean) {
    this._inline = coerceBooleanProperty(inline);
  }
  // tslint:disable-next-line:no-inferrable-types
  private _inline: boolean = false;

  /** Name of the icon in the SVG icon set. */
  @Input()
  svgIcon: string;

  constructor(
    private _iconRegistry: OuiIconRegistry,
    public _elementRef: ElementRef,
    @Attribute('aria-hidden') ariaHidden: string
  ) {
    // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
    // the right thing to do for the majority of icon use-cases.
    if (!ariaHidden) {
      _elementRef.nativeElement.setAttribute('aria-hidden', 'true');
    }
  }

  ngOnInit() {
    if (this.svgIcon) {
      this._iconRegistry
        .getNamedSvgIcon(this.svgIcon)
        .pipe(take(1))
        .subscribe(
          svg => this._setSvgElement(svg),
          (err: Error) => console.log(`Error retrieving icon: ${err.message}`)
        );
    }
  }

  private _setSvgElement(svg: SVGElement) {
    this._clearSvgElement();
    this._elementRef.nativeElement.appendChild(svg);
  }

  private _clearSvgElement() {
    const layoutElement: HTMLElement = this._elementRef.nativeElement;
    let childCount = layoutElement.childNodes.length;

    // Remove existing non-element child nodes and SVGs, and add the new SVG element. Note that
    // we can't use innerHTML, because IE will throw if the element has a data binding.
    while (childCount--) {
      const child = layoutElement.childNodes[childCount];

      // 1 corresponds to Node.ELEMENT_NODE. We remove all non-element nodes in order to get rid
      // of any loose text nodes, as well as any SVG elements in order to remove any old icons.
      if (child.nodeType !== 1 || child.nodeName.toLowerCase() === 'svg') {
        layoutElement.removeChild(child);
      }
    }
  }
}
