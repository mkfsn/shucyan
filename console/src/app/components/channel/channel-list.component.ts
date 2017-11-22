import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Channel } from '../../models/channel';

// FIXME: Duplicate code from models/channel^
type Reference = 'mine' | 'shared';

@Component({
    selector: 'app-channel-list',
    templateUrl: './channel-list.component.html',
    styleUrls: ['./channel-list.component.scss']
})
export class ChannelListComponent implements OnInit {

    @Input('channels') channels: Channel[];
    @Input('reference') reference: Reference;

    @Output('onRemoveChannel') onRemoveChannel = new EventEmitter();

    constructor() { }

    ngOnInit() {}

    private removeChannel(channel: Channel): void {
        this.onRemoveChannel.emit(channel);
    }

}
