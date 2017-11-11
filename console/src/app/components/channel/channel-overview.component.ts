import swal from 'sweetalert2';

import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChannelsService } from '../../services/channels.service';

import { Channel } from '../../models/channel';

@Component({
    selector: 'app-channel-overview',
    templateUrl: './channel-overview.component.html',
    styleUrls: ['./channel-overview.component.scss']
})
export class ChannelOverviewComponent implements OnInit {

    private myChannelsSub: Observable<Channel[]>;
    private sharedChannelsSub: Observable<Channel[]>;

    private channelsSub: Observable<Channel[]>;

    constructor(private channelsService: ChannelsService) {
        this.myChannelsSub = this.channelsService.getMyChannels();
        this.sharedChannelsSub = this.channelsService.getSharedChannels();
    }

    ngOnInit() {
        this.channelsSub = this.myChannelsSub;
    }

    newChannel(name: string, description: string) {
        const channel = new Channel(name, description);
        const successFunc = () => {
            swal({
                title: 'Created!',
                text: `The channel '${name}' has been created succssfully.`,
                type: 'success',
                timer: 1500
            }).catch(_ => {});
        };
        const errorFunc = () => {
            swal({
                title: 'Oops!',
                text: 'Something got wrong :(',
                type: 'error',
                timer: 1500
            }).catch(_ => {});
        };
        const completeFunc = () => {
            // TODO: close dropdown
        };
        this.channelsService.addChannel(channel).subscribe(successFunc, errorFunc, completeFunc);
    }

    removeChannel(channel: Channel): void {
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this channel: ' + channel.name + ' !',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(() => {
            const successFunc = () => {
                swal({
                    title: 'Deleted',
                    text: 'The channel has been deleted.',
                    type: 'success',
                    timer: 1500
                }).catch(_ => {});
            };
            const errorFunc = () => {};
            const completeFunc = () => {};
            this.channelsService.removeChannel(channel.id).subscribe(successFunc, errorFunc, completeFunc);
        }).catch(dismiss => {
            // dismiss can be 'cancel', 'overlay', 'close', and 'timer'
            if (dismiss === 'cancel') {
                swal({
                    title: 'Canceled',
                    text: 'Nothing has been deleted.',
                    type: 'info',
                    timer: 1500
                }).catch(_ => {});
            }
        });
    }

    private switchTo(to: string) {
        switch (to) {
            case 'mine':
                this.channelsSub = this.myChannelsSub;
                return;
            case 'shared':
                this.channelsSub = this.sharedChannelsSub;
                return;
        }
        this.channelsSub = this.myChannelsSub;
    }

}
