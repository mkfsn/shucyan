import { Component, OnInit } from '@angular/core';

import { ChannelsService } from '../../services/channels.service';

import { Channel } from '../../models/channel';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    // state
    private channels: Array<Channel>;
    static readonly N: number = 10;

    constructor(private channelsService: ChannelsService) {
        /*
        channelsService.list((channels: Channel[]) => {
            this.channels = channels;

            // At least N
            for (let i = this.channels.length; i < LatestComponent.N; i++) {
                this.channels.push(new Channel('', '', ''));
            }

            // At most N
            this.channels = this.channels.slice(0, LatestComponent.N);
        });
        */
    }

    ngOnInit() {
    }

}
