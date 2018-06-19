import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef
} from '@angular/core';
import {DialogComponent} from './dialog.component';

@Injectable()
export class DialogService {
  componentRef: any = '';
  lastFocused: any = '';

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
  }

  /**
   * @whatIsThisFor: Adding dialog component to body
   * @param component
   * @param customSettings
   */
  appendComponentToBody(component: any, customSettings: any = {}) {
    // 1. Create a component reference from the component
    this.componentRef = this.componentFactoryResolver
      .resolveComponentFactory(DialogComponent)
      .create(this.injector);

    // 2. Bind data
    this.componentRef.instance.custom = Object.assign({},
      {content: component},
      customSettings);

    // 3. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(this.componentRef.hostView);

    // 4. Get DOM element from component
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 5. Append DOM element to the body
    document.body.appendChild(domElem);

    // 6. Detect any change
    this.componentRef.changeDetectorRef.detectChanges()
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
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
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
    const dialog = document.getElementById('once-ui-modal-header');
    if(dialog) {
      dialog.focus()
    }
    return this.componentRef;
  }

  /**
   * @whatIsThisFor: Close the dialog
   */
  close() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      if(this.lastFocused) {
        this.lastFocused.focus();
      }
    }
  }
}
