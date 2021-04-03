import { BrowserModule } from '@angular/platform-browser';
import { FileSelectDirective } from 'ng2-file-upload';

import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InstancesComponent } from './instances/instances.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule, MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ConfirmdialogComponent } from './dialogs/confirmdialog/confirmdialog.component';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddinstanceComponent } from './dialogs/addinstance/addinstance.component';
import { MenuComponent } from './menu/menu.component';
import { UsersComponent } from './users/users.component';
import { TokenInterceptor } from './token.interceptor';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { AddUserComponent } from './dialogs/add-user/add-user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeaturesComponent } from './features/features.component';
import { AccessFeaturesComponent } from './access-features/access-features.component';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { SettingsComponent } from './settings/settings.component';
import { EmailControllerComponent } from './email-controller/email-controller.component';
import { AgGridModule } from 'ag-grid-angular';
import { CellCustomComponent } from './email-controller/cell-custom/cell-custom.component';
import { ShowMessageComponent } from './email-controller/show-message/show-message.component';
import { EmailDetailsComponent } from './email-details/email-details.component';
import { SendMailComponent } from './email-controller/send-mail/send-mail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { UserLogsComponent } from './user-logs/user-logs.component';
import { DatePipe } from '@angular/common';
import { SystemErrorsComponent } from './superadmin/system-errors/system-errors.component';
import { StatusChangeComponent } from './superadmin/system-errors/status-change/status-change.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { InstanceDetailsComponent } from './instances/instance-details/instance-details.component';
import { PasswordMatchDirective } from 'app/shared/directives/password-match.directive'
import { PixelKitModule } from 'pixel-kit';
import { ColorPickerModule } from 'ngx-color-picker';
import { FromNowPipe } from './shared/pipes/from-now.pipe';
import { Title }  from '@angular/platform-browser';
import { SubscriptionsComponent } from './superadmin/subscriptions/subscriptions.component';
import { AddSubscriptionComponent } from './dialogs/add-subscription/add-subscription.component';
import { SharedModule } from './shared/shared.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { UserProfile2Component } from './user-profile2/user-profile2.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { PaginationComponent } from './pagination/pagination.component';



@NgModule({
  declarations: [
    AppComponent,
    InstancesComponent,
    ConfirmdialogComponent,
    SnackbarComponent,
    AddinstanceComponent,
    MenuComponent,
    UsersComponent,
    NumbersOnlyDirective,
    AddUserComponent,
    FeaturesComponent,
    AccessFeaturesComponent,
    SuperadminComponent,
    SettingsComponent,
    EmailControllerComponent,
    CellCustomComponent,
    ShowMessageComponent,
    EmailDetailsComponent,
    SendMailComponent,
    DashboardComponent,
    HeaderComponent,
    UserLogsComponent,
    SystemErrorsComponent,
    StatusChangeComponent,
    UserProfileComponent,
    InstanceDetailsComponent,
    PasswordMatchDirective,
    FromNowPipe,
    SubscriptionsComponent,
    AddSubscriptionComponent,
    AccessDeniedComponent,
    UserProfile2Component,
    PermissionsComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule, 
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    InfiniteScrollModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    NgSelectModule,
    NgMaterialMultilevelMenuModule,
    [FlexLayoutModule],
    AgGridModule.withComponents([]),
    PixelKitModule,
    ColorPickerModule,
    SharedModule

  ],
  entryComponents: [
    ConfirmdialogComponent,
    SnackbarComponent,
    AddinstanceComponent,
    AddUserComponent,
    CellCustomComponent,
    ShowMessageComponent,
    SendMailComponent,
    StatusChangeComponent,
    AddSubscriptionComponent
  ],
  providers: [DatePipe,Title,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
