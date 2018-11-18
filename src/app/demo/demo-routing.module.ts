import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleonceComponent } from './scheduleonce/scheduleonce.component';
import { ChatonceComponent } from './chatonce/chatonce.component';
import { InviteonceComponent } from './inviteonce/inviteonce.component';
import { OncehubComponent } from './oncehub/oncehub.component';
import { DemoComponent } from './demo.component';

const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
    children: [
      { path: '', redirectTo: 'scheduleonce', pathMatch: 'full' },
      {
        path: 'scheduleonce',
        component: ScheduleonceComponent
      },
      {
        path: 'chatonce',
        component: ChatonceComponent
      },
      {
        path: 'inviteonce',
        component: InviteonceComponent
      },
      {
        path: 'oncehub',
        component: OncehubComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DemoRoutingModule {}
