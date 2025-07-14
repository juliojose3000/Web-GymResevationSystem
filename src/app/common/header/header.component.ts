import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';
import { UserRoleEnum } from '../../model/enums/user-role.enum';
import { PopupComponent } from '../popup/popup.component';
import { Codes, Strings } from '../../utils/resources';
import { Utils } from '../../utils/utils';
import { SocialAuthService } from 'angularx-social-login';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {

  sessionText: string;

  constructor(private router: Router, public dialog: MatDialog, public utils: Utils, public adminGuard: AdminGuard, private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {

    const session = document.getElementById("a_session");

    if (localStorage.getItem('token') != 'null' && localStorage.getItem('token') != null) {//There is an active session
      this.sessionText = Strings.MY_ACCOUNT;
      session.innerHTML = Strings.LOGOUT;
      document.getElementById("div_my_account_features").style.display = "block";
    } else {
      document.getElementById("div_my_account_features").style.display = "none";
      this.sessionText = Strings.LOGIN;
    }

    //Check is the user is admin
    if (localStorage.getItem('user_role') == null || localStorage.getItem('user_role') != UserRoleEnum.ADMIN.toString()) {
      document.getElementById("div_admin_features").style.display = "none";
    } else if (localStorage.getItem('user_role') == UserRoleEnum.ADMIN.toString()) {
      document.getElementById("div_admin_features").style.display = "block";
    }

    const self = this;

    //If user clicks outside of side menu, so it will be closed
    document.body.addEventListener("click", function (event) {
      if (!document.getElementById("wrapper").contains(event.target as Node) && self.isSideMenuDisplaying()) {
        self.setSideMenuStatus(false); //Hide menu options
      }
    });

    //If user scrolling the page, the side menu will be closed
    window.onscroll = function () {
      if (self.isSideMenuDisplaying())
        self.setSideMenuStatus(false);
    };

    document.getElementById("show-menu").addEventListener("click", () => { this.setTopPropertyValueInSideMenu(); });

    document.addEventListener('touchstart', (env) => this.utils.handleTouchStart(env), false);
    document.addEventListener('touchmove', (env) => {
      this.setTopPropertyValueInSideMenu()
      this.utils.handleTouchMove(env, this.setSideMenuStatus)
    }, false);

  }

  setTopPropertyValueInSideMenu() {
    if (!this.isSideMenuDisplaying()) return; //If the user hide the menu, it is not necessary to set the top value
    const top = this.utils.getVisibleHeight("wrapper");
    document.getElementById("links").style.top = `${top}px`;
  }


  isSideMenuDisplaying(): boolean {
    return (document.getElementById("show-menu") as HTMLInputElement).checked;
  }

  /**
   * 
   * @param display false = close side menu; true = show side menu
   * @returns 
   */
  setSideMenuStatus(display: boolean) {
    let isSideMenuDisplaying = (document.getElementById("show-menu") as HTMLInputElement).checked;
    if (isSideMenuDisplaying != display) //If the state is the same, so do nothing
      (document.getElementById("show-menu") as HTMLInputElement).checked = display;

  }

  noscroll() {
    window.scrollTo(0, 0);
  }

  logout() {
    this.dialog.open(PopupComponent, {
      data: {
        title: Strings.LOGOUT,
        message: Strings.LOGOUT_MESSAGE,
        buttonLeftText: Strings.BUTTON_LEFT_LOGOUT,
        buttonRightText: Strings.BUTTON_RIGHT_LOGOUT,
        callBack: () => {
          Array.from(document.getElementsByClassName("btn_session")).forEach(element => {
            element.innerHTML = Strings.LOGIN
          });
          document.getElementById("div_my_account_features").style.display = "none";
          if (localStorage.getItem("user_role") == UserRoleEnum.ADMIN.toString())
            document.getElementById("div_admin_features").style.display = "none";
          if (localStorage.getItem("is_social_login") == "true")
            this.socialAuthService.signOut();
          this.router.navigate(['login']);
          localStorage.clear();//clean the local storage
          this.dialog.closeAll();
        }
      }
    });
  }

  onClickEvent(goTo: string) {

    let hideMenu = true;

    switch (goTo) {
      case 'home':
        this.router.navigate(['home']);
        break;
      case 'aboutUs':
        this.router.navigate(['about_us']);
        break;
      case 'seeReservations':
        this.router.navigate(['admin/schedule']);
        break;
      case 'seeUsers':
        this.router.navigate(['admin/users']);
        break;
      case 'weightRoom':
        this.router.navigate(['gym_services/weight_room']);
        break;
      case 'userProfile':
        this.router.navigate(['user_profile']);
        break;
      case 'session':
        if (document.getElementsByName("btn_session")[0].innerHTML == Strings.MY_ACCOUNT) {
          hideMenu = false;
        } else {
          this.router.navigate(['login']);
        }
        break;
    }
    (document.getElementById("show-menu") as HTMLInputElement).checked = !hideMenu; //Hide menu options
  }

}
