import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';

import { AuthService } from '../services/auth.service';
import { ProgramsService } from '../services/programs.service';

import { Channel } from '../models/channel';
import { User } from '../models/user';

@Injectable()
export class ChannelsService {

    private channels: AngularFireList<Channel>;

    constructor(private authService: AuthService, private db: AngularFireDatabase, private programsService: ProgramsService) {
        this.channels = this.db.list('/channels');
    }

    addChannel(channel: Channel) {
        channel.owner = this.authService.user.email;
        this.channels.push(channel);
    }

    /*
     * getChannel returns channel by given id
     */
    getChannel(id: string): Observable<Channel> {
        return this.db.object('/channels/' + id).snapshotChanges()
            .map(action => {
                const val = action.payload.val();
                return Channel.fromFirebase(action.key, val.name, val.description, val.owner);
            })
            .combineLatest(this.programsService.getChannelPrograms(id), (channel, programs) => {
                channel.programs = programs;
                return channel;
            });
    }

    /*
     * getChannels returns all channel belongs to user if user is authenticated,
     * otherwise throw an Observable error.
     */
    getChannels(): Observable<Channel[]> {
        return this.authService.getAuthState().mergeMap(user => {
            if (user === null) {
                return Observable.throw('Permission denied: user not authenticated');
            }
            const list = this.db.list('/channels', ref => ref.orderByChild('owner').equalTo(user.email));
            return list.snapshotChanges().map(fireactions => {
                return fireactions.map(action => {
                    const val = action.payload.val();
                    return Channel.fromFirebase(action.key, val.name, val.description, val.owner);
                });
            });
        });
    }

    getLatestChannels(): Observable<Channel[]> {
        return this.channels.snapshotChanges().map(fireactions => {
            return fireactions.map(action => {
                const val = action.payload.val();
                return Channel.fromFirebase(action.key, val.name, val.description, val.owner);
            });
        });
    }

    updateChannel(id: string, channel: Channel): Observable<void> {
        const thenable = this.db.object('/channels/' + id).update(channel);
        return Observable.fromPromise(thenable);
    }

    removeChannel(id: string) {
        this.channels.remove(id);
    }
}
