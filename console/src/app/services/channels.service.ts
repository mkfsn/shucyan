import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/shareReplay';

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

    addChannel(channel: Channel): Observable<Channel> {
        return this.authService.getAuthState().mergeMap(user => {
            if (user === null) {
                console.error('Permission denied: user not authenticated');
            }

            channel.createdAt = Date.now();
            channel.owner = user.encodedEmail;
            const thenable = this.channels.push(channel.toFirebase());
            return Observable.fromPromise(thenable);
        });
    }

    /*
     * getChannel returns channel by given id
     */
    getChannel(id: string): Observable<Channel> {
        return this.authService.getAuthState().mergeMap(user => {
            return this.db.object('/channels/' + id).snapshotChanges()
                .map(action => {
                    const values = action.payload.val();
                    return Channel.fromFirebase(action.key, values, user);
                })
                .combineLatest(this.programsService.getChannelPrograms(id), (channel, programs) => {
                    channel.programs = programs;
                    return channel;
                }).shareReplay(1);
        });
    }

    /*
     * getChannels returns all channel belongs to user if user is authenticated,
     * otherwise throw an Observable error.
     */
    getMyChannels(): Observable<Channel[]> {
        return this.authService.getAuthState().mergeMap(user => {
            if (user === null) {
                return Observable.throw('Permission denied: user not authenticated');
            }
            const list = this.db.list('/channels', ref => ref.orderByChild('owner').equalTo(user.encodedEmail));
            return list.snapshotChanges().map(fireactions => {
                const channels = fireactions.map(action => {
                    const values = action.payload.val();
                    return Channel.fromFirebase(action.key, values, user);
                });
                return Channel.sort(channels, ['createdAt', 'updatedAt']);
            });
        }).shareReplay(1);
    }

    getSharedChannels(): Observable<Channel[]> {
        return this.authService.getAuthState().mergeMap(user => {
            if (user === null) {
                return Observable.throw('Permission denied: user not authenticated');
            }

            const refFunc = ref => ref.orderByChild('collaborators/' + user.encodedEmail + '/editable').equalTo(true);
            const list = this.db.list('/channels', refFunc);
            return list.snapshotChanges().map(fireactions => {
                const channels = fireactions.map(action => {
                    const values = action.payload.val();
                    return Channel.fromFirebase(action.key, values, user);
                });
                return Channel.sort(channels, ['createdAt', 'updatedAt']);
            });
        }).shareReplay(1);
    }

    getLatestChannels(n: number = 10): Observable<Channel[]> {
        n = n < 0 ? 10 : n;
        return this.channels.snapshotChanges().map(fireactions => {
            const channels = fireactions.map(action => {
                const values = action.payload.val();
                return Channel.fromFirebase(action.key, values);
            });
            return Channel.sort(channels, ['createdAt', 'updatedAt']).slice(0, n);
        }).shareReplay(1);
    }

    updateChannel(id: string, channel: Channel): Observable<void> {
        channel.updatedAt = Date.now();
        const thenable = this.db.object('/channels/' + id).update(channel.toFirebase());
        return Observable.fromPromise(thenable);
    }

    removeChannel(id: string): Observable<void> {
        const thenable = this.channels.remove(id);
        return Observable.fromPromise(thenable);
    }
}
