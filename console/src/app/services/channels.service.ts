import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../services/auth.service';

import { Channel } from '../models/channel';
import { User } from '../models/user';

@Injectable()
export class ChannelsService {

    private channels: AngularFireList<Channel>;

    constructor(private authService: AuthService, private db: AngularFireDatabase) {
        this.channels = this.db.list('/channels', ref => ref.orderByChild('owner').equalTo(this.authService.user.uid));
    }

    addChannel(channel: Channel) {
        channel.owner = this.authService.user.uid;
        this.channels.push(channel);
    }

    getChannels(): Observable<Channel[]> {
        if (!this.channels) {
            return Observable.of();
        }
        return this.channels.snapshotChanges().map(fireactions => {
            return fireactions.map(action => {
                let val = action.payload.val();
                return Channel.fromFirebase(action.key, val.name, val.description, val.owner);
            });
        });
    }

    removeChannel(id: string) {
        this.channels.remove(id);
    }
}
