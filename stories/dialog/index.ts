import {Component, OnInit, OnChanges} from '@angular/core';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action, configureActions } from '@storybook/addon-actions';
import { text,object,button} from '@storybook/addon-knobs/dist/angular';
import { setOptions } from '@storybook/addon-options';
import { withReadme, withDocs }  from 'storybook-readme';
import * as readmeFile from '../../lib/dialog/README.md';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../lib/dialog/src/dialog.component';
import { DialogHeaderComponent } from '../../lib/dialog/src/header/dialog.header.component';
import { DialogFooterComponent } from '../../lib/dialog/src/footer/dialog.footer.component';
import { DialogContentComponent } from '../../lib/dialog/src/content/dialog.content.component';
import { DialogOverlayComponent } from '../../lib/dialog/src/overlay/dialog.overlay.component';
import { OnceDialogConfig } from '../../lib/dialog/src/dialog-config';
import { FocusTrapFactory, InteractivityChecker, FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { DialogService } from '../../lib/dialog';


    @Component({
        selector: 'test-component',
        template: 'This is the test component for showing the data in the dialog.'
      })
    class TestComponent{
        constructor() {
        }
    };
    
storiesOf('Dialog',module)
    .addDecorator(moduleMetadata({
        declarations: [
            DialogHeaderComponent,
            DialogFooterComponent,
            DialogContentComponent,
            DialogOverlayComponent
        ],
        providers: [
            OnceDialogConfig, 
            FocusTrapFactory, 
            InteractivityChecker, 
            Platform, 
            FocusMonitor,
            DialogService
        ],
    }))
    .addDecorator(withReadme(readmeFile))
    .add('Default', () => ({
        setOptions: setOptions({ showAddonPanel: true }),
        component: DialogComponent,
        props: {
            custom:object('custom', {
                content:TestComponent, 
                header: {
                    title:{
                        text: "Header Title",
                        icon: 'https://cloudinary-res.cloudinary.com/image/upload/c_fit,dpr_auto,h_100,w_85/v1501276210/ico-image-upload2x-170x201.png'
                    },
                    article: {
                        tooltip: 'article',
                        link: 'https://www.youtube.com/watch?v=b1ieJtIx1NY',
                    },
                    video: {
                        tooltip: 'Video',
                        link: 'https://www.youtube.com/watch?v=b1ieJtIx1NY',
                    },
                    close: {
                        tooltip: 'Close'
                    }
                },
                footer: {
                    linkButtons: [
                      {
                        tooltip: 'tooltip tex wew wewe w ewet',
                        text: 'Link text to show sdsdsdsd',
                        disabled: false,
                        callback: function(){
                        }
                      },
                      {
                        tooltip: 'tooltip text',
                        text: 'Link text to show',
                        disabled: true,
                        callback: function(){
                        }
                      }
                    ],
                    buttons: [
                      {
                        tooltip: 'Button tooltip text asasasas',
                        text: 'Button text to show',
                        disabled: true,
                        callback: function(){
                        }
                      },
                      {
                        tooltip: 'Button tooltip text',
                        text: 'Button text to show',
                        disabled: false,
                        callback: function(){
                        }
                      }
                    ]
                    },
                size: '',
                theme: 'once-ui-theme-blue',
                modal: true,
                escape: true
            }),
        }
    }));



