import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/shareReplay';

import { Program, Tag } from '../models/program';

@Injectable()
export class ProgramsService {

    static days: string[] = ['日', '月', '火', '水', '木', '金', '土'];

    // today's day of week
    private day: number;

    constructor(private db: AngularFireDatabase) {
        this.day = (new Date()).getDay();
    }

    get dates(): string[] {
        return ProgramsService.days.map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return (
                date.getFullYear() + '/' +
                (date.getMonth() + 1) + '/' +
                date.getDate()
            );
        });
    }

    addProgram(channelId: string, program: Program): Observable<Program> {
        const thenable = this.db.list('/programs/' + channelId).push(program.toFirebase());
        return Observable.fromPromise(thenable);
    }

    getChannelPrograms(channelId: string): Observable<Program[]> {
        return this.db.list('/programs/' + channelId).snapshotChanges().map(fireactions => {
            return fireactions.map(action => {
                const val = action.payload.val();
                return Program.fromFirebase(action.key, val);
            });
        }).shareReplay(1);
    }

    updateProgram(channelId: string, program: Program): Observable<void> {
        const thenable = this.db.object('/programs/' + channelId + '/' + program.id).update(program.toFirebase());
        console.log('updateProgram:', program);
        return Observable.fromPromise(thenable);
    }

    removeProgram(channelId: string, programId: string): Observable<void> {
        const thenable = this.db.object('/programs/' + channelId + '/' + programId).remove();
        return Observable.fromPromise(thenable);
    }

}
