import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  AfterContentInit,
  Input,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'oui-menu-icon',
  template: `
    <div class="oui-menu-icon-container"><div class="oui-menu-icon"></div></div>
  `,
  styleUrls: ['menu.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiMenuIcon',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(menuOpened)': 'menuOpened()',
    '(menuClosed)': 'menuClosed()'
  }
})
export class OuiMenuIcon implements AfterContentInit, OnChanges {
  private _iconDiv: HTMLDivElement;
  @Input() vertical = false;
  constructor(private _elementRef: ElementRef) {}

  ngAfterContentInit() {
    this._iconDiv = this._elementRef.nativeElement.querySelector(
      '.oui-menu-icon'
    );
    this._transformIcon();
  }

  ngOnChanges() {
    this._transformIcon();
  }

  private _transformIcon() {
    if (!this._iconDiv) {
      return;
    }
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
