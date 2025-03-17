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
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  OnInit,
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
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
    standalone: false
})
export class OuiMenu
  implements AfterContentInit, OuiMenuPanel<OuiMenuItem>, OnInit, OnDestroy
{
  private _keyManager: FocusKeyManager<OuiMenuItem>;
  private _xPosition: MenuPositionX = this._defaultOptions.xPosition;
  private _yPosition: MenuPositionY = this._defaultOptions.yPosition;

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
  @Input()
  backdropClass: string = this._defaultOptions.backdropClass;

  /** Whether the menu has a backdrop. */
  @Input()
  get hasBackdrop(): boolean | undefined {
    return this._hasBackdrop;
  }
  set hasBackdrop(value: boolean | undefined) {
    this._hasBackdrop = coerceBooleanProperty(value);
  }
  private _hasBackdrop: boolean | undefined = this._defaultOptions.hasBackdrop;

  /** Position of the menu in the X axis. */
  @Input()
  get xPosition(): MenuPositionX {
    return this._xPosition;
  }
  set xPosition(value: MenuPositionX) {
    if (value !== 'before' && value !== 'after') {
      throwOuiMenuInvalidPositionX();
    }
    this._xPosition = value;
    this.setPositionClasses();
  }

  /** Position of the menu in the Y axis. */
  @Input()
  get yPosition(): MenuPositionY {
    return this._yPosition;
  }
  set yPosition(value: MenuPositionY) {
    if (value !== 'above' && value !== 'below') {
      throwOuiMenuInvalidPositionY();
    }
    this._yPosition = value;
    this.setPositionClasses();
  }

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
  @Input()
  get overlapTrigger(): boolean {
    return this._overlapTrigger;
  }
  set overlapTrigger(value: boolean) {
    this._overlapTrigger = coerceBooleanProperty(value);
  }
  private _overlapTrigger: boolean = this._defaultOptions.overlapTrigger;

  /**
   * This method takes classes set on the host oui-menu element and applies them on the
   * menu template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing menu from outside the component.
   *
   * @param classes list of class names
   */
  @Input('class')
  set panelClass(classes: string) {
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
  @Output()
  readonly closed: EventEmitter<void | 'click' | 'keydown' | 'tab'> =
    new EventEmitter<void | 'click' | 'keydown' | 'tab'>();

  /**
   * Event emitted when the menu is closed.
   *
   * @deprecated Switch to `closed` instead
   * @breaking-change 8.0.0
   */
  @Output()
  close = this.closed;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _ngZone: NgZone,
    @Inject(OUI_MENU_DEFAULT_OPTIONS)
    private _defaultOptions: OuiMenuDefaultOptions
  ) {}

  ngOnInit() {
    this.setPositionClasses();
  }

  ngAfterContentInit() {
    this._keyManager = new FocusKeyManager<OuiMenuItem>(this._items)
      .withWrap()
      .withTypeAhead();
    this._tabSubscription = this._keyManager.tabOut.subscribe(() =>
      this.closed.emit('tab')
    );
  }

  ngOnDestroy() {
    this._tabSubscription.unsubscribe();
    this.closed.complete();
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
        .subscribe(() =>
          this._keyManager.setFocusOrigin(origin).setFirstItemActive()
        );
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
    posX: MenuPositionX = this.xPosition,
    posY: MenuPositionY = this.yPosition
  ) {
    const classes = this._classList;
    classes['oui-menu-before'] = posX === 'before';
    classes['oui-menu-after'] = posX === 'after';
    classes['oui-menu-above'] = posY === 'above';
    classes['oui-menu-below'] = posY === 'below';
  }
}
