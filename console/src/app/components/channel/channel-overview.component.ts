import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChannelsService } from '../../services/channels.service';

import { Channel } from '../../models/channel';

@Component({
    selector: 'app-channel-overview',
    templateUrl: './channel-overview.component.html',
    styleUrls: ['./channel-overview.component.scss']
})
export class ChannelOverviewComponent implements OnInit {

    private myChannelsSub: Observable<Channel[]>;
    private sharedChannelsSub: Observable<Channel[]>;

    private channelsSub: Observable<Channel[]>;

    constructor(private channelsService: ChannelsService) {
        this.myChannelsSub = this.channelsService.getMyChannels();
        this.sharedChannelsSub = this.channelsService.getSharedChannels();
    }

    ngOnInit() {
        this.channelsSub = this.myChannelsSub;
    }

    newChannel(name: string, description: string) {
        const channel = new Channel(name, description);
        this.channelsService.addChannel(channel);
    }

    removeChannel(channel: Channel): void {
        const removeIt = confirm('Remove channel: ' + channel.name + ' ?');
        if (removeIt !== true) {
            return;
        }
        this.channelsService.removeChannel(channel.id);
    }

    private switchTo(to: string) {
        switch (to) {
            case 'mine':
                this.channelsSub = this.myChannelsSub;
                return;
            case 'shared':
                this.channelsSub = this.sharedChannelsSub;
                return;
        }
        this.channelsSub = this.myChannelsSub;
    }

}
