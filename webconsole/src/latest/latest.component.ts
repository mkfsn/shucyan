import { Component } from '@angular/core';
import { Channel } from '../shared/channel';

declare var require: any;

@Component({
    selector: 'latest',
    template: require('./latest.html')
})

export class LatestComponent {

    // state
    private channels: Array<Channel>;
    static readonly N: number = 10;

    constructor() {
        this.channels = Channel.getDefault();

        // At least N
        for (let i = this.channels.length; i < LatestComponent.N; i++) {
            this.channels.push(new Channel('', '', ''));
        }

        // At most N
        this.channels = this.channels.slice(0, LatestComponent.N);
    }
}
