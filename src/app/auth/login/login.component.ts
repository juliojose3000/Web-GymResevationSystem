import { Component, OnInit } from '@angular/core';
import { Authentication } from '../../model/authentication.model';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { Token } from '../../model/token.model';
import { AuthenticationService } from '../../service/authentication.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MyResponse } from '../../model/myresponse.model';
import { MessageComponent } from '../../common/message/message.component';
import { MatDialog } from '@angular/material/dialog';
import { ASSETS, Codes, CSS_CLASSES, Strings } from '../../utils/resources';
import { SpinnerService } from '../../common/spinner/spinner.service';
import { Utils } from '../../utils/utils';
import { HeaderComponent } from '../../common/header/header.component';
import { environment_variables } from 'src/environments/environment.variables';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { HttpErrorResponse } from '@angular/common/http';
import { EnterPhoneNumberPopupComponent } from './enter-phone-number-popup/enter-phone-number-popup.component';
import { Subscription } from 'rxjs';
import { UserRoleEnum } from '../../model/enums/user-role.enum';
import { SocialUser } from '@abacritt/angularx-social-login';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
      FormsModule,
      MatIconModule
    ] 
})
export class LoginComponent implements OnInit {
  //For Sign Up
  public name: string;
  public phone: number;
  public email: string;
  public password: string;

  //For Sign In
  public login_email: string;
  public login_password: string;
  public hidePassword: boolean = true;

  private auth: Authentication;
  private user: User;
  private social_user: SocialUser;
  private detailRecivedSubscription: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private utils: Utils,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    if (environment_variables.quickpass) {
      this.login_email = environment_variables.email;
      this.login_password = environment_variables.password;

      this.email = environment_variables.email;
      this.name = environment_variables.name;
      this.phone = environment_variables.phone;
      this.password = environment_variables.password;
    }

    this.codigojs();
  }

  codigojs() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');

    const pSignUpButton = document.getElementById('pSignUp');
    const pSignInButton = document.getElementById('pSignIn');

    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });

    pSignUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });

    pSignInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });
  }

  hidePasswordFunction() {
    this.hidePassword = !this.hidePassword;
  }

  login() {
    console.log('LoginComponent - Login Method starts...');
    if (!this.haveUserFillTheInputs('sign_in')) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.SIGN_IN_NULL_SPACES,
          showIcon: ASSETS.FAILED_ICON,
        },
      });
      return;
    }

    this.auth = new Authentication(this.login_email, this.login_password);
    this.spinnerService.requestStarted();
    this.authService.authenticate(this.auth).subscribe(
      (mResponse: MyResponse) => {
        this.spinnerService.resetSpinner();
        if (mResponse.isSuccessful) {
          this.loginSuccesful(mResponse, false);
        } else {
          //Invalid credentials
          this.dialog.open(MessageComponent, {
            data: {
              title: mResponse.title,
              message: mResponse.description,
              showIcon: mResponse.isSuccessful
                ? ASSETS.SUCCESS_ICON
                : ASSETS.FAILED_ICON,
            },
          });
        }
      },
      (error: HttpErrorResponse) => {
        //Error callback
        console.log('LoginComponent - LoginMethod Error: ' + error.message);
        this.spinnerService.resetSpinner();
        this.utils.showErrorMessage();
      }
    );
  } // login

  signUp() {
    if (!this.haveUserFillTheInputs('sign_up')) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.SIGN_UP_NULL_SPACES,
          showIcon: ASSETS.FAILED_ICON,
        },
      });
      return;
    }

    if (!this.utils.checkPasswordStrength(this.password)) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.IT_IS_NOT_A_STRONG_PASSWORD,
          showIcon: ASSETS.FAILED_ICON,
        },
      });
      return;
    }

    if (!this.utils.validateEmail(this.email)) {
      // If the email enters is not valid
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.IT_IS_NOT_A_VALID_EMAIL,
          showIcon: ASSETS.FAILED_ICON,
        },
      });
      return;
    }

    if (!this.utils.isAValidPhoneNumber(this.phone)) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.IT_IS_NOT_A_VALID_PHONE,
          showIcon: ASSETS.FAILED_ICON,
        },
      });
      return;
    }

    this.user = new User(
      0,
      this.email,
      this.name,
      this.phone.toString(),
      this.password,
      false,
      UserRoleEnum.CUSTOMER
    );

    this.spinnerService.requestStarted();
    this.userService.create(this.user).subscribe(
      (mResponse: MyResponse) => {
        this.spinnerService.resetSpinner();
        this.dialog
          .open(MessageComponent, {
            data: {
              title: mResponse.title,
              message: mResponse.description,
              showIcon: mResponse.isSuccessful
                ? ASSETS.SUCCESS_ICON
                : ASSETS.FAILED_ICON,
            },
          })
          .afterClosed()
          .subscribe(() => {
            if (mResponse.isSuccessful) {
              this.loginSuccesful(mResponse, false);
            }
          });
      },
      (error) => {
        //Error callback
        this.spinnerService.resetSpinner();
        this.utils.showErrorMessage();
      }
    );
  }

  haveUserFillTheInputs(action: string) {
    if (action == 'sign_in') {
      if (
        this.utils.isNotEmpty(this.login_email) &&
        this.utils.isNotEmpty(this.login_password)
      )
        return true;
      else return false;
    } else if (action == 'sign_up') {
      if (
        this.utils.isNotEmpty(this.email) &&
        this.utils.isNotEmpty(this.password) &&
        this.utils.isNotEmpty(this.phone.toString()) &&
        this.utils.isNotEmpty(this.name)
      )
        return true;
      else return false;
    }
  }

  signInWithGoogle(): void {
    console.log('signInWithGoogle');

    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data) => {
        console.log(data);
        localStorage.setItem('LoginProvider', GoogleLoginProvider.PROVIDER_ID);
        this.socialSignInStartService();
      })
      .catch((error) => {
        console.log(error); //If user close the authentication window, it enters to catch
      });
  }

  signInWithFB(): void {
    console.log('signInWithFB');
    this.socialAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((data) => {
        console.log(data);
        localStorage.setItem(
          'LoginProvider',
          FacebookLoginProvider.PROVIDER_ID
        );
        this.socialSignInStartService();
      })
      .catch((error) => {
        console.log(error); //If user close the authentication window, it enters to catch
      });
  }

  socialSignInStartService() {
    console.log('socialSignInStartService');
    this.detailRecivedSubscription = this.socialAuthService.authState.subscribe(
      (socialUser) => {
        if (this.social_user == undefined || this.social_user != socialUser) {
          this.social_user = socialUser;
          this.user = new User();
          this.user.email = this.social_user.email;
          this.user.name = this.social_user.name;
          this.user.role = UserRoleEnum.CUSTOMER;

          this.spinnerService.requestStarted();
          this.userService.userExists(this.user.email).subscribe(
            (mResponse: MyResponse) => {
              this.spinnerService.resetSpinner();
              if (mResponse.code == Codes.USER_EMAIL_DOES_NOT_EXISTS) {
                this.dialog
                  .open(EnterPhoneNumberPopupComponent)
                  .afterClosed()
                  .subscribe((data) => {
                    if (data == undefined) return; //this means the user clicks on cancel button
                    this.user.phoneNumber = data.phoneNumber;
                    this.socialSignIn(this.user);
                  });
              } else {
                this.socialSignIn(this.user);
              }
            },
            (error) => {
              console.log(error.message);
              this.spinnerService.resetSpinner();
              this.utils.showErrorMessage();
              if (this.detailRecivedSubscription != undefined)
                this.detailRecivedSubscription.unsubscribe();
            }
          );
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.detailRecivedSubscription != undefined)
      this.detailRecivedSubscription.unsubscribe();
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  socialSignIn(user: User) {
    console.log('socialSignIn');
    //return;
    this.user = user;
    this.spinnerService.requestStarted();
    this.userService.social_login(this.user).subscribe(
      (mResponse: MyResponse) => {
        console.log(mResponse);
        this.spinnerService.resetSpinner();

        //Para Registro
        if (mResponse.code == Codes.SOCIAL_USER_CREATED_SUCCESSFUL) {
          this.dialog
            .open(MessageComponent, {
              data: {
                title: mResponse.title,
                message: mResponse.description,
                showIcon: mResponse.isSuccessful
                  ? ASSETS.SUCCESS_ICON
                  : ASSETS.FAILED_ICON,
              },
            })
            .afterClosed()
            .subscribe(() => {
              if (mResponse.isSuccessful) {
                this.loginSuccesful(mResponse, true);
                return;
              }
            });
        }

        //Para login
        if (Codes.USER_CREATED_SUCCESSFUL) {
          this.loginSuccesful(mResponse, true);
        } else {
          this.dialog.open(MessageComponent, {
            data: {
              title: mResponse.title,
              message: mResponse.description,
              showIcon: mResponse.isSuccessful
                ? ASSETS.SUCCESS_ICON
                : ASSETS.FAILED_ICON,
            },
          });
        }
      },
      (error) => {
        //Error callback
        console.log(error.message);
        this.spinnerService.resetSpinner();
        this.utils.showErrorMessage();
      }
    );
  }

  loginSuccesful(mResponse: MyResponse, isSocialLogin: boolean) {
    this.utils.saveUserSessionData(mResponse, isSocialLogin);
    this.router.navigate(['home']);
    document.getElementById('a_session').innerHTML = Strings.LOGOUT;
    Array.from(document.getElementsByClassName('btn_session')).forEach(
      (element) => {
        element.innerHTML = Strings.MY_ACCOUNT;
      }
    );
    document.getElementById('div_my_account_features').style.display = 'block';

    if (localStorage.getItem('user_role') == UserRoleEnum.ADMIN.toString()) {
      document.getElementById('div_admin_features').style.display = 'block';
    }
  }

  goToPasswordForgotten() {
    this.router.navigate(['password_forgotten']);
  }

  showPassword(inputId: string, eyeIconId: string) {
    this.utils.showPassword(inputId, eyeIconId);
  }
}
