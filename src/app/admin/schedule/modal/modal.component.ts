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
    selector: 'modal-component',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
    ]

})
export class ModalComponent implements OnInit {

    date: Date;
    startHour: string;
    customers: string;
    clients: User[];
    endHour: string;


    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public utils: Utils) {
            this.date = new Date(this.data.date);
            this.startHour = this.data.startHour;
            this.endHour = this.data.endHour;
            this.clients = this.data.clients;
    }

    ngOnInit(): void {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    

    dimissDialog(){
        this.dialogRef.close();
    }

}
