import { Component } from '@angular/core';
import { Channel } from '../shared/channel';
import { ChannelService } from '../service/channel.service';

declare var require: any;

@Component({
    selector: 'latest',
    template: require('./latest.html')
})

export class LatestComponent {

    // state
    private channels: Array<Channel>;
    static readonly N: number = 10;

    constructor(private channelService: ChannelService) {
        channelService.list((channels: Channel[]) => {
            this.channels = channels;

            // At least N
            for (let i = this.channels.length; i < LatestComponent.N; i++) {
                this.channels.push(new Channel('', '', ''));
            }

            // At most N
            this.channels = this.channels.slice(0, LatestComponent.N);
        });
    }
}
