import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DAYS_NAME, MONTHS_NAME } from 'src/app/utils/resources';
import { User } from 'src/app/model/user.model';
import { Utils } from 'src/app/utils/utils';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'see-user-reservations.modal-component',
    templateUrl: './see-user-reservations.modal.component.html',
    styleUrls: ['./see-user-reservations.modal.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
    ]
})
export class SeeUserReservationsModal implements OnInit {

    public customerSelected: User;

    constructor(
        public dialogRef: MatDialogRef<SeeUserReservationsModal>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public utils: Utils) {
        this.customerSelected = data.customer;
    }

    ngOnInit(): void {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    dimissDialog() {
        this.dialogRef.close();
    }





}
