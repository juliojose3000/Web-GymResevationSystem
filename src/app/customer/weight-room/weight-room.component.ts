import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Utils } from '../../utils/utils';

@Component({
    selector: 'app-weight-room',
    templateUrl: './weight-room.component.html',
    styleUrls: ['./weight-room.component.scss'],
    standalone: false
})
export class WeightRoomComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog, public utils: Utils) { }

  ngOnInit(): void {
  }

  showSchedule(){
    if(!this.utils.isThereALoggedUser()) return;
    this.router.navigate(['reserve']);
  }

}
