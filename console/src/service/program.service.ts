import { Injectable } from '@angular/core';
import { Program } from '../shared/program';

import { Resource, ResourceParams, ResourceAction, ResourceMethodStrict } from 'ngx-resource';

import { RequestMethod } from '@angular/http';

declare var require: any;

@Injectable()
@ResourceParams({
    removeTrailingSlash: false,
    url: '/api/programs'
})
export class ProgramService extends Resource {

    @ResourceAction({
        method: RequestMethod.Post,
        path: '/'
    })
    private _create: ResourceMethodStrict<Program, any, Program>;

    @ResourceAction({
        method: RequestMethod.Put,
        path: '/'
    })
    private _update: ResourceMethodStrict<Program, any, Program>;

    @ResourceAction({
        method: RequestMethod.Delete,
        path: '/'
    })
    private _remove: ResourceMethodStrict<Program, any, Program>;


    public create(program: Program, success, error) {
        this._create(program).$observable.subscribe(success, error);
    }

    public update(program: Program, success, error) {
        this._update(program).$observable.subscribe(success, error);
    }

    public remove(program: Program, success, error) {
        this._remove(program).$observable.subscribe(success, error);
    }

}
