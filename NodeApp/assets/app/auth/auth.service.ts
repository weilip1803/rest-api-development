import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";

import {User} from "./user.model";

@Injectable()
export class AuthService {
    constructor(private http: Http) {
    }

    signup(user: User) {

        const body = JSON.stringify(user);
        console.log(body);
        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.post('http://localhost:8080/users/register', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:8080/users/authenticate', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    expire(token: string) {
        const body = {"token": token};
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:8080/users/expire', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getInfo() {

        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? localStorage.getItem('token')
            : '';
        const body = {"token": token};
        console.log("here " + body);
        return this.http.post('http://localhost:8080/users', body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                console.log(result);
            })
            .catch((error: Response) => Observable.throw(error.json()));

    }


    logout() {
        console.log("here ")
        this.expire(localStorage.getItem('token')).subscribe();
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}