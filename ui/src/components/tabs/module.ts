/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {OuiCommonModule, OuiRippleModule} from '../core';
import {PortalModule} from '@angular/cdk/portal';
import {ObserversModule} from '@angular/cdk/observers';
import {A11yModule} from '@angular/cdk/a11y';
import {OuiTabBody, OuiTabBodyPortal} from './tab-body';
import {OuiTabContent} from './tab-content';
import {OuiTabLabel} from './tab-label';
import {OuiTabLabelWrapper} from './tab-label-wrapper';
import {OuiTab} from './tab';
import {OuiTabHeader} from './tab-header';
import {OuiTabGroup} from './tab-group';
import {OuiTabNav, OuiTabNavPanel, OuiTabLink} from './tab-nav-bar/tab-nav-bar';

@NgModule({
  imports: [
    CommonModule,
    OuiCommonModule,
    PortalModule,
    OuiRippleModule,
    ObserversModule,
    A11yModule,
  ],
  exports: [
    OuiCommonModule,
    OuiTabContent,
    OuiTabLabel,
    OuiTab,
    OuiTabGroup,
    OuiTabNav,
    OuiTabNavPanel,
    OuiTabLink,
  ],
  declarations: [
    OuiTabContent,
    OuiTabLabel,
    OuiTab,
    OuiTabGroup,
    OuiTabNav,
    OuiTabNavPanel,
    OuiTabLink,
    // Private directives, should not be exported.
    OuiTabBody,
    OuiTabBodyPortal,
    OuiTabLabelWrapper,
    OuiTabHeader,
  ],
})
export class OuiTabsModule {}
