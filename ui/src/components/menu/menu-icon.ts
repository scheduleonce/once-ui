import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  AfterContentInit,
  Input,
  OnChanges,
  inject,
} from '@angular/core';
import { OuiIconRegistry } from '../icon/icon-registery';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from '../core/shared/icons';

@Component({
  selector: 'oui-menu-icon',
  template: `
    <div class="oui-menu-icon-container">
      <oui-icon svgIcon="menu-icon" class="oui-menu-icon"></oui-icon>
    </div>
  `,
  styleUrls: ['menu.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiMenuIcon',
  host: {
    '(menuOpened)': 'menuOpened()',
    '(menuClosed)': 'menuClosed()',
  },
  standalone: false,
})
export class OuiMenuIcon implements AfterContentInit, OnChanges {
  private _elementRef = inject(ElementRef);
  private ouiIconRegistry = inject(OuiIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  private _iconDiv: HTMLDivElement;
  @Input() vertical = false;

  constructor() {
    this.ouiIconRegistry.addSvgIconLiteral(
      `menu-icon`,
      this.domSanitizer.bypassSecurityTrustHtml(ICONS.THREE_DOT_MENU_ICON)
    );
  }

  ngAfterContentInit() {
    this._iconDiv =
      this._elementRef.nativeElement.querySelector('.oui-menu-icon');
    this._transformIcon();
  }

  ngOnChanges() {
    this._transformIcon();
  }

  private _transformIcon() {
    if (!this._iconDiv) {
      return;
    }
    // Added tabindex to make menu icon keyboard accessible.
    this._iconDiv.parentElement.parentElement.setAttribute('tabindex', '0');
    if (this.vertical) {
      this._iconDiv.parentElement.classList.add('oui-menu-icon-vertical');
    } else {
      this._iconDiv.parentElement.classList.remove('oui-menu-icon-vertical');
    }
  }

  menuOpened() {
    this._iconDiv.classList.add('oui-menu-icon-hover');
  }

  menuClosed() {
    this._iconDiv.classList.remove('oui-menu-icon-hover');
  }
}
