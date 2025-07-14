import { Component, OnInit } from '@angular/core';
import { Shift } from '../../model/shift.model';
import { Schedule } from '../../model/schedule.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReservationPopupComponent } from './reservation_popup/reservation_popup.component';
import { ScheduleService } from '../../service/schedule.service';
import { AuthenticationService } from '../../service/authentication.service';
import { MessageComponent } from '../../common/message/message.component';
import { MyResponse } from '../../model/myresponse.model';
import { Utils } from '../../utils/utils';
import {
  Codes,
  Strings,
  CSS_CLASSES,
  DAYS_NAME,
  MONTHS_NAME,
  TIME_ZONES,
  ASSETS,
} from '../../utils/resources';
import { NgStyle } from '@angular/common';
import { SpinnerService } from '../../common/spinner/spinner.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-reserve',
    templateUrl: './reserve.component.html',
    styleUrls: ['./reserve.component.scss'],
    standalone: false
})
export class ReserveComponent implements OnInit {
  schedule: Schedule;
  arrayShiefts: Array<Shift[]> = new Array<Shift[]>();
  date: string;
  startHour: string;
  class: string;
  startDateFormatted: string;
  endDateFormatted: string = 'domingo';

  constructor(
    public dialog: MatDialog,
    private scheduleService: ScheduleService,
    public utils: Utils,
    private spinnerService: SpinnerService
  ) {
    if (!this.utils.isThereALoggedUser()) return;

    var timeZone = new Date().getTimezoneOffset() / 60;
    //console.log("time zone: "+timeZone);

    this.spinnerService.requestStarted();
    this.scheduleService.get(localStorage.getItem('token')).subscribe(
      (mResponse: MyResponse) => {
        console.log(mResponse.toString());

        this.spinnerService.resetSpinner();
        if (mResponse.code == Codes.TOKEN_EXPIRED) {
          this.utils.goToLoginByExpiredToken(mResponse);
        } else {
          this.schedule = mResponse.data as Schedule;
          this.startDateFormatted = utils.dateFormat(
            new Date(this.schedule.startDate)
          );
          this.endDateFormatted = utils.dateFormat(
            new Date(this.schedule.endDate)
          );
          var pWeekDescription = `◉ Reservaciones del ${this.startDateFormatted} al ${this.endDateFormatted}`;
          document.getElementById('weekRange').innerHTML = pWeekDescription;

          this.arrayShiefts = this.schedule.shifts;
          this.arrayShiefts.forEach(function (shifts) {
            //Busco si algun espacio ha sido reservado por el usuario actual o si tiene 0 espacios
            shifts.forEach(function (shift) {
              shift.clients.forEach(function (client) {
                if (String(client.id) == localStorage.getItem('user_id')) {
                  shift.cssClass = 'cell_reserved';
                }
              });
              if (shift.availableSpace == 0) {
                shift.cssClass = 'expired_cell';
              }
            });

            //Checks if the space has expired
            shifts.forEach(function (shift) {
              if (utils.isExpiredShift(shift)) {
                shift.cssClass = 'expired_cell';
              }
            });
          }); //end busqueda
        } //else
      },
      (error: HttpErrorResponse) => {
        //Error callback
        console.log(error.message);
        this.spinnerService.resetSpinner();
        this.utils.showErrorMessage();
      }
    );
  }

  ngOnInit(): void {}

  //Cuando hago click en un espacio
  openDialog(date: string, startHour: string, endHour: string) {
    const space = document.getElementById(date + '_' + startHour); //clicked space
    this.class = space.getAttribute('class'); //get css attribute class

    /**Si la celda tiene el formato estandar, es que aún no ha sido reservada por el usuario, por ende, despliegue
     * el popup preguntando si quiere reservar el espacio. En caso contrario, muestre el popup preguntando si quiere
     * cancelar la reservación
     */
    if (this.class == CSS_CLASSES.STANDARD_CELL)
      this.reserveDate(date, startHour, endHour);
    else if (this.class == CSS_CLASSES.CELL_RESERVED)
      this.cancelDate(date, startHour, endHour);
    else if (this.class == CSS_CLASSES.EXPIRED_CELL) {
      this.dialog.open(MessageComponent, {
        data: {
          title: Strings.EXPIRED_SPACE_TITLE,
          message: Strings.EXPIRED_SPACE_DESC,
          showIcon: ASSETS.INFORM_ICON,
        },
      });
    }
  }

