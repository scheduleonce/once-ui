/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { ObserversModule } from '@angular/cdk/observers';
import { A11yModule } from '@angular/cdk/a11y';
import { OuiTabBodyPortal } from './tab-body';
import { OuiTabContent } from './tab-content';
import { OuiTabLabel } from './tab-label';
import { ouiTabLabelWrapper } from './tab-label-wrapper';
import { OuiTab } from './tab';
import { OuiTabHeader } from './tab-header';
import { ouiTabGroup } from './tab-group';
import {
  OuiTabNav,
  ouiTabNavPanel,
  OuiTabLink,
} from './tab-nav-bar/tab-nav-bar';
import { OuiTabBody } from './tab-body';

@NgModule({
  imports: [CommonModule, PortalModule, ObserversModule, A11yModule],
  exports: [
    OuiTabContent,
    OuiTabLabel,
    OuiTab,
    ouiTabGroup,
    OuiTabNav,
    ouiTabNavPanel,
    OuiTabLink,
    OuiTabBodyPortal,
    OuiTabBody,
  ],
  declarations: [
    OuiTabContent,
    OuiTabLabel,
    OuiTab,
    ouiTabGroup,
    OuiTabNav,
    ouiTabNavPanel,
    OuiTabLink,

    // Private directives, should not be exported.
    ouiTabLabelWrapper,
    OuiTabHeader,
    OuiTabBody,
    OuiTabBodyPortal,
  ],
})
export class OuiTabsModule {}
