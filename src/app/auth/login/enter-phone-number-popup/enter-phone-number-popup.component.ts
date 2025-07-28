import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReserveService } from '../../../service/reserve.service';
import { User } from '../../../model/user.model';
import { Reservation } from '../../../model/reservation.model';
import { MyResponse } from '../../../model/myresponse.model';
import { ASSETS, DAYS_NAME, MONTHS_NAME, Strings } from '../../../utils/resources';
import { SpinnerService } from '../../../common/spinner/spinner.service';
import { Utils } from '../../../utils/utils';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MessageComponent } from 'src/app/common/message/message.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'enter-phone-number-popup.component',
    templateUrl: './enter-phone-number-popup.component.html',
    styleUrls: ['./enter-phone-number-popup.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule, // ✅ NECESARIO PARA [(ngModel)]
      MatDialogModule,
      MatButtonModule,
    ]
})
export class EnterPhoneNumberPopupComponent implements OnInit {
  phone: number;

  constructor(
    public dialogRef: MatDialogRef<EnterPhoneNumberPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinnerService: SpinnerService,
    public datepipe: DatePipe,
    private utils: Utils,
    public dialog: MatDialog
  ) {
    dialogRef.disableClose = true; //This line disable close dialog when user clicks dialog outside
  }

  ngOnInit(): void {}

  submit() {
    if (!this.utils.isAValidPhoneNumber(this.phone)) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.ERROR,
          message: Strings.IT_IS_NOT_A_VALID_PHONE,
          showIcon: ASSETS.FAILED_ICON,
        },
      });
      return;
    }

    this.spinnerService.resetSpinner();
    this.dialogRef.close({
      phoneNumber: this.phone.toString(),
    });
  }

  dimissDialog() {
    this.phone = undefined;
    this.dialogRef.close();
  }
}
