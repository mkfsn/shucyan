import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Channel, Reference } from '../../models/channel';

@Component({
    selector: 'app-channel-list',
    templateUrl: './channel-list.component.html',
    styleUrls: ['./channel-list.component.scss']
})
export class ChannelListComponent implements OnInit {

    @Input('channels') private channels: Channel[];
    @Input('reference') private reference: Reference;

    @Output('onRemoveChannel') onRemoveChannel = new EventEmitter();

    constructor() { }

    ngOnInit() {
        console.log('reference:', this.reference);
    }

    private removeChannel(channel: Channel): void {
        this.onRemoveChannel.emit(channel);
    }

}
