import {Component, OnInit, OnChanges, ViewEncapsulation} from '@angular/core';
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
        title: {
            text: "What’s a version control system?",
            icon: 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png'
        },
        video: {
            link: 'https://www.youtube.com/watch?v=Y9XZQO1n_7c',
        },
        article: {
            link: 'https://www.tutorialspoint.com/git/git_tutorial.pdf',
        }
    },
    footer: {
        linkButtons: [
            {
                tooltip: 'Next >>',
                text: 'Next >>',
                callback: action('Link button - next clicked')
            },
            {
                tooltip: 'Prev <<',
                text: 'Prev <<',
                callback: action('Link button - prev clicked')
            }
        ],
        buttons: [
            {
                tooltip: 'Submit & finish',
                text: 'Submit & finish',
                callback: action('Button - submit all clicked')

            },
            {
                tooltip: 'Cancel & close',
                text: 'Cancel & close',
                callback: action('Button - Cancel and close is clicked')
            }
        ]
    },
    size: 'small',
    modal: false
};

// Component for content of dialog
@Component({
    templateUrl: './dialog.html',
    styleUrls: ['../../lib/themes/once-ui-theme-blue.scss'],
    encapsulation: ViewEncapsulation.None
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

