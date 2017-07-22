import './channel.scss';
import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
// Model
import { Channel, NullChannel } from '../shared/channel';
import { PageMode } from '../shared/page';
// Service
import { ChannelService } from '../service/channel.service';

declare var require: any;

@Component({
    selector: 'channel',
    template: require('./channel.html')
})

export class ChannelComponent {

    private channel: Channel;
    private mode: PageMode;

    constructor(private route: ActivatedRoute, private channelService: ChannelService, private titleService: Title) {
        this.setModeByURL();
        this.loadChannel();
    }

    // Get channelId from URL
    private getChannelId(): string {
        return this.route.snapshot.params['id'];
    }

    private setChannel(channel: Channel): void {
        this.channel = channel;
        if (channel === NullChannel) {
            return
        }
        this.titleService.setTitle(this.channel.title);
    }

    private loadChannel(): void {
        let channelId: string = this.getChannelId();

        let successFunc = (channel) => {
            this.setChannel(channel);
        }

        let errorFunc = (response) => {
            this.setChannel(NullChannel);
        }

        this.channelService.find({id: channelId}).$observable.subscribe(successFunc, errorFunc);
    }

    private setModeByURL(): void {
        if (this.route.snapshot.url.length > 2 && this.route.snapshot.url[2].path === 'edit') {
            this.mode.setEdit();
        }
        this.mode.setNormal();
    }

    get isEditMode(): boolean {
        return this.mode.isEdit && this.channel !== undefined && this.channel !== NullChannel;
    }

    get isNormalMode(): boolean {
        return this.mode.isNormal;
    }

    private titleInputLength(owner): string {
        return `calc(100% - ${owner.length + 1}ch - 66px)`;
    }
}
