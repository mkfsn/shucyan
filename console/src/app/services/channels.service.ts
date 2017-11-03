import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { Channel } from '../models/channel';

@Injectable()
export class ChannelsService {

    private currentUser: firebase.User = null;
    private channels: AngularFireList<Channel>;

    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.channels = this.db.list('channels');
            } else {
                this.currentUser = null;
                this.channels = null;
            }
        });
    }

    getBookshelves(): Observable<Channel[]> {
        if (!this.channels) {
            return Observable.of();
        }
        return this.channels.snapshotChanges().map(fireactions => {
            return fireactions.map(action => {
                let val = action.payload.val();
                return new Channel(val.name, val.description, action.key);
            });
        });
    }

    removeBookshelf(id: string) {
        this.channels.remove(id);
    }
}
