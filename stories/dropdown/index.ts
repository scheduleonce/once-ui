import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action, configureActions } from '@storybook/addon-actions';

import { withReadme, withDocs } from 'storybook-readme';
import { CommonModule } from '@angular/common';
// import * as DropdownReadme from '../../lib/drop-down/README.md';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: true
};

import { DropDownComponent } from '../../lib/drop-down/src/drop-down.component';
import { FilterPipe } from '../../lib/drop-down/src/filter.pipe';
import { KeysPipe } from '../../lib/drop-down/src/keys.pipe';
import { DecodePipe } from '../../lib/drop-down/src/html.pipe';

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
  .add('Dropdown with border', () => ({
      component: DropDownComponent,
      props: {
          options: [
              {
                  text: `Master pages`,
                  imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
                  value: '-1'
              },
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
                  text: `Booking Pages`,
                  imageLink: '',
                  value: '-1'
              },
              {
                  text: `WithoutE4`,
                  value: '4'
              },
              {
                  text: `dana`,
                  imageLink: '',
                  value: '5'
              },
              {
                  text: `leona`,
                  imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
                  value: '6'
              },
              {
                  text: `bheeren`,
                  value: '7'
              },
              {
                  text: `bhinay`,
                  imageLink: '',
                  value: '8'
              },
              {
                  text: `WithoutE4`,
                  value: '9'
              },
              {
                  text: `Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212`,
                  value: `10`
              }
          ],
          default : {
              text: 'dana',
              imageLink: '',
              value: '5'
          },
          customClick: action('clicked')
      }
  }))
    .add('Dropdown borderless with fixed text', () => ({
        component: DropDownComponent,
        props: {
            options: [
                {
                    text: `Master pages`,
                    imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
                    value: '-1'
                },
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
                    text: `Booking Pages`,
                    imageLink: '',
                    value: '-1'
                },
                {
                    text: `WithoutE4`,
                    value: '4'
                },
                {
                    text: `dana`,
                    imageLink: '',
                    value: '5'
                },
                {
                    text: `leona`,
                    imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
                    value: '6'
                },
                {
                    text: `bheeren`,
                    value: '7'
                },
                {
                    text: `bhinay`,
                    imageLink: '',
                    value: '8'
                },
                {
                    text: `WithoutE4`,
                    value: '9'
                },
                {
                    text: `Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212`,
                    value: `10`
                }
            ],
            defaultOptionTitle: 'Please select page link',
            fixedTitle: true,
            isBorderLess: true,
            customClick: action('clicked')
        }
    }))
    .add('Dropdown borderless with disabled options', () => ({
        component: DropDownComponent,
        props: {
            options: [
                {
                    text: `Master pages`,
                    imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
                    value: '-1'
                },
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
                    text: `Booking Pages`,
                    imageLink: '',
                    value: '-1'
                },
                {
                    text: `WithoutE4`,
                    value: '4'
                },
                {
                    text: `dana`,
                    imageLink: '',
                    value: '5'
                },
                {
                    text: `leona`,
                    imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
                    value: '6'
                },
                {
                    text: `bheeren`,
                    value: '7'
                },
                {
                    text: `bhinay`,
                    imageLink: '',
                    value: '8'
                },
                {
                    text: `WithoutE4`,
                    value: '9'
                },
                {
                    text: `Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212`,
                    value: `10`
                }
            ],
            defaultOptionTitle: 'Please select page link',
            fixedTitle: true,
            isBorderLess: true,
            selectedAndDisabledOptions: [{
                text: `Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212`,
                value: '10'
            },
            {
                text: `bheeren`,
                value: '7'
            }],
            customClick: action('clicked')
        }
    }))
    .add('Dropdown with search bar and trancated options', () => ({
        component: DropDownComponent,
        props: {
            options: [
                {
                    text: `Master pages`,
                    imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
                    value: '-1'
                },
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
                    text: `Booking Pages`,
                    imageLink: '',
                    value: '-1'
                },
                {
                    text: `WithoutE4`,
                    value: '4'
                },
                {
                    text: `dana`,
                    imageLink: '',
                    value: '5'
                },
                {
                    text: `leona`,
                    imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
                    value: '6'
                },
                {
                    text: `bheeren`,
                    value: '7'
                },
                {
                    text: `bhinay`,
                    imageLink: '',
                    value: '8'
                },
                {
                    text: `WithoutE4`,
                    value: '9'
                },
                {
                    text: `Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212`,
                    value: `10`
                }
            ],
            defaultOptionTitle: 'Please select page link',
            searchPlaceholderText: 'Search for option here',
            showImage: true,
            allowSearch: true,
            selectedAndDisabledOptions: [
            {
                text: `bheeren`,
                value: '7'
            }],
            customClick: action('clicked')
        }
    }))
    // .add('Default', withReadme(DropdownReadme , () => ({
    //     component: DropDownComponent,
    //     props: {
    //         options: [
    //             {
    //                 text: `Master pages`,
    //                 imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
    //                 value: '-1'
    //             },
    //             {
    //                 text: `MBPLabel`,
    //                 imageLink: '',
    //                 value: '1'
    //             },
    //             {
    //                 text: `MBPRequest`,
    //                 imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
    //                 value: '2'
    //             },
    //             {
    //                 text: `WithoutE`,
    //                 value: '3'
    //             },
    //             {
    //                 text: `Booking Pages`,
    //                 imageLink: '',
    //                 value: '-1'
    //             },
    //             {
    //                 text: `WithoutE4`,
    //                 value: '4'
    //             },
    //             {
    //                 text: `dana`,
    //                 imageLink: '',
    //                 value: '5'
    //             },
    //             {
    //                 text: `leona`,
    //                 imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
    //                 value: '6'
    //             },
    //             {
    //                 text: `bheeren`,
    //                 value: '7'
    //             },
    //             {
    //                 text: `bhinay`,
    //                 imageLink: '',
    //                 value: '8'
    //             },
    //             {
    //                 text: `WithoutE4`,
    //                 value: '9'
    //             },
    //             {
    //                 text: `Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212 Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212Master pages 121212`,
    //                 value: `10`
    //             }
    //         ]
    //      }
    // })));
