import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageComponent } from '../common/message/message.component';
import { PopupComponent } from '../common/popup/popup.component';
import { MyResponse } from '../model/myresponse.model';
import { Shift } from '../model/shift.model';
import { User } from '../model/user.model';
import { ASSETS, DAYS_NAME, MONTHS_NAME, Strings } from './resources';
import $ from 'jquery'; //in the component

@Injectable()
export class Utils {
  public is_a_social_login: boolean;

  isAStrongPassword: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public datepipe: DatePipe
  ) {}

  ngOnInit() {}

  goToLoginByExpiredToken(mResponse: MyResponse) {
    localStorage.setItem('token', null);
    document.getElementById('btn_session').innerHTML = Strings.LOGIN;

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
      .subscribe((result) => {
        this.router.navigate(['login']);
      });
  }

  showErrorMessage() {
    this.dialog.open(MessageComponent, {
      data: {
        title: Strings.ERROR,
        message: Strings.ERROR_DESCRIPTION,
        showIcon: ASSETS.FAILED_ICON,
      },
    });
  }

  showErrorMessageWithDescription(description: string) {
    this.dialog.open(MessageComponent, {
      data: {
        title: Strings.ERROR,
        message: description,
        showIcon: ASSETS.FAILED_ICON,
      },
    });
  }

  dateFormat(date: string | Date): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
      return 'Fecha inválida';
    }

    const dateFormatted = this.datepipe
      .transform(parsedDate, 'E dd MMM yyyy')
      ?.split(' ');

    if (!dateFormatted || dateFormatted.length < 3) {
      return 'Fecha inválida';
    }

    const dayNumber = Number(dateFormatted[1]);

    return `${DAYS_NAME[dateFormatted[0]]} ${dayNumber} de ${
      MONTHS_NAME[dateFormatted[2]]
    }`;
  }

  isExpiredShift(shift: Shift) {
    var dateString = this.datepipe.transform(shift.date, 'yyyy-MM-dd');
    var date_time = dateString + ' ' + shift.startHour;
    var shiftDateTime = new Date(date_time);
    var currentDateTime = new Date();
    return currentDateTime > shiftDateTime;
  }

  isThereALoggedUser(): boolean {
    if (
      localStorage.getItem('token') == 'null' ||
      localStorage.getItem('token') == null
    ) {
      this.dialog.open(PopupComponent, {
        data: {
          title: Strings.LOGIN,
          message: Strings.MAKE_LOGIN,
          buttonLeftText: Strings.ACCEPT,
          buttonRightText: Strings.CANCEL,
          callBack: () => {
            this.router.navigate(['login']);
            this.dialog.closeAll();
          },
        },
      });
      return false;
    } else {
      return true;
    }
  }

  getFirstWordFromString(name: string) {
    var firstWord = name.replace(/ .*/, '');
    return firstWord;
  }

  //This method returns the brower's width
  getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }

  //This method returns the brower's height
  getHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  }

  validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  checkPasswordStrength(password: string): boolean {
    //if textBox is empty
    if (password == '') {
      return;
    }

    //Regular Expressions
    var regex = new Array();
    regex.push('[A-Z]'); //For Uppercase Alphabet
    regex.push('[a-z]'); //For Lowercase Alphabet
    regex.push('[0-9]'); //For Numeric Digits
    regex.push('[$@$!%*#?&]'); //For Special Characters

    var passed = 0;

    //Validation for each Regular Expression
    for (var i = 0; i < regex.length; i++) {
      if (new RegExp(regex[i]).test(password)) {
        passed++;
      }
    }

    //Validation for Length of Password
    if (passed > 2 && password.length > 8) {
      passed++;
    }

    //Display of Status
    var color = '';
    var passwordStrength = '';
    switch (passed) {
      case 0:
      case 1:
        passwordStrength = 'Password is Weak.';
        this.isAStrongPassword = false;
        color = 'Red';
        break;

      case 2:
      case 3:
        passwordStrength = 'Password is Good.';
        this.isAStrongPassword = true;
        color = 'yellow';
        break;

      case 4:
      case 5:
        this.isAStrongPassword = true;
        passwordStrength = 'Password is Strong.';
        color = 'Green';
        break;
    }

    return this.isAStrongPassword;
  }

  isAValidPhoneNumber(phone: number): boolean {
    return new String(phone).length == 8 && /^\d+$/.test(phone.toString());
  }

  getUserId(): number {
    return localStorage.getItem('user_id') as unknown as number;
  }

  getUserEmail(): string {
    return localStorage.getItem('email');
  }

  getUserRole(): number {
    return parseInt(localStorage.getItem('user_role'));
  }

  isUserEnabled(): boolean {
    return localStorage.getItem('is_enable') == 'true' ? true : false;
  }

  saveUserSessionData(mResponse: MyResponse, isSocialLogin: boolean) {
    const user = mResponse.data as User;
    console.log(user);
    localStorage.setItem('token', 'Bearer ' + mResponse.token);
    localStorage.setItem('email', user.email);
    localStorage.setItem('user_id', '' + user.id);
    localStorage.setItem('user_name', '' + user.name);
    localStorage.setItem('user_phoneNumber', user.phoneNumber.replace('-', ''));
    localStorage.setItem('user_role', user.role.toString());
    localStorage.setItem('is_enabled', user.isEnabled ? 'true' : 'false');
    localStorage.setItem('is_social_login', isSocialLogin ? 'true' : 'false');
  }

  updateUserSessionData(mResponse: MyResponse) {
    const user = mResponse.data as User;
    console.log(user);
    localStorage.setItem('email', user.email);
    localStorage.setItem('user_id', '' + user.id);
    localStorage.setItem('user_name', '' + user.name);
    localStorage.setItem('user_phoneNumber', user.phoneNumber.replace('-', ''));
    localStorage.setItem('user_role', user.role.toString());
    localStorage.setItem('is_enabled', user.isEnabled ? 'true' : 'false');
  }

  showPassword(inputId: string, eyeIconId: string) {
    var inputType = document.getElementById(inputId).getAttribute('type');
    var eyeClass;

    if (inputType == 'password') {
      document.getElementById(inputId).setAttribute('type', 'text');
      eyeClass = 'fa fa-eye';
    } else {
      document.getElementById(inputId).setAttribute('type', 'password');
      eyeClass = 'fa fa-eye-slash';
    }

    document.getElementById(eyeIconId).setAttribute('class', eyeClass);
  }

  formatAMPM(time) {
    var hours = time.split(':')[0];
    var minutes = time.split(':')[1];
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  getHttpHeader() {
    return new HttpHeaders().set(
      'Authorization',
      localStorage.getItem('token')
    );
  }

  isEmpty(value) {
    return value == null || value == undefined || value == '';
  }

  isNotEmpty(value: string) {
    return value != null && value != undefined && value != '';
  }

  /* Este método retorna la altura de la porsión que está siendo mostrada de un elemento específico 
    tomado de: https://stackoverflow.com/questions/24768795/get-the-visible-height-of-a-div-with-jquery
    */
  getVisibleHeight(elementId): number {
    var elementHeight = $(`#${elementId}`).outerHeight(),
      screenHeight = $(window).height(),
      r = $(`#${elementId}`)[0].getBoundingClientRect(),
      t = r.top,
      b = r.bottom;
    let heightVisible = Math.max(
      0,
      t > 0
        ? Math.min(elementHeight, screenHeight - t)
        : Math.min(b, screenHeight)
    );
    return heightVisible;
  }

  //-------------------------------- SWIPE EVENT SENCTION ---------------------------//

  xDown = null;
  yDown = null;

  getTouches(evt) {
    return (
      evt.touches || // browser API
      evt.originalEvent.touches
    ); // jQuery
  }

  handleTouchStart(evt) {
    const firstTouch = this.getTouches(evt)[0];
    this.xDown = firstTouch.clientX;
    this.yDown = firstTouch.clientY;
  }

  handleTouchMove(evt, setSideMenuStatus: Function) {
    if (!this.xDown || !this.yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = this.xDown - xUp;
    var yDiff = this.yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 8) { //Default value is 0, however with the most insignificant movement on screen, side menu is showed
        /* right swipe | Hide side menu */
        setSideMenuStatus(false);
      } else if (xDiff < -8) {
        /* left swipe | Show side menu */
        setSideMenuStatus(true);
      }
    } else {
      if (yDiff > 0) {
        /* down swipe */
      } else {
        /* up swipe */
      }
    }
    /* reset values */
    this.xDown = null;
    this.yDown = null;
  }

  //-------------------------------------------------------------------//
}
