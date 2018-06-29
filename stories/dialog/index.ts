import {Component, OnInit, OnChanges, ViewEncapsulation} from '@angular/core';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action, configureActions } from '@storybook/addon-actions';
import { text,object,button,boolean,select} from '@storybook/addon-knobs/dist/angular';
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
                callback: action('Next >> clicked')
            },
            {
                tooltip: 'Prev <<',
                text: 'Prev <<',
                callback: action('Prev << clicked')
            }
        ],
        buttons: [
            {
                tooltip: 'Submit & finish',
                text: 'Submit & finish',
                callback: action('Submit & finish clicked')

            },
            {
                tooltip: 'Cancel & close',
                text: 'Cancel & close',
                callback: action('Cancel & close clicked')
            }
        ]
    }
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
    modal:boolean = false;
    size:any;
    constructor(private dialog: DialogService) {
    }

    ngOnChanges() {
        if(this.prevCustom && JSON.stringify(this.custom) !== JSON.stringify(this.prevCustom)) {
            if(this.custom.footer) { 
                this.custom.footer.buttons && this.custom.footer.buttons.forEach((key, index) => {
                    this.custom.footer.buttons[index]['callback'] = action((this.custom.footer.buttons[index]['text'] || 'Button') +' clicked');
                });

                this.custom.footer.linkButtons && this.custom.footer.linkButtons.forEach((key, index) => {
                    this.custom.footer.linkButtons[index]['callback'] = action((this.custom.footer.linkButtons[index]['text'] || 'linkButton') + ' clicked');
                });
            }

            DialogService.componentRef.instance.custom = this.custom;
            DialogService.componentRef.instance.custom.content = TestComponent;
            DialogService.componentRef.changeDetectorRef.detectChanges();
        }

        if(DialogService.componentRef.instance) {
            DialogService.componentRef.instance.custom.modal = this.modal;
            DialogService.componentRef.instance.custom.size = this.size;
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
                modal: boolean('modal', false),
                size: select('size', ['small', 'large']),
            }
        })
    });

