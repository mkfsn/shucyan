import './channel.scss';
import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
// Model
import { Channel, NullChannel } from '../shared/channel';
// Service
import { ChannelService } from '../service/channel.service';

declare var require: any;

enum Mode {
    normal,
    edit
};

@Component({
    selector: 'channel',
    template: require('./channel.html')
})

export class ChannelComponent {

    private channel: Channel;
    private mode: Mode;

    constructor(private route: ActivatedRoute, private channelService: ChannelService, private titleService: Title) {
        this.mode = this.getMode();
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

    private getMode(): Mode {
        if (this.route.snapshot.url.length > 2 && this.route.snapshot.url[2].path === 'edit') {
            return Mode.edit;
        }
        return Mode.normal;
    }

    get isEditMode(): boolean {
        return this.mode === Mode.edit && this.channel !== undefined && this.channel !== NullChannel;
    }

    get isNormalMode(): boolean {
        return this.mode === Mode.normal;
    }

    private titleInputLength(owner): string {
        return `calc(100% - ${owner.length + 1}ch - 66px)`;
    }
}
