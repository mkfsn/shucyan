import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user';

@Injectable()
export class AuthService {

    private authState: Observable<firebase.User>;

    constructor(public afAuth: AngularFireAuth) {
        this.authState = this.afAuth.authState;
    }

    getAuthState() {
        return this.authState.map(firebaseUser => {
            if (firebaseUser) {
                return new User(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.providerId, firebaseUser.photoURL);
            }
            return null;
        });
    }

    loginWithGoogle() {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    logout() {
        return this.afAuth.auth.signOut();
    }
}
