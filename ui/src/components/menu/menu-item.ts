import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  Inject,
  Optional,
  Input,
} from '@angular/core';
import { CanDisable, CanDisableCtor, mixinDisabled } from '../core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { OUI_MENU_PANEL, OuiMenuPanel } from './menu-panel';

// Boilerplate for applying mixins to OuiMenuItem.

export class OuiMenuItemBase {}
export const _OuiMenuItemMixinBase: CanDisableCtor & typeof OuiMenuItemBase =
  mixinDisabled(OuiMenuItemBase);

/**
 * This directive is intended to be used inside an oui-menu tag.
 * It exists mostly to set the role attribute.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: `[oui-menu-item]`,
  exportAs: 'ouiMenuItem',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled'],
  host: {
    '[attr.role]': 'role',
    class: 'oui-menu-item',
    '[class.oui-menu-item-highlighted]': '_highlighted',
    '[class.oui-menu-item-submenu-trigger]': '_triggersSubmenu',
    '[attr.tabindex]': '_getTabIndex()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.disabled]': 'disabled || null',
    '(click)': '_checkDisabled($event)',
    '(mouseenter)': '_handleMouseEnter()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'menu-item.html',
  standalone: false,
})
export class OuiMenuItem
  extends _OuiMenuItemMixinBase
  implements FocusableOption, CanDisable, OnDestroy
{
  /** ARIA role for the menu item. */
  @Input()
  role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox' = 'menuitem';

  private _document: Document;

  /** Stream that emits when the menu item is hovered. */
  readonly _hovered: Subject<OuiMenuItem> = new Subject<OuiMenuItem>();

  /** Whether the menu item is highlighted. */
  _highlighted = false;

  /** Whether the menu item acts as a trigger for a sub-menu. */
  _triggersSubmenu = false;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) document?: any,
    private _focusMonitor?: FocusMonitor,
    @Inject(OUI_MENU_PANEL)
    @Optional()
    private _parentMenu?: OuiMenuPanel<OuiMenuItem>
  ) {
    // @breaking-change 8.0.0 make `_focusMonitor` and `document` required params.
    super();

    if (_focusMonitor) {
      // Start monitoring the element so it gets the appropriate focused classes. We want
      // to show the focus style for menu items only when the focus was not caused by a
      // mouse or touch interaction.
      _focusMonitor.monitor(this._elementRef.nativeElement, false);
    }

    if (_parentMenu && _parentMenu.addItem) {
      _parentMenu.addItem(this);
    }

    this._document = document;
  }

  /** Focuses the menu item. */
  focus(origin: FocusOrigin = 'program'): void {
    if (this._focusMonitor) {
      this._focusMonitor.focusVia(this._getHostElement(), origin);
    } else {
      this._getHostElement().focus();
    }
  }

  ngOnDestroy() {
    if (this._focusMonitor) {
      this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    }

    if (this._parentMenu && this._parentMenu.removeItem) {
      this._parentMenu.removeItem(this);
    }

    this._hovered.complete();
  }

  /** Used to set the `tabindex`. */
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** Returns the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** Prevents the default element actions if it is disabled. */
  _checkDisabled(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /** Emits to the hover stream. */
  _handleMouseEnter() {
    this._hovered.next(this);
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    const element: HTMLElement = this._elementRef.nativeElement;
    const textNodeType = this._document ? this._document.TEXT_NODE : 3;
    let output = '';

    if (element.childNodes) {
      const length = element.childNodes.length;

      // Go through all the top-level text nodes and extract their text.
      // We skip anything that's not a text node to prevent the text from
      // being thrown off by something like an icon.
      for (let i = 0; i < length; i++) {
        if (element.childNodes[i].nodeType === textNodeType) {
          output += element.childNodes[i].textContent;
        }
      }
    }

    return output.trim();
  }
}
