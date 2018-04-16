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
  Input
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-drop-down',
  templateUrl: 'drop-down.component.html',
  styleUrls: ['drop-down.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropDownComponent {
  static currentDropdown: any;
  @Input() options: any;
  @Input() allowSearch: any;
  @Input() default: any;
  @Input() key: any;
  @Input() showImage = false;
  @Input() errorCondition: any;
  @Input() outerStyle: false;
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() customClick = new EventEmitter();
  searchText: string;
  config: PerfectScrollbarConfigInterface = {};

  constructor() {
    this.searchText = '';
  }

  /**
   * Open dropdown
   * @param event
   */
  openDropdown(event) {
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
   * Image has some exception
   */
  imageErrorHandler(event) {
    event.target.src = `./icon-noImage2x.png`;
  }

  /**
   * Change option
   * @param event
   * @param data
   */
  changeOption(event: any, data: any) {
    event.stopPropagation();
    if (data.value !== 'no_result') {
      this.searchText = '';
      // If object
      if (typeof data === 'string' || typeof data === 'number') {
        this.default[data] = this.options[data];
        this.key = data;
      } else {
        this.default = data;
      }
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
}
