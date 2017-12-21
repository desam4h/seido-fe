import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
import { User } from '../models/user';
 
@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }
 
    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: HttpResponse<any>) => response);
    }
 
    create(user: User) {
        return this.http.post('/api/users', user, this.jwt()).map((response: HttpResponse<any>) => response);
    }
 
    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: HttpResponse<any>) => response);
    }
 
    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: HttpResponse<any>) => response);
    }
 
    // private helper methods
 
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + currentUser.token });
            return { headers: headers };
        }
    }
}