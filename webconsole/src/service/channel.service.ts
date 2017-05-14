import { Injectable } from '@angular/core';
import { Channel } from '../shared/channel';
import { Program } from '../shared/program';

declare var require: any;

@Injectable()
export class ChannelService {

    private _channels: Array<Channel>;
    static readonly namesOfDays = ['日', '月', '火', '水', '木', '金', '土'];

    constructor() {
        let json = require('../shared/data/default.json');
        this._channels = Channel.fromJSON(json);
    }

    get channels() {
        return this._channels;
    }

    public find(channelId: string): Channel {
        return this.channels.find(ch => ch.id === channelId);
    }
}
