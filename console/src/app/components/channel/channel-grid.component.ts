import { Component, OnInit, Input, Output, EventEmitter, DoCheck, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { Channel } from '../../models/channel';

interface IChannel extends Channel {
    selected: boolean;
}

@Component({
    selector: 'app-channel-grid',
    templateUrl: './channel-grid.component.html',
    styleUrls: ['./channel-grid.component.scss']
})
export class ChannelGridComponent implements OnInit, DoCheck {

    @Input('channels') private channels: Channel[];

    @Output('onRemoveChannel') onRemoveChannel = new EventEmitter();

    private selectableChannels: IChannel[];

    constructor(private router: Router) { }

    ngOnInit() {}

    ngDoCheck() {
        if (this.selectableChannels) {
            this.selectableChannels = this.channels.map((ch: Channel) => {
                const channel = ch as IChannel;
                const previousChannel = this.selectableChannels.find(c => c.id === ch.id);
                if (previousChannel !== undefined) {
                    channel.selected = previousChannel.selected;
                } else {
                    channel.selected = false;
                }
                return channel;
            });
        } else if (this.channels) {
            this.selectableChannels = this.channels.map((ch: Channel) => {
                const channel = ch as IChannel;
                channel.selected = false;
                return channel;
            });
        }
    }

    @HostListener('document:click', ['$event'])
    private clickOutside(event) {
        this.unselectAll();
    }

    private unselectAll(): void {
        this.selectableChannels.forEach(ch => {
            ch.selected = false;
        });
    }

    private select(event, channelId: string): void {
        this.unselectAll();
        event.stopPropagation();

        const channel = this.selectableChannels.find(ch => ch.id === channelId);
        if (channel !== undefined) {
            channel.selected = true;
        }
    }

    private removeChannel(channel: Channel): void {
        this.onRemoveChannel.emit(channel);
    }

    private navigateTo(event, channelId: string): void {
        event.preventDefault();
        event.stopPropagation();
        this.router.navigate(['/channel/' + channelId]);
    }
}
