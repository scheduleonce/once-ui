import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';
import { ScheduleonceComponent } from './scheduleonce/scheduleonce.component';
import { InviteonceComponent } from './inviteonce/inviteonce.component';
import { ChatonceComponent } from './chatonce/chatonce.component';
import { OncehubComponent } from './oncehub/oncehub.component';
import { DemoRoutingModule } from './demo-routing.module';
import { OuiButtonModule, OuiDialogModule} from '@once/ui';

@NgModule({
  imports: [
    CommonModule,
    DemoRoutingModule,
    OuiButtonModule,
    OuiDialogModule
  ],
  declarations: [DemoComponent, 
    ScheduleonceComponent,
    InviteonceComponent,
    ChatonceComponent,
    OncehubComponent
  ],
})
export class DemoModule { }
