import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/shareReplay';

import { AuthUser } from '../models/user';

@Injectable()
export class AuthService {

    private authState: Observable<firebase.User>;
    private currentUser: AuthUser;

    constructor(public afAuth: AngularFireAuth) {
        this.currentUser = null;
        this.authState = this.afAuth.authState;
    }

    getAuthState(): Observable<AuthUser> {
        return this.authState.map(firebaseUser => {
            if (firebaseUser) {
                this.currentUser = new AuthUser(
                    firebaseUser.uid,
                    firebaseUser.displayName,
                    firebaseUser.email,
                    firebaseUser.providerId,
                    firebaseUser.photoURL
                );
            } else {
                this.currentUser = null;
            }
            return this.currentUser;
        }).shareReplay(1);
    }

    get user(): AuthUser {
        return this.currentUser;
    }

    loginWithGoogle(): Promise<any> {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    logout(): Promise<any> {
        return this.afAuth.auth.signOut();
    }
}
