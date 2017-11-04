import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

import { Program } from '../models/program';

@Injectable()
export class ProgramsService {

    static readonly namesOfDays = ['日', '月', '火', '水', '木', '金', '土'];

    constructor(private db: AngularFireDatabase) {
    }

    getChannelPrograms(id: string): Observable<Program[]> {
        return this.db.list('/programs/' + id).snapshotChanges().map(fireactions => {
            return fireactions.map(action => {
                const val = action.payload.val();
                return Program.fromFirebase(action.key, val.day, val.name, val.content);
            });
        });
    }

}
