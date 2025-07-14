import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageComponent } from '../../common/message/message.component';
import { MyResponse } from '../../model/myresponse.model';
import { ResetPassword } from '../../model/reset-password.model';
import { ASSETS, Strings } from '../../utils/resources';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { SpinnerService } from '../../common/spinner/spinner.service';
import { Utils } from '../../utils/utils';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    standalone: true,
    imports: [FormsModule, MatIconModule]
})
export class ResetPasswordComponent implements OnInit {

  email: string;
  password: string;
  passwordConfirmed: string;
  code: string;
  isThePasswordStreght: boolean = false;
  public hidePassword: boolean = true;
  public hideConfirmedPassword: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private spinnerService: SpinnerService,
    public dialog: MatDialog,
    private utils: Utils,
    private router: Router) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      console.log({ code: this.code }); // Print the parameter to the console. 
    });

  }

  ngOnInit(): void { }


  resetPassword(): void {

    if (this.utils.isEmpty(this.email) || this.utils.isEmpty(this.password) || this.utils.isEmpty(this.passwordConfirmed)) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.FILL_INPUTS,
          showIcon: ASSETS.FAILED_ICON,
        }
      });
      return;
    }

    if (!this.utils.validateEmail(this.email)) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.ENTERS_A_VALID_EMAIL,
          showIcon: ASSETS.FAILED_ICON,
        }
      });
      return;
    }

    if (!this.isThePasswordStreght) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.IT_IS_NOT_A_STRONG_PASSWORD,
          showIcon: ASSETS.FAILED_ICON,
        }
      });
      return;
    }

    if (this.password != this.passwordConfirmed) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.PASSWORDS_NEED_TO_BE_EQUALS,
          showIcon: ASSETS.FAILED_ICON,
        }
      });
      return;
    }

    var resetPasswordLink = new ResetPassword(this.email, this.code, this.password);

    this.spinnerService.requestStarted();
    this.userService.resetLink(resetPasswordLink).toPromise().then((mResponse: MyResponse) => {
      this.spinnerService.resetSpinner();
      this.dialog.open(MessageComponent, {
        data: {
          title: mResponse.title,
          message: mResponse.description,
          showIcon: mResponse.isSuccessful
            ? ASSETS.SUCCESS_ICON
            : ASSETS.FAILED_ICON,
        }
      }).afterClosed().subscribe(result => {
        this.router.navigate(['login']);
      });

    }, (mResponse: MyResponse) => {
      this.spinnerService.resetSpinner();
      this.utils.showErrorMessage();
    });

  }

  hidePasswordFunction() {
    this.hidePassword = !this.hidePassword;
  }

  hideConfirmedPasswordFunction() {
    this.hideConfirmedPassword = !this.hideConfirmedPassword;
  }


}
