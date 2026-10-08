import { FocusKeyManager, FocusOrigin } from '@angular/cdk/a11y';
import {
  ESCAPE,
  LEFT_ARROW,
  DOWN_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  InjectionToken,
  booleanAttribute,
  effect,
  input,
  model,
  NgZone,
  OnDestroy,
  output,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  inject,
} from '@angular/core';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { startWith, switchMap, take } from 'rxjs/operators';
import { OuiMenuContent } from './menu-content';
import {
  throwOuiMenuInvalidPositionX,
  throwOuiMenuInvalidPositionY,
} from './menu-errors';
import { OuiMenuItem } from './menu-item';
import { OUI_MENU_PANEL, OuiMenuPanel } from './menu-panel';
import { MenuPositionX, MenuPositionY } from './menu-positions';

/** Default `oui-menu` options that can be overridden. */
export interface OuiMenuDefaultOptions {
  /** The x-axis position of the menu. */
  xPosition: MenuPositionX;

  /** The y-axis position of the menu. */
  yPosition: MenuPositionY;

  /** Whether the menu should overlap the menu trigger. */
  overlapTrigger: boolean;

  /** Class to be applied to the menu's backdrop. */
  backdropClass: string;

  /** Whether the menu has a backdrop. */
  hasBackdrop?: boolean;
}

/** Injection token to be used to override the default options for `oui-menu`. */
export const OUI_MENU_DEFAULT_OPTIONS =
  new InjectionToken<OuiMenuDefaultOptions>('oui-menu-default-options', {
    providedIn: 'root',
    factory: OUI_MENU_DEFAULT_OPTIONS_FACTORY,
  });

/** @docs-private */
export function OUI_MENU_DEFAULT_OPTIONS_FACTORY(): OuiMenuDefaultOptions {
  return {
    overlapTrigger: false,
    xPosition: 'after',
    yPosition: 'below',
    backdropClass: 'cdk-overlay-transparent-backdrop',
  };
}

