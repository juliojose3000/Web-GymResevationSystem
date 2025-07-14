import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'popup-component',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    standalone: true
})
export class PopupComponent implements OnInit {

    title: string
    message: string;
    buttonLeftText: string;
    buttonRightText: string;
    code: number;
    callBack: Function;

    constructor(
        public dialogRef: MatDialogRef<PopupComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {
        this.title = this.data.title;
        this.message = this.data.message;
        this.buttonLeftText = this.data.buttonLeftText;
        this.buttonRightText = this.data.buttonRightText;
        this.callBack = this.data.callBack;
    }

    dimissDialog(){
        this.dialogRef.close({});
    }


}
