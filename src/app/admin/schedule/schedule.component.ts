import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyResponse } from 'src/app/model/myresponse.model';
import { Schedule } from 'src/app/model/schedule.model';
import { Shift } from 'src/app/model/shift.model';
import { User } from 'src/app/model/user.model';
import { Codes } from 'src/app/utils/resources';
import { ScheduleService } from 'src/app/service/schedule.service';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { Utils } from 'src/app/utils/utils';
import { ModalComponent } from './modal/modal.component';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss'],
    standalone: false
})
export class ScheduleComponent implements OnInit {

  schedule: Schedule;
  arrayShiefts: Array<Shift[]> = new Array<Shift[]>();
  date: string;
  startHour: string;
  class: string;
  startDateFormatted: string;
  endDateFormatted: string = "domingo";
  clients: User[];


  constructor(
    public dialog: MatDialog,
    private scheduleService: ScheduleService,
    private utils: Utils,
    private spinnerService: SpinnerService) {

    if (!this.utils.isThereALoggedUser()) return;

    this.spinnerService.requestStarted();
    this.scheduleService.get(localStorage.getItem('token')).subscribe((mResponse: MyResponse) => {
      console.log(mResponse);
      this.spinnerService.resetSpinner();
      if (mResponse.code == Codes.TOKEN_EXPIRED) {
        this.utils.goToLoginByExpiredToken(mResponse);
      } else {
        this.schedule = mResponse.data as Schedule;
        this.startDateFormatted = utils.dateFormat(new Date(this.schedule.startDate));
        this.endDateFormatted = utils.dateFormat(new Date(this.schedule.endDate));
        var pWeekDescription = ` ◉ Reservaciones de la semana del ${this.startDateFormatted} al ${this.endDateFormatted}`;
        document.getElementById("pWeekDescription").innerHTML = pWeekDescription;

        this.arrayShiefts = this.schedule.shifts;

        document.getElementById("divWeekDescription").style.display = "block";

      }//else
    },
      (error: HttpErrorResponse) => {//Error callback
        console.log(error.message);
        this.spinnerService.resetSpinner();
        this.utils.showErrorMessage()
      });

  }

  ngOnInit(): void {
  }

  formatAMPM(time) {
    var hours = time.split(":")[0];
    var minutes = time.split(":")[1];
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  //Cuando hago click en un espacio
  openDialog(date: string, startHour: string, endHour: string) {
    const space = document.getElementById(date + "_" + startHour);//clicked space
    this.class = space.getAttribute("class");//get css attribute class
    this.reserveDate(date, startHour, endHour);
  }

  reserveDate(date: string, startHour: string, endHour: string){

    const self = this;
    this.arrayShiefts.forEach(function (shifts) {
      shifts.forEach((shift) => {
        if(shift.date == date && shift.startHour == startHour){
          self.clients = shift.clients;
        }
      });
    });//end busqueda

    //Habro un modal
    this.dialog.open(ModalComponent, {
      data: {
        date: date,
        startHour: startHour,
        clients: this.clients,
        endHour: endHour
      }
    });

  }


}
