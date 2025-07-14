import { Injectable, Inject, EventEmitter} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from '../model/schedule.model';
import { Reservation } from '../model/reservation.model';
import { environment } from '../../environments/environment';
import { environment_variables } from "src/environments/environment.variables";

@Injectable()
export class ReserveService {

  private url = `${environment.url}/reservation`;

  constructor(private http: HttpClient) {}

  make(reservation: Reservation, headers, userId: number){
    let header = new HttpHeaders().set(
      "Authorization",
      headers
    );
    return this.http.post(this.url+'/make?userId='+userId, reservation, {headers:header});
  }


  cancel(reservation: Reservation, headers, userId: number){
    let header = new HttpHeaders().set(
      "Authorization",
      headers
    );
    return this.http.post(this.url+'/cancel?userId='+userId, reservation, {headers:header});
  }



}