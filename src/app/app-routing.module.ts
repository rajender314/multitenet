import { UserProfile2Component } from './user-profile2/user-profile2.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { InstancesComponent } from './instances/instances.component';
import { UsersComponent } from './users/users.component';
import { FeaturesComponent } from './features/features.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { SettingsComponent } from './settings/settings.component';
import { EmailControllerComponent } from './email-controller/email-controller.component';
import { EmailDetailsComponent } from './email-details/email-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserLogsComponent } from './user-logs/user-logs.component';
import { SystemErrorsComponent } from './superadmin/system-errors/system-errors.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { InstanceDetailsComponent } from './instances/instance-details/instance-details.component';
import { SubscriptionsComponent } from './superadmin/subscriptions/subscriptions.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'instances', component: InstancesComponent },
  { path: 'instances/:id', component: InstanceDetailsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'userprofile', component: UserProfileComponent },
  { path: 'userprofile2', component: UserProfile2Component },

  { path: 'subscriptions', component: SubscriptionsComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  {
    path: 'superadmin', component: SuperadminComponent, children: [
      {
        path: 'settings', component: SettingsComponent
      },
      {
        path: 'email-controller', component: EmailControllerComponent
      },
      {
        path: 'email-details', component: EmailDetailsComponent
      },
      {
        path: 'user-logs', component: UserLogsComponent
      },
      {
        path: 'system-errors', component: SystemErrorsComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

