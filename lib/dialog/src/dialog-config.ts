/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ViewContainerRef, EventEmitter, Output} from '@angular/core';

/**
 * Configuration for opening a dialog.
 */
export class OnceDialogConfig {
  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the dialog. This does not affect where the dialog
   * content will be rendered.
   */
  viewContainerRef?: ViewContainerRef;

  /** ID for the dialog. If omitted, a unique one will be generated. */
  id?: string;

  /** Whether the user can use escape or clicking outside to close a modal. */
  disableClose?: boolean = false;

  /** Width of the dialog. */
  width?: string = '';

  /** Height of the dialog. */
  height?: string = '';

  /** Min-width of the dialog. If a number is provided, pixel units are assumed. */
  minWidth?: number | string;

  /** Min-height of the dialog. If a number is provided, pixel units are assumed. */
  minHeight?: number | string;

  /** Max-width of the dialog. If a number is provided, pixel units are assumed. Defaults to 80vw */
  maxWidth?: number | string = '607px';

  /** Max-height of the dialog. If a number is provided, pixel units are assumed. */
  maxHeight?: number | string;

  /** Data being injected into the child component. */
  data = null;

  /** Whether the dialog should focus the first focusable element on open. */
  autoFocus?: boolean = true;

  /** Header section */
  header?: any = {
    title: {
      text: '',
      icon: ''
    },
    actions: {
      icons: [{
        fieldName: 'video',
        tooltip: 'Video',
        className: 'once-ui-action-icons once-ui-video-icon',
        href: 'https://www.youtube.com/watch?v=b1ieJtIx1NY',
        target: '_blank'
      }, {
        fieldName: 'article',
        tooltip: 'Article',
        className: 'once-ui-action-icons once-ui-help-icon',
        href: 'https://www.scheduleonce.com/',
        target: '_blank'
      }, {
        tooltip: 'Close',
        className: 'once-ui-action-icons once-ui-cross-icon'
      }]
    }
  };

  /** Footer section */
  footer?: {
    buttons: any;
    links: any;
  };

  /** Name of the themes */
  theme?: string;
}
