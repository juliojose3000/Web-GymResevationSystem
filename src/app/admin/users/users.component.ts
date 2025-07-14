import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRoleEnum } from 'src/app/model/enums/user-role.enum';
import { MyResponse } from 'src/app/model/myresponse.model';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/service/user.service';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { Utils } from 'src/app/utils/utils';
import { SeeUserReservationsModal } from './see-user-reservations-modal/see-user-reservations.modal.component';
import { EnableDisableUserModal } from './enable-disable-user-modal/enable-disable-user.modal.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    standalone: false
})
export class UsersComponent implements OnInit {

  public customers: Array<User>;
  public searchedCustomers: Array<User>;

  constructor(
    private userService: UserService,
    private utils: Utils,
    private spinnerService: SpinnerService,
    public dialog: MatDialog) {


    this.spinnerService.requestStarted();
    this.userService.getAll().subscribe((mResponse: MyResponse) => {
      console.log(mResponse);
      this.spinnerService.resetSpinner();
      this.customers = mResponse.data as Array<User>;
      this.searchedCustomers = this.customers;
    },
      (error: HttpErrorResponse) => {//Error callback
        console.log(error.message);
        this.spinnerService.resetSpinner();
        this.utils.showErrorMessage()
      });


  }

  ngOnInit(): void {
  }

  getRoleByCode(code) {
    switch (code) {
      case UserRoleEnum.ADMIN:
        return "Administrador";
      case UserRoleEnum.CUSTOMER:
        return "Cliente";
    }
  }

  seeUserReservations(customerId) {
    let customerSelected;
    this.customers.forEach(customer => {
      if (customer.id == customerId) {
        customerSelected = customer;
      }
    });

    //Habro un modal
    this.dialog.open(SeeUserReservationsModal, {
      data: {
        customer: customerSelected
      }
    });

  }

  isUserEnabled(isEnabled: boolean) {
    return isEnabled ? "Deshabilitar" : "Habilitar";
  }

  activateOrInactivateUser(customerId: number) {
    let customerSelected = new User();
    this.customers.forEach(customer => {
      if (customer.id == customerId) {
        customerSelected = customer;
      }
    });

    //Habro un modal
    this.dialog.open(EnableDisableUserModal, {
      data: {
        customer: customerSelected
      }
    }).afterClosed().subscribe((data) => {
      if(data == null) return;
      let mResponse = data.mResponse;
      if (mResponse.isSuccessful) {
        this.customers.forEach(customer => {
          if (customer.id == customerSelected.id) {
            customer.isEnabled = !customerSelected.isEnabled;
            this.onKeyListener();
          }
        });

      } else {
        this.utils.showErrorMessageWithDescription(mResponse.description);
      }
    });
  }

  onKeyListener() {
    this.searchedCustomers = new Array<User>();
    const textToSearch = document.getElementById("searchBar") as HTMLInputElement;

    this.customers.forEach(customer => {
      if (this.doesCustomerHaveThisValue(textToSearch.value, customer)) {
        this.searchedCustomers.push(customer);
      }
    });
  }

  public doesCustomerHaveThisValue(value: string, customer: User): boolean {
    if (customer.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
      customer.phoneNumber.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
      customer.email.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

}
