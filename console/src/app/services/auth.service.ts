import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user';

@Injectable()
export class AuthService {

    private authState: Observable<firebase.User>;
    private currentUser: User;

    constructor(public afAuth: AngularFireAuth) {
        this.currentUser = null;
        this.authState = this.afAuth.authState;
    }

    getAuthState() {
        return this.authState.map(firebaseUser => {
            if (firebaseUser) {
                this.currentUser = new User(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.providerId, firebaseUser.photoURL);
            } else {
                this.currentUser = null;
            }
            return this.currentUser;
        });
    }

    get user(): User {
        return this.currentUser;
    }

    loginWithGoogle() {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    logout() {
        return this.afAuth.auth.signOut();
    }
}
