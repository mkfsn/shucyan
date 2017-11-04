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

    private channelsSub: Observable<Channel[]>;

    constructor(private channelsService: ChannelsService) {
        this.channelsSub = this.channelsService.getChannels();
    }

    ngOnInit() {
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

}
