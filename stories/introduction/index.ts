import {storiesOf, moduleMetadata} from '@storybook/angular';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {withReadme}  from 'storybook-readme';
import * as ReadmeFile from '../../README.md';
import { setOptions } from '@storybook/addon-options';
import { IntroductionComponent } from './introduction.component';
storiesOf('Once UI ', module)
    .addDecorator(moduleMetadata({
            imports: [
                CommonModule,
                BrowserModule,
                BrowserAnimationsModule
            ],
            schemas: [],
            declarations: []
        })
    )
    .add('default', () => ({
        setOptions: setOptions({ showAddonPanel: false }),
        component: IntroductionComponent
    }));