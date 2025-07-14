import { Injectable, Inject, EventEmitter} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from '../model/schedule.model';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment';
import { environment_variables } from "src/environments/environment.variables";
import { ResetPassword } from "../model/reset-password.model";
import { Utils } from "../utils/utils";

@Injectable()
export class UserService {

  private url = `${environment.url}/user`;

  constructor(private http: HttpClient, private utils: Utils) {}

  create(user: User){
    return this.http.post(this.url+'/create', user);
  }

  social_login(user: User){
    return this.http.post(this.url+'/social-login', user);
  }

  sendLinkResetPassword(email: string){
    return this.http.get<any>(this.url+'/send-link-reset-password?email='+email);
  }

  resetLink(resetPassword: ResetPassword){
    return this.http.post(this.url+'/reset-password', resetPassword);
  }

  updateProfile(userUpdated: User, userPassword: string){
    let data = {user: userUpdated, password: userPassword};
    return this.http.post(this.url+'/update_user_profile', data, {headers:this.utils.getHttpHeader()});
  }

  registerPhoneNumber(user: User){
    return this.http.post(this.url+'/update_user_profile', user, {headers:this.utils.getHttpHeader()});
  }

  userExists(email: string){
    return this.http.get<any>(this.url+'/user_exists?email='+email);
  }

  //------------------------------ Admin ---------------------------------//

  enableUserAccount( userEmail: string, enableUserAccount: boolean ){
    return this.http.get<any>(`${this.url}/enable_user_account?userEmail=${userEmail}&enable=${enableUserAccount}`, {headers:this.utils.getHttpHeader()});
  }

  getAll(){
    return this.http.get<any>(this.url+'/get_all', {headers:this.utils.getHttpHeader()});
  }


}