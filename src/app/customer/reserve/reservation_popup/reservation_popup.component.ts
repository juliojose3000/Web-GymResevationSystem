import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReserveService } from '../../../service/reserve.service';
import { User } from '../../../model/user.model';
import { Reservation } from '../../../model/reservation.model';
import { MyResponse } from '../../../model/myresponse.model';
import { DAYS_NAME, MONTHS_NAME } from '../../../utils/resources';
import { SpinnerService } from '../../../common/spinner/spinner.service';
import { Utils } from '../../../utils/utils';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'reservation_popup-component',
    templateUrl: './reservation_popup.component.html',
    styleUrls: ['./reservation_popup.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
    ]
})
export class ReservationPopupComponent implements OnInit {

    title: string;
    date: Date;
    dateString: string;
    startHour: string;
    endHour: string;
    reservation: Reservation;
    dateToShow: string;
    buttonLeftText: string;
    buttonRightText: string;
    method: string;
    message: string;


    constructor(
        public dialogRef: MatDialogRef<ReservationPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private reserveService: ReserveService,
        private spinnerService: SpinnerService,
        public utils: Utils,
        public datepipe: DatePipe) {
    }

    ngOnInit(): void {

        this.title = this.data.title;
        this.message = this.data.message;

        this.date = new Date(this.data.date);
        this.dateToShow = this.utils.dateFormat(this.date);
        this.dateString = this.datepipe.transform(this.date, 'yyyy-MM-dd');

        this.startHour = this.data.startHour;
        this.endHour = this.data.endHour;
        this.buttonLeftText = this.data.buttonLeftText;
        this.buttonRightText = this.data.buttonRightText;
        this.method = this.data.method;

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submit() {
        this.reservation = new Reservation(this.dateString, this.startHour, this.endHour);
        this.spinnerService.requestStarted();
        console.log(this.reservation.toString());
        if (this.method == "reservate")
            this.reserveService.make(this.reservation, localStorage.getItem('token'), this.utils.getUserId()).toPromise().then((mResponse: MyResponse) => {
                this.closeDialog(mResponse);
            }, () => { this.onError(); });

        else if (this.method == "cancel")
            this.reserveService.cancel(this.reservation, localStorage.getItem('token'), this.utils.getUserId()).toPromise().then((mResponse: MyResponse) => {
                this.closeDialog(mResponse);
            }, () => { this.onError(); });

    }

    onError() {
        this.spinnerService.resetSpinner();//hide loader
        this.utils.showErrorMessage();//show error message
        this.dimissDialog();//close popup
    }

    closeDialog(mResponse: MyResponse) {
        this.spinnerService.resetSpinner();
        this.dialogRef.close({
            code: mResponse.code,
            isSuccessful: mResponse.isSuccessful,
            title: mResponse.title,
            description: mResponse.description
        });
    }

    dimissDialog() {
        this.dialogRef.close();
    }


}
