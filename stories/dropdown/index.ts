import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action, configureActions } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs, object, array } from '@storybook/addon-knobs/dist/angular';
import { withReadme, withDocs } from 'storybook-readme';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DropDownComponent } from '../../lib/drop-down/src/drop-down.component';
import { FilterPipe } from '../../lib/drop-down/src/filter.pipe';
import { KeysPipe } from '../../lib/drop-down/src/keys.pipe';
import { DecodePipe } from '../../lib/drop-down/src/html.pipe';
import * as readmeFile from '../../lib/drop-down/README.md';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: true
};

const defaultValue = {
    text: `Dinesh rawat`,
    imageLink: 'https://d1xxq9cngjffd0.cloudfront.net/_636529704583406580_logo_OTExMzExNDQzNA==.png',
    value: '1'
};

const  defaultOptions = [
    {
        text: `John`,
        imageLink: 'https://d1xxq9cngjffd0.cloudfront.net/_636620462253487372_logo_OTA0NTExNDQzNA==.png',
        value: '2'
    },
    {
        text: `Dinesh rawat`,
        imageLink: 'https://d1xxq9cngjffd0.cloudfront.net/_636529704583406580_logo_OTExMzExNDQzNA==.png',
        value: '1'
    },
    {
        text: `Luca Howard`,
        imageLink: 'https://d1xxq9cngjffd0.cloudfront.net/_636529703506387828_logo_OTgxNjExNDQzNA==.png',
        value: '3'
    },
    {
        text: `Joseph Reynolds`,
        imageLink: 'https://d1xxq9cngjffd0.cloudfront.net/_636620463669155955_sid_OTEzOTExNDQzNA==.png',
        value: '4'
    },

];

storiesOf('Dropdown', module)
    .addDecorator(moduleMetadata({
            imports: [
                CommonModule,
                PerfectScrollbarModule],
            schemas: [],
            declarations: [
                // pipes
                FilterPipe,
                DecodePipe,
                KeysPipe
            ],
            providers: [{
                provide: PERFECT_SCROLLBAR_CONFIG,
                useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
            }],
        })
    )
    .addDecorator(withReadme(readmeFile))
    .add('default', () => ({
        component: DropDownComponent,
        props: {
            options: object('options', defaultOptions),
            default: object('default', defaultValue),
            allowSearch: boolean('allowSearch', true),
            showImage: boolean('showImage', true),
            truncateTextAfter: number('truncateTextAfter', 0),
            searchPlaceholderText: text('searchPlaceholderText', 'Search your option here...'),
            defaultOptionTitle: text('defaultOptionTitle', 'Please select option'),
            fixedTitle: boolean('fixedTitle', false),
            isBorderLess: boolean('isBorderLess', false),
            customClick: action('Option changed'),
            borderBottomColor: text('borderBottomColor', '#008000'),
            disabledDropdown: boolean('disabledDropdown', false),
            selectedAndDisabledOptions: object('selectedAndDisabledOptions', [])
        }
    }))
    .add('dropdown with borders', () => ({
        component: DropDownComponent,
        props: {
            options: object('options', defaultOptions),
            default: object('default', defaultValue),
            allowSearch: boolean('allowSearch', true),
            truncateTextAfter: number('truncateTextAfter', 0),
            searchPlaceholderText: text('searchPlaceholderText', 'Search your option here...'),
            defaultOptionTitle: text('defaultOptionTitle', 'Please select option'),
            customClick: action('Option changed'),
        }
    }))
    .add('dropdown without borders', () => ({
        component: DropDownComponent,
        props: {
            options: object('options', defaultOptions),
            default: object('default', defaultValue),
            fixedTitle: boolean('fixedTitle', false),
            isBorderLess: boolean('isBorderLess', true),
            customClick: action('Option changed'),
            borderBottomColor: text('borderBottomColor', '#008000'),
            disabledDropdown: boolean('disabledDropdown', false),
            selectedAndDisabledOptions: object('selectedAndDisabledOptions', []),
        }
    }));


