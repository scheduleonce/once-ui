import {Component, OnInit, OnChanges} from '@angular/core';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action, configureActions } from '@storybook/addon-actions';
import { text,object,button} from '@storybook/addon-knobs/dist/angular';
import { setOptions } from '@storybook/addon-options';
import { withReadme, withDocs }  from 'storybook-readme';
import * as readmeFile from '../../lib/dialog/README.md';

import { DialogModule } from '../../lib/dialog/src/dialog.module';

import { DialogService } from '../../lib/dialog';

let properties = {
    header: {
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
        },
        title: {
            text: "Hello dialog",
            icon: 'https://encodable.com/uploaddemo/files/reassinment.svg'
        }
    },
    footer: {
        linkButtons: [
            {
                tooltip: 'link 1',
                text: 'link 1',
                disabled: false,
                callback: action('linkButton clicked')
            },
            {
                tooltip: 'link 2',
                text: 'link 2',
                callback: action('linkButton clicked')
            }
        ],
        buttons: [
            {
                tooltip: 'Yes',
                text: 'Yes',
                disabled: false,
                callback: action('button clicked')

            },
            {
                tooltip: 'No',
                text: 'No',
                disabled: false,
                callback: action('button clicked')

            }
        ]
    },
    size: 'small',
    modal: false
}

// Component for content of dialog
@Component({
    template: 'This is the test component for showing the data in the dialog.'
})

class TestComponent {
};

@Component({
    template: '<button (click)="openDialog()">Click to open</button>'
})

class MainComponent {
    custom: any;
    prevCustom: any;
    constructor(private dialog: DialogService) {
    }

    ngOnChanges() {
        if(this.prevCustom && JSON.stringify(this.custom) !== JSON.stringify(this.prevCustom)) {
            this.custom.footer.buttons.forEach((key, index) => {
                this.custom.footer.buttons[index]['callback'] = action('button clicked');
            });

            this.custom.footer.linkButtons.forEach((key, index) => {
                this.custom.footer.linkButtons[index]['callback'] = action('linkButton clicked');
            });

            DialogService.componentRef.instance.custom = this.custom;
            DialogService.componentRef.instance.custom.content = TestComponent;
            DialogService.componentRef.changeDetectorRef.detectChanges();
        }
        this.prevCustom = this.custom;
        properties = this.custom;
    }

    /**
     * Open dialog
     */
    openDialog() {
        this.dialog.open(TestComponent, properties);
    }

};

storiesOf('Dialog', module)
    .addDecorator(moduleMetadata({
        declarations: [
            TestComponent
        ],
        imports: [
            DialogModule
        ],
        providers: [
            DialogService
        ],
        entryComponents: [TestComponent],

    }))
    .addDecorator(withReadme(readmeFile))
    .add('Default', function() {
        return ({
            setOptions: setOptions({ showAddonPanel: true }),
            component: MainComponent,
            props: {
                custom:object('custom', properties),
            }
        })
    });

