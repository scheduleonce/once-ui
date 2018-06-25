import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef
} from '@angular/core';
import {DialogComponent} from './dialog.component';
import { FocusTrapFactory } from '@angular/cdk/a11y';

@Injectable()
export class DialogService {
  static componentRef: any = '';
  lastFocused: any = '';

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private focusTrap: FocusTrapFactory) {
  }

  /**
   * @whatIsThisFor: Adding dialog component to body
   * @param component
   * @param customSettings
   */
  appendComponentToBody(component: any, customSettings: any = {}) {
    // 1. Create a component reference from the component
    DialogService.componentRef = this.componentFactoryResolver
      .resolveComponentFactory(DialogComponent)
      .create(this.injector);

    // 2. Bind data
    DialogService.componentRef.instance.custom = Object.assign({},
      {content: component},
      customSettings);

    // 3. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(DialogService.componentRef.hostView);

    // 4. Get DOM element from component
    const domElem = (DialogService.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 5. Append DOM element to the body
    document.body.appendChild(domElem);

    // 6. Detect any change
    DialogService.componentRef.changeDetectorRef.detectChanges()
  }

  /**
   * @whatIsThisFor: Opens the dialog
   * @param content
   * @param customSettings
   */
  open(content: any, customSettings: any = {}) {
    if(!this.lastFocused) this.lastFocused = document.activeElement;
    this.close();
    this.appendComponentToBody(content, customSettings);
    const domElem = (DialogService.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    let data = content && content.nativeElement ? content.nativeElement.innerHTML : '';

    // Component
    if (typeof content === 'function') {
      const loadComponentRef = this.componentFactoryResolver
        .resolveComponentFactory(content)
        .create(this.injector);
      const domElem = (loadComponentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
      data = domElem.innerHTML;
    }
    document.getElementById('loadComponent').innerHTML = data;

    let focusTrap = this.focusTrap.create(domElem);  // creates a focus trap region
    focusTrap.focusInitialElement();    // Moves the focus in the

    return DialogService.componentRef;
  }

  /**
   * @whatIsThisFor: Close the dialog
   */
  close() {
    if (DialogService.componentRef) {
      this.appRef.detachView(DialogService.componentRef.hostView);
      DialogService.componentRef.destroy();
      if(this.lastFocused) {
        this.lastFocused.focus();
      }
    }
  }
}