import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { AuthService } from './services/auth.service';

import { User } from './models/user';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

    year: number;
    isCollapsed: boolean;

    // undefined: user not loaded yet
    // null: user not login
    // else: user login
    userState: Observable<User>;

    constructor(private auth: AuthService) {
        this.isCollapsed = false;
        this.year = (new Date()).getFullYear();
    }

    ngOnInit() {
        this.userState = this.auth.getAuthState();
    }

    loginWithGoogle() {
        this.auth.loginWithGoogle();
    }

    logout() {
        this.auth.logout();
    }

}