@Component({
  selector: 'oui-menu',
  templateUrl: 'menu.html',
  styleUrls: ['menu.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiMenu',
  providers: [{ provide: OUI_MENU_PANEL, useExisting: OuiMenu }],
  standalone: false,
})
export class OuiMenu
  implements AfterContentInit, OuiMenuPanel<OuiMenuItem>, OnInit, OnDestroy
{
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _ngZone = inject(NgZone);
  private _defaultOptions = inject<OuiMenuDefaultOptions>(
    OUI_MENU_DEFAULT_OPTIONS
  );
  private _keyManager: FocusKeyManager<OuiMenuItem>;

  /** Menu items inside the current menu. */
  private _items: OuiMenuItem[] = [];

  /** Emits whenever the amount of menu items changes. */
  private _itemChanges = new Subject<OuiMenuItem[]>();

  /** Subscription to tab events on the menu panel */
  private _tabSubscription = Subscription.EMPTY;

  /** Config object to be passed into the menu's ngClass */
  _classList: { [key: string]: boolean } = {};

  /** Parent menu of the current menu panel. */
  parentMenu: OuiMenuPanel | undefined;

  /** Class to be added to the backdrop element. */
  readonly backdropClass = input(this._defaultOptions.backdropClass);

  /** Whether the menu has a backdrop. */
  readonly hasBackdrop = model(this._defaultOptions.hasBackdrop);

  /** Position of the menu in the X axis. */
  readonly xPosition = input(this._defaultOptions.xPosition);

  /** Position of the menu in the Y axis. */
  readonly yPosition = input(this._defaultOptions.yPosition);

  /** @docs-private */
  @ViewChild(TemplateRef)
  templateRef: TemplateRef<any>;

  /**
   * List of the items inside of a menu.
   *
   * @deprecated
   * @breaking-change 8.0.0
   */
  @ContentChildren(OuiMenuItem)
  items: QueryList<OuiMenuItem>;

  /**
   * Menu content that will be rendered lazily.
   *
   * @docs-private
   */
  @ContentChild(OuiMenuContent)
  lazyContent: OuiMenuContent;

  /** Whether the menu should overlap its trigger. */
  readonly overlapTrigger = input(this._defaultOptions.overlapTrigger, {
    transform: booleanAttribute,
  });

  /**
   * This method takes classes set on the host oui-menu element and applies them on the
   * menu template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing menu from outside the component.
   *
   * @param classes list of class names
   */
  readonly panelClass = input('', { alias: 'class' });

  private _applyPanelClass(classes: string) {
    if (classes && classes.length) {
      this._classList = classes
        .split(' ')
        .reduce((obj: any, className: string) => {
          obj[className] = true;
          return obj;
        }, {});

      this._elementRef.nativeElement.className = '';
    }
  }

  /** Event emitted when the menu is closed. */
  readonly closed = output<void | 'click' | 'keydown' | 'tab'>();

  /**
   * Event emitted when the menu is closed.
   *
   * @deprecated Switch to `closed` instead
   * @breaking-change 8.0.0
   */
  close = this.closed;

  constructor() {
    effect(() => {
      const xPosition = this.xPosition();
      const yPosition = this.yPosition();
      const panelClass = this.panelClass();
      if (xPosition !== 'before' && xPosition !== 'after') {
        throwOuiMenuInvalidPositionX();
      }
      if (yPosition !== 'above' && yPosition !== 'below') {
        throwOuiMenuInvalidPositionY();
      }
      this._applyPanelClass(panelClass);
      this.setPositionClasses(xPosition, yPosition);
    });
  }

  ngOnInit() {
    this.setPositionClasses();
  }

  ngAfterContentInit() {
    this._keyManager = new FocusKeyManager<OuiMenuItem>(this._items)
      .withWrap()
      .withTypeAhead();
    this._tabSubscription = this._keyManager.tabOut.subscribe({
      next: () => this.closed.emit('tab'),
      error: (err: Error) => console.error('Menu tab-out failed', err),
    });
  }

  ngOnDestroy() {
    this._tabSubscription.unsubscribe();
  }

  /** Stream that emits whenever the hovered menu item changes. */
  _hovered(): Observable<OuiMenuItem> {
    return this._itemChanges.pipe(
      startWith(this._items),
      switchMap((items) => merge(...items.map((item) => item._hovered)))
    );
  }

  /** Handle a keyboard event from the menu, delegating to the appropriate action. */
  _handleKeydown(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    switch (keyCode) {
      case ESCAPE:
        this.closed.emit('keydown');
        break;
      case LEFT_ARROW:
        if (this.parentMenu) {
          this.closed.emit('keydown');
        }
        break;
      default:
        if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
          this._keyManager.setFocusOrigin('keyboard');
        }

        this._keyManager.onKeydown(event);
    }
  }

  /**
   * Focus the first item in the menu.
   *
   * @param origin Action from which the focus originated. Used to set the correct styling.
   */
  focusFirstItem(origin: FocusOrigin = 'program'): void {
    // When the content is rendered lazily, it takes a bit before the items are inside the DOM.
    if (this.lazyContent) {
      this._ngZone.onStable
        .asObservable()
        .pipe(take(1))
        .subscribe({
          next: () =>
            this._keyManager.setFocusOrigin(origin).setFirstItemActive(),
          error: (err: Error) => console.error('Menu focus failed', err),
        });
    } else {
      this._keyManager.setFocusOrigin(origin).setFirstItemActive();
    }
  }

  /**
   * Resets the active item in the menu. This is used when the menu is opened, allowing
   * the user to start from the first option when pressing the down arrow.
   */
  resetActiveItem() {
    this._keyManager.setActiveItem(-1);
  }

  /**
   * Registers a menu item with the menu.
   *
   * @docs-private
   */
  addItem(item: OuiMenuItem) {
    // We register the items through this method, rather than picking them up through
    // `ContentChildren`, because we need the items to be picked up by their closest
    // `oui-menu` ancestor. If we used `@ContentChildren(OuiMenuItem, {descendants: true})`,
    // all descendant items will bleed into the top-level menu in the case where the consumer
    // has `oui-menu` instances nested inside each other.
    if (this._items.indexOf(item) === -1) {
      this._items.push(item);
      this._itemChanges.next(this._items);
    }
  }

  /**
   * Removes an item from the menu.
   *
   * @docs-private
   */
  removeItem(item: OuiMenuItem) {
    const index = this._items.indexOf(item);

    if (this._items.indexOf(item) > -1) {
      this._items.splice(index, 1);
      this._itemChanges.next(this._items);
    }
  }

  /**
   * Adds classes to the menu panel based on its position. Can be used by
   * consumers to add specific styling based on the position.
   *
   * @param posX Position of the menu along the x axis.
   * @param posY Position of the menu along the y axis.
   * @docs-private
   */
  setPositionClasses(
    posX: MenuPositionX = this.xPosition(),
    posY: MenuPositionY = this.yPosition()
  ) {
    this._classList = {
      ...this._classList,
      'oui-menu-before': posX === 'before',
      'oui-menu-after': posX === 'after',
      'oui-menu-above': posY === 'above',
      'oui-menu-below': posY === 'below',
    };
    this._changeDetectorRef.markForCheck();
  }
}
