import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";


@Injectable()
export class AdminGuard  {


    private hasAccess: boolean;

    constructor(private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (next != null && next != undefined) {
            const allowedRoles = next.data.allowedRoles;
            const currentUserRole = localStorage.getItem("user_role");

            if (allowedRoles.includes(parseInt(currentUserRole))) {
                return true;
            } else {
                //The user has not the priviliges to display admin dashboard
                this.router.navigate(['home'], { queryParams: { returnUrl: state.url } });
                return false;
            }
        }else{
            return false;
        }

    }


}