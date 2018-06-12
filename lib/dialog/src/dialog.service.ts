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

    appendComponentToBody(component: any) {
        // 1. Create a component reference from the component
        this.componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);

        // 2. Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(this.componentRef.hostView);

        // 3. Get DOM element from component
        const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        // 4. Append DOM element to the body
        document.body.appendChild(domElem);
    }

    open() {
        this.appendComponentToBody(DialogComponent)
    }

    close() {
        this.appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
    }
}