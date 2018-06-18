/**
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Configuration for opening a dialog.
 */
export class OnceDialogConfig {
  /** Header section */
  header?: any = {
    title: {
      text: '',
      icon: ''
    },
    video: {
      tooltip: 'Video',
      link: 'https://www.youtube.com/watch?v=b1ieJtIx1NY'
    },
    article: {
      tooltip: 'Article',
      link: 'https://www.scheduleonce.com/',
    },
    close: {
      tooltip: 'Close'
    }
  };

  /** Footer section */
  footer?: {
    buttons: any;
    linkButtons: any;
  };

  /** Name of the themes */
  theme?: string;

  /** Dialog size **/
  size?: string = 'small';

  /** Dialog- modal or popup **/
  modal: false
}
