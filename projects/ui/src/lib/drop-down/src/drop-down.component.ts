/**
 * Angular app-drop-down
 * Features:
 *  Custom options, default option (label)
 *  Custom model bindings to property or object
 *  Flexible client side search
 *  Custom options with image
 */
import {
  Component,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
  NgZone,
  ElementRef
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// @dynamic
@Component({
  selector: 'once-ui-dropdown',
  templateUrl: 'drop-down.component.html',
  styleUrls: ['drop-down.component.scss', 'border-less.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropDownComponent implements OnInit {
  static currentDropdown: any;
  @Input()
  options: any;
  @Input()
  allowSearch: any;
  @Input()
  default: any;
  @Input()
  key: any;
  @Input()
  showImage = false;
  @Input()
  selectedOption;
  @Input()
  truncateTextAfter = 0;
  @Input()
  isBorderLess = false;
  @Input()
  errorCondition: any;
  @Input()
  defaultOptionTitle: string;
  @Input()
  borderBottomColor: string;
  @Input()
  selectedAndDisabledOptions: any;
  @Input()
  searchPlaceholderText: string;
  @Input()
  fixedTitle = false;
  @Input()
  disabledDropdown = false;
  @Output()
  isDropdownOpened: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  customClick = new EventEmitter();
  searchText: string;
  selectableOptions: any;
  searchBoxVisibiltyThreshold = 6;
  config: PerfectScrollbarConfigInterface = {};
  dropdownUp = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private eltRef: ElementRef
  ) {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('click', function() {
        if (DropDownComponent.currentDropdown) {
          DropDownComponent.currentDropdown.classList.remove('active');
        }
      });
    });
    this.searchText = '';
  }

  /**
   * The "callback" argument is called with either true or false
   * depending on whether the image at "url" exists or not.
   */
  static imageExists(url) {
    const image = new Image();
    image.src = url;

    if (!image.complete) {
      return false;
    } else if (image.height === 0) {
      return false;
    }

    return true;
  }

  ngOnInit() {
    this.selectableOptions =
      this.options.length && this.allowSearch
        ? this.options.filter(option => {
            // tslint:disable-next-line:radix
            return parseInt(option.value) !== -1;
          })
        : [];
  }

  /**
   * Open dropdown
   * @param event
   */
  openDropdown(event) {
    this.isDropdownOpened.emit();
    event.stopPropagation();
    const target = event.target;
    if (
      target.type !== 'text' &&
      !target.classList.contains('noResultsFound')
    ) {
      this.searchText = '';
      event.target.classList.toggle('active');
      // If the drop-down has input field, need to focus.
      if (
        target.classList.contains('active') &&
        target.parentNode.querySelector('input')
      ) {
        target.parentNode.querySelector('input').focus();
      }
      if (
        DropDownComponent.currentDropdown &&
        DropDownComponent.currentDropdown.classList.contains('active') &&
        target &&
        target.classList.contains('active') &&
        DropDownComponent.currentDropdown !== target
      ) {
        DropDownComponent.currentDropdown.classList.remove('active');
      }
      // Drop if already exists
      DropDownComponent.currentDropdown = target;

      const position = target.getBoundingClientRect().top;
      const buttonHeight = target.getBoundingClientRect().height;
      const dropdownMenu = this.eltRef.nativeElement.querySelector(
        '.scrollbar-active'
      );
      // control drop down list to open up or down automatically
      if (
        position > dropdownMenu.offsetHeight &&
        window.innerHeight - position < buttonHeight + dropdownMenu.offsetHeight
      ) {
        this.dropdownUp = true;
      } else {
        this.dropdownUp = false;
      }
    }
  }

  /**
   * Search options
   * @param event
   */
  searchOptions(event: any) {
    this.searchText = event.target.value;
  }

  /**
   * Change option
   * @param event
   * @param data
   * @param isDisabledOptionClicked
   */
  changeOption(event: any, data: any, isDisabledOptionClicked = false) {
    event.stopPropagation();
    if (data.value !== 'no_result' && !isDisabledOptionClicked) {
      this.searchText = '';
      // If object
      if (typeof data === 'string' || typeof data === 'number') {
        this.default[data] = this.options[data];
        this.key = data;
      } else {
        this.default = data;
      }
      this.cdr.detectChanges();
      DropDownComponent.currentDropdown.classList.remove('active');
      this.searchText = '';
      // If any custom click event is provided
      if (this.customClick) {
        this.customClick.emit(data);
      }
    }
  }
  /**
   * Check if array or object
   */
  checkIfObject() {
    return (
      this.options instanceof Object && this.options.constructor === Object
    );
  }

  /**
   * Using 'imageExists'
   */
  checkIfImageNotExists(url) {
    return DropDownComponent.imageExists(url) === false;
  }

  /**
   * Is image present
   * @param img
   */
  isImagePresent(img) {
    return !img.imageLink || img.imageLink === 'undefined';
  }

  /**
   * Check for selected options
   * @param option
   */
  checkIfItIsAlreadySelcted(option) {
    return (
      this.selectedAndDisabledOptions.findIndex(data => {
        return JSON.stringify(data) === JSON.stringify(option);
      }) >= 0
    );
  }
}
