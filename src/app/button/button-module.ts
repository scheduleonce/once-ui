import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {OuiAnchor, OuiButton} from './button';


@NgModule({
    imports: [
      CommonModule
    ],
    exports: [
      OuiButton,
      OuiAnchor,
    ],
    declarations: [
      OuiButton,
      OuiAnchor,
    ],
  })
  export class OuiButtonModule {}