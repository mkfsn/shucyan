import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

import { Program, Tag } from '../models/program';

@Injectable()
export class ProgramsService {

    static readonly namesOfDays = ['日', '月', '火', '水', '木', '金', '土'];

    constructor(private db: AngularFireDatabase) {
    }

    addProgram(channelId: string, program: Program): Observable<Program> {
        console.log(channelId, program);
        const thenable = this.db.list('/programs/' + channelId).push(program);
        return Observable.fromPromise(thenable);
    }

    getChannelPrograms(channelId: string): Observable<Program[]> {
        return this.db.list('/programs/' + channelId).snapshotChanges().map(fireactions => {
            return fireactions.map(action => {
                const val = action.payload.val();
                const program = Program.fromFirebase(action.key, val.day, val.name, val.content);
                if (val.tags !== undefined) {
                    program.tags = val.tags.map(v => {
                        return new Tag(v.name);
                    });
                }
                return program;
            });
        });
    }

    updateProgram(channelId: string, program: Program): Observable<void> {
        const thenable = this.db.object('/programs/' + channelId + '/' + program.id).update(program);
        return Observable.fromPromise(thenable);
    }

    removeProgram(channelId: string, programId: string): Observable<void> {
        const thenable = this.db.object('/programs/' + channelId + '/' + programId).remove();
        return Observable.fromPromise(thenable);
    }

}