  reserveDate(date: string, startHour: string, endHour: string) {
    this.date = date;
    this.startHour = startHour;

    //Habro un modal
    const dialogRef = this.dialog.open(ReservationPopupComponent, {
      data: {
        method: 'reservate',
        title: 'Reservar',
        message: Strings.RESERVATE_SPACE,
        date: date,
        startHour: startHour,
        endHour: endHour,
        buttonLeftText: 'Reservar',
        buttonRightText: 'Cancelar',
      },
    });

    //Cuando cierro el modal
    dialogRef.afterClosed().subscribe((mResponse: MyResponse) => {
      if (mResponse == null) return;

      //Reservación exitosa
      if (mResponse.isSuccessful) {
        const pHtml = document.getElementById(
          'p_' + this.date + '_' + this.startHour
        ); //elemento <p> que contiene la cantidad disponible de espacios
        var pText = pHtml.innerHTML; //obtengo el texto del elemento <p>. Ej: 5
        var availableSpace = Number(pText); //convierto a entero el texto anterior
        availableSpace = availableSpace - 1; //resto 1 a la cantidad de campos disponibles del espacio. Ej: 4
        pHtml.innerHTML = '' + availableSpace; //setteo el nuevo texto al elemento HTML. Ej: 4

        const space = document.getElementById(this.date + '_' + this.startHour); //obtengo el espacio de la tabla que selccionó el usuario
        space.setAttribute('class', 'cell_reserved'); //cambio el color del espacio

        //Fallo en la reservación
      } else {
        if (mResponse.code == Codes.TOKEN_EXPIRED) {
          this.utils.goToLoginByExpiredToken(mResponse);
          return;
        }
      }
      //Muestro el resultado: Fallo o Éxito
      this.dialog.open(MessageComponent, {
        data: {
          title: mResponse.title,
          message: mResponse.description,
          showIcon: mResponse.isSuccessful
            ? ASSETS.SUCCESS_ICON
            : ASSETS.FAILED_ICON,
        },
      });
    });
  }

  cancelDate(date: string, startHour: string, endHour: string) {
    this.date = date;
    this.startHour = startHour;

    //Habro un modal
    const dialogRef = this.dialog.open(ReservationPopupComponent, {
      data: {
        method: 'cancel',
        title: 'Cancelar reservación',
        message: Strings.CANCEL_RESERVATION,
        date: date,
        startHour: startHour,
        endHour: endHour,
        buttonLeftText: 'Cancelar',
        buttonRightText: 'Omitir',
      },
    });

    //Cuando cierro el modal
    dialogRef.afterClosed().subscribe((mResponse: MyResponse) => {
      if (mResponse == null) return;

      //Cancelación exitosa
      if (mResponse.isSuccessful) {
        const pHtml = document.getElementById(
          'p_' + this.date + '_' + this.startHour
        ); //elemento <p> que contiene la cantidad disponible de espacios
        var pText = pHtml.innerHTML; //obtengo el texto del elemento <p>. Ej: 5
        var availableSpace = Number(pText); //convierto a entero el texto anterior
        availableSpace = availableSpace + 1; //resto 1 a la cantidad de campos disponibles del espacio. Ej: 4
        pHtml.innerHTML = '' + availableSpace; //setteo el nuevo texto al elemento HTML. Ej: 4

        const space = document.getElementById(this.date + '_' + this.startHour); //obtengo el espacio de la tabla que selccionó el usuario
        space.setAttribute('class', 'cell'); //cambio el color del espacio

        //Fallo en la reservación
      } else {
        if (mResponse.code == Codes.TOKEN_EXPIRED) {
          this.utils.goToLoginByExpiredToken(mResponse);
          return;
        }
      }

      //Muestro el resultado: Fallo o Éxito
      this.dialog.open(MessageComponent, {
        data: {
          title: mResponse.title,
          message: mResponse.description,
          showIcon: mResponse.isSuccessful
            ? ASSETS.SUCCESS_ICON
            : ASSETS.FAILED_ICON,
        },
      });
    });
  }
}
