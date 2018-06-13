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
    dialogBox = '';
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

        // Bind data
        this.componentRef.instance.custom = customSettings;


        // 2. Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(this.componentRef.hostView);

        // 3. Get DOM element from component
        const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        // 4. Append DOM element to the body
        document.body.appendChild(domElem);

        // Detect any change
        this.componentRef.changeDetectorRef.detectChanges()
    }

    /**
     * @whatIsThisFor: Opens the dialog
     */
    open(content: any = null, customSettings: any = {}) {
        this.appendComponentToBody(content, customSettings);
        return this.componentRef;
    }

    /**
     * @whatIsThisFor: Close the dialog
     */
    close() {
        this.appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
    }
}