import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DAYS_NAME, MONTHS_NAME } from 'src/app/utils/resources';
import { User } from 'src/app/model/user.model';
import { Utils } from 'src/app/utils/utils';
import { UserService } from 'src/app/service/user.service';
import { MyResponse } from 'src/app/model/myresponse.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'enable-disable-user.modal.component',
    templateUrl: './enable-disable-user.modal.component.html',
    styleUrls: ['./enable-disable-user.modal.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
    ]
})
export class EnableDisableUserModal implements OnInit {

    public title: String;
    public description: String;
    public customerSelected: User;

    constructor(
        public dialogRef: MatDialogRef<EnableDisableUserModal>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public userService: UserService,
        public spinnerService: SpinnerService,
        public utils: Utils) {
        this.customerSelected = data.customer;
    }

    ngOnInit(): void {
        if(this.customerSelected.isEnabled){
            this.title = `Deshabilitar la cuenta de ${this.customerSelected.name}`;
            this.description = "Si deshabilitas la cuenta de un cliente, este ya no podrá realizar reservaciones en la página";
        }else{
            this.title = `Habilitar la cuenta de ${this.customerSelected.name}`;
            this.description = "Al habilitar la cuenta de un cliente, este podrá realizar reservaciones en la página";
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    dimissDialog() {
        this.dialogRef.close();
    }

    acceptButtonClick(){
        this.spinnerService.requestStarted();
        this.userService.enableUserAccount(this.customerSelected.email, !this.customerSelected.isEnabled).subscribe((mResponse: MyResponse) => {
          this.spinnerService.resetSpinner();
          this.closeDialog(mResponse);
        },
          (error: HttpErrorResponse) => {//Error callback
            console.log(error.message);
            this.spinnerService.resetSpinner();
            this.utils.showErrorMessage();
          });

    }

    closeDialog(mResponse: MyResponse){
        this.dialogRef.close({ 
            mResponse: mResponse
        });
    }


}
