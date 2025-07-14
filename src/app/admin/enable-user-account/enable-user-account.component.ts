import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MyResponse } from '../../model/myresponse.model';
import { UserService } from '../../service/user.service';
import { SpinnerService } from '../../common/spinner/spinner.service';
import { Utils } from '../../utils/utils';

@Component({
    selector: 'app-enable-user-account',
    templateUrl: './enable-user-account.component.html',
    styleUrls: ['./enable-user-account.component.scss'],
    standalone: false
})
export class EnableUserAccountComponent implements OnInit {

  responseDescription: string;
  userEmail: string;
  name: string;
  phone: string;

  constructor(
    private userService: UserService,
    private spinnerService: SpinnerService,
    private utils: Utils,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.userEmail = params.userEmail;
        this.name = params.name;
        this.phone = params.phone;
      });

    this.spinnerService.requestStarted();
    this.userService.enableUserAccount(this.userEmail, true).subscribe((mResponse: MyResponse) => {
      this.spinnerService.resetSpinner();
      if (mResponse.isSuccessful) {
        document.getElementById("divSuccess").setAttribute("class", "display_div");
      } else {
        document.getElementById("divError").setAttribute("class", "display_div");
        this.responseDescription = mResponse.description;
      }


    },
      (error: HttpErrorResponse) => {//Error callback
        console.log(error.message);
        this.spinnerService.resetSpinner();
        this.utils.showErrorMessage();
      });

  }

}
