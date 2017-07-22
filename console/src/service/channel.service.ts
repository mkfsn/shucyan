import { Injectable } from '@angular/core';
import { Channel } from '../shared/channel';

import { Resource, ResourceParams, ResourceAction, ResourceMethod } from 'ngx-resource';

import { RequestMethod } from '@angular/http';

declare var require: any;

@Injectable()
@ResourceParams({
    removeTrailingSlash: false,
    url: '/api/channels'
})
export class ChannelService extends Resource {

    @ResourceAction({
        method: RequestMethod.Get,
        path: '/{!id}'
    })
    public find: ResourceMethod<{id: any}, Channel>;

    @ResourceAction({
        method: RequestMethod.Get,
        isArray: true,
        path: '/'
    })
    public list: ResourceMethod<any, Channel[]>;

}
