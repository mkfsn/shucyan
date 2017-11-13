import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Channel } from '../../models/channel';

@Component({
    selector: 'app-channel-grid',
    templateUrl: './channel-grid.component.html',
    styleUrls: ['./channel-grid.component.scss']
})
export class ChannelGridComponent implements OnInit {

    @Input('channels') private channels: Channel[];

    @Output('onRemoveChannel') onRemoveChannel = new EventEmitter();

    constructor() { }

    ngOnInit() {}

    private removeChannel(channel: Channel): void {
        this.onRemoveChannel.emit(channel);
    }
}
