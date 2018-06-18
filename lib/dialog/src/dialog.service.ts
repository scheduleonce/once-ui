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
   * @returns {any}
   */
  open(content: any, customSettings: any = {}) {
    this.close();
    this.appendComponentToBody(content, customSettings);
    return this.componentRef;
  }

  /**
   * @whatIsThisFor: Close the dialog
   */
  close() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
    }
  }
}
