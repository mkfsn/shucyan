import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';

import { ChannelsService } from '../../services/channels.service';

import { Channel, NullChannel } from '../../models/channel';
import { PageMode } from '../../models/page';

@Component({
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

    private channel: Channel = NullChannel;
    private mode: PageMode = new PageMode();

    constructor(private route: ActivatedRoute, private channelsService: ChannelsService) {
        this.setModeByURL();
        this.loadChannel();
    }

    ngOnInit() {
    }

    // Get channelId from URL
    private getChannelId(): string {
        return this.route.snapshot.params['id'];
    }

    private setChannel(channel: Channel): void {
        this.channel = channel;
        if (channel === NullChannel) {
            return;
        }
        // this.titleService.setTitle(this.channel.title);
    }

    private loadChannel(): void {
        const channelId: string = this.getChannelId();

        const successFunc = (channel) => {
            this.setChannel(channel);
        };

        const errorFunc = () => {
            this.setChannel(NullChannel);
        };

        this.channelsService.getChannel(channelId).subscribe(successFunc, errorFunc);
    }

    private setModeByURL(): void {
        if (this.route.snapshot.url.length > 2 && this.route.snapshot.url[2].path === 'edit') {
            this.mode.setEdit();
        } else {
            this.mode.setNormal();
        }
    }

    get isEditMode(): boolean {
        return this.mode.isEdit && this.channel !== undefined;
    }

    get isNormalMode(): boolean {
        return this.mode.isNormal;
    }

    private nameInputLength(owner): string {
        return `calc(100% - ${owner.length + 1}ch - 200px)`;
    }

}
