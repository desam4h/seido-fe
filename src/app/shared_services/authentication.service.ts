import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { environment } from '../../environments/environment';
 
@Injectable()
export class AuthenticationService {

public userLoged: string = "";

    constructor(
        private http: HttpClient) { }
 
    public login(username: string, password: string) {

        let headers = new HttpHeaders().set('Content-Type','application/json');

        return this.http.post(environment.apiBaseUrl + '/auth', JSON.stringify({ username: username, password: password }), {headers: headers} )
            .map((response: HttpResponse<any>) => {
                // login successful if there's a jwt token in the response
                let user = response;
                if (user && user['token']) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
 
            });
    }
 
    public logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
    
    public isAuthenticated(): boolean{

        if (localStorage.getItem('currentUser')) { 
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.userLoged = currentUser.firstName + " " + currentUser.lastName;

            return true;
        }

        return false;
    }

    public isCurrentUserRoot(): boolean {
        return this.logedUserHasRole("ROLE_ROOT");
    }

    public isCurrentUserAdmin(): boolean {
        return this.isCurrentUserRoot() || this.logedUserHasRole("ROLE_ADMIN");
    }

    public isCurrentUserOperator(): boolean {
        return this.isCurrentUserAdmin() || this.logedUserHasRole("ROLE_OPERATOR");
    }


    private logedUserHasRole(hasRole:string) : boolean {

        if (localStorage.getItem('currentUser')) {
            
            let role = JSON.parse(localStorage.getItem('currentUser')).role;

            if (role == hasRole) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
