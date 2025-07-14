import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageComponent } from '../../common/message/message.component';
import { MyResponse } from '../../model/myresponse.model';
import { User } from '../../model/user.model';
import { ASSETS, CSS_CLASSES, Strings } from '../../utils/resources';
import { UserService } from '../../service/user.service';
import { SpinnerService } from '../../common/spinner/spinner.service';
import { Utils } from '../../utils/utils';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    standalone: true,
    imports: [FormsModule, MatIconModule]
})
export class UserProfileComponent implements OnInit {
  public name: string;
  public phone: number;
  public email: string;
  public password: string;
  public newPassword: string;
  public hidePassword: boolean = true;
  public hideNewPassword: boolean = true;

  private user: User;

  constructor(
    private utils: Utils,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('user_name');
    this.email = localStorage.getItem('email');

    if (localStorage.getItem('user_phoneNumber') == 'Not Registered') {
      document
        .getElementById('phone_input')
        .setAttribute('placeholder', 'No registrado');
    } else {
      this.phone = parseInt(localStorage.getItem('user_phoneNumber'));
    }
  }

  updateUserProfile() {
    if (!this.haveUserFillTheInputs()) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.SIGN_UP_NULL_SPACES,
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

    if (
      this.utils.isNotEmpty(this.newPassword) &&
      !this.utils.checkPasswordStrength(this.newPassword)
    ) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.IT_IS_NOT_A_STRONG_NEW_PASSWORD,
          showIcon: ASSETS.FAILED_ICON,
        },
      });
      return;
    }

    if (this.utils.isEmpty(this.password)) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.PASSWORD_NEEDED,
          showIcon: ASSETS.FAILED_ICON,
        },
      });
      return;
    }

    this.user = new User(
      this.utils.getUserId(),
      this.email,
      this.name,
      this.phone.toString(),
      this.password,
      this.utils.isUserEnabled(),
      this.utils.getUserRole()
    );

    this.spinnerService.requestStarted();
    this.userService.updateProfile(this.user, this.newPassword).subscribe(
      (mResponse: MyResponse) => {
        this.spinnerService.resetSpinner();
        if (mResponse.isSuccessful) this.utils.updateUserSessionData(mResponse);
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
              this.router.navigate(['home']);
            }
          });
      },
      (error: HttpErrorResponse) => {
        //Error callback
        this.spinnerService.resetSpinner();
        this.utils.showErrorMessage();
        console.log(error.message);
      }
    );
  }

  haveUserFillTheInputs(): boolean {
    if (
      this.utils.isNotEmpty(this.email) &&
      this.utils.isNotEmpty(this.phone.toString()) &&
      this.utils.isNotEmpty(this.name)
    )
      return true;
    else return false;
  }

  hidePasswordFunction() {
    this.hidePassword = !this.hidePassword;
  }

  hideNewPasswordFunction() {
    this.hideNewPassword = !this.hideNewPassword;
  }
}
