import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChannelsService } from '../../services/channels.service';

import { Channel } from '../../models/channel';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    // state
    private channels: Observable<Channel[]>;
    readonly N: number = 10;

    constructor(private channelsService: ChannelsService) {
        this.channels = this.channelsService.getLatestChannels();
    }

    ngOnInit() {
    }

}
