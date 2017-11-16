import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../services/auth.service';

import { Event } from '../models/event';

@Injectable()
export class EventsService {

    constructor(private db: AngularFireDatabase, private authService: AuthService) {
    }

    addEvent(channelId: string, event: Event): Observable<Event> {
        return this.authService.getAuthState().flatMap(auth => {
            event.email = auth.encodedEmail;
            const thenable = this.db.list('/events/' + channelId).push(event);
            return Observable.fromPromise(thenable);
        });
    }

    getEvents(channelId: string): Observable<Event[]> {
        return this.db.list('/events/' + channelId).snapshotChanges().map(fireactions => {
            return fireactions.map(action => {
                const values = action.payload.val();
                return Event.fromFirebase(values);
            });
        });
    }

}
