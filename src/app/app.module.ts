//Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

//Services
import { ReserveService } from './service/reserve.service';
import { ScheduleService } from './service/schedule.service';
import { UserService } from './service/user.service';
import { AuthenticationService } from './service/authentication.service'
import { SpinnerService } from './common/spinner/spinner.service'

//Components
import { MessageComponent } from './common/message/message.component';
import { LoginComponent } from './auth/login/login.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ReserveComponent } from './customer/reserve/reserve.component';
import { HomeComponent } from './common/home/home.component';
import { ReservationPopupComponent } from './customer/reserve/reservation_popup/reservation_popup.component';
import { SpinnerComponent } from './common/spinner/spinner.component'
import { AboutusComponent } from './common/aboutus/aboutus.component';
import { PopupComponent } from './common/popup/popup.component';
import { EnterPhoneNumberPopupComponent } from './auth/login/enter-phone-number-popup/enter-phone-number-popup.component';

//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

//Others
import { Utils } from './utils/utils';
import { DatePipe } from '@angular/common';

//Social Login
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

//Environments
import { environment } from '../environments/environment';
import { UserProfileComponent } from './customer/user-profile/user-profile.component';
import { PasswordForgottenComponent } from './auth/password-forgotten/password-forgotten.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { environment_variables } from 'src/environments/environment.variables';
import { AdminGuard } from './guards/admin.guard';

@NgModule({
    declarations: [
        AppComponent,
        //Screens components
        ReserveComponent,
        HomeComponent,
        LoginComponent,
        AboutusComponent,
        UserProfileComponent,
        PasswordForgottenComponent,
        ResetPasswordComponent,
        //Static components
        HeaderComponent,
        FooterComponent,
        SpinnerComponent,
        //Popups/Modals Components
        ReservationPopupComponent,
        PopupComponent,
        MessageComponent,
        EnterPhoneNumberPopupComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        SocialLoginModule,
        CommonModule,
        //Material Imports
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatInputModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatIconModule
    ],
    providers: [ScheduleService, ReserveService, UserService, AuthenticationService, Utils, SpinnerService, DatePipe, AdminGuard,
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: true,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(environment_variables.GooglePrividerId),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider(`${environment.fb_id}`),
                    },
                ],
            } as SocialAuthServiceConfig,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
