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
    text: `leona`,
    imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
    value: '6'
};

const  defaultOptions = [
    {
        text: `MBPLabel`,
        imageLink: '',
        value: '1'
    },
    {
        text: `MBPRequest`,
        imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
        value: '2'
    },
    {
        text: `WithoutE`,
        value: '3'
    },
    {
        text: `leona`,
        imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
        value: '6'
    }
];

const withBorder = 'with-Border';
const withoutBorder = 'without-Border';

storiesOf('DropDown', module)
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
    .add('Default', () => ({
        component: DropDownComponent,
        props: {
            options: object('options', defaultOptions, withBorder),
            default: object('default', defaultValue, withBorder),
            allowSearch: boolean('allowSearch', true, withBorder),
            showImage: boolean('showImage', true, withBorder),
            truncateTextAfter: number('truncateTextAfter', 0, withBorder),
            searchPlaceholderText: text('searchPlaceholderText', 'Search your option here...', withBorder),
            defaultOptionTitle: text('defaultOptionTitle', 'Please select option', withBorder),
            fixedTitle: boolean('fixedTitle', false, withoutBorder),
            isBorderLess: boolean('isBorderLess', true, withoutBorder),
            customClick: action('clicked'),
            borderBottomColor: text('borderBottomColor', 'green', withoutBorder),
            disabledDropdown: boolean('disabledDropdown', false, withoutBorder)
        }
    }));
