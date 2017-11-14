import swal from 'sweetalert2';

import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChannelsService } from '../../services/channels.service';

import { Channel, Layout, Reference } from '../../models/channel';

@Component({
    selector: 'app-channel-overview',
    templateUrl: './channel-overview.component.html',
    styleUrls: ['./channel-overview.component.scss']
})
export class ChannelOverviewComponent implements OnInit {

    // Channels Observable: master
    private channelsSub: Observable<Channel[]>;
    // Channels Observable: slaves
    private myChannelsSub: Observable<Channel[]>;
    private sharedChannelsSub: Observable<Channel[]>;

    // Dropdown control
    private dropdownOpen: boolean;
    @ViewChild('newChannelMenu') private newChannelMenu: ElementRef;
    @ViewChild('newChannelButton') private newChannelButton: ElementRef;
    @ViewChild('newChannelName') private newChannelName: ElementRef;

    // grid, list
    private layout: Layout;

    // mine, shared, ... etc
    private reference: Reference;

    constructor(private channelsService: ChannelsService, private elementRef: ElementRef) {
        this.myChannelsSub = this.channelsService.getMyChannels();
        this.sharedChannelsSub = this.channelsService.getSharedChannels();

        this.dropdownOpen = false;
    }

    ngOnInit() {
        this.channelsSub = this.myChannelsSub;
        this.layout = 'grid';
        this.reference = 'mine';
    }

    @HostListener('click', ['$event'])
    public onClick(event: any): void {
        if (this.newChannelMenu && this.newChannelMenu.nativeElement.contains(event.target)) {
            // click inside dropdown menu
            this.dropdownOpen = true;
        } else if (event.target === this.newChannelButton.nativeElement) {
            // click on dropdown button
            this.dropdownOpen = !this.dropdownOpen;
        } else if (this.dropdownOpen) {
            // click outside dropdown menu
            this.dropdownOpen = false;
        }
    }

    newChannelNamefocus() {
        setTimeout(() => {
            if (this.newChannelName) {
                this.newChannelName.nativeElement.focus();
            }
        }, 0);
    }

    newChannel(event, name: string, description: string) {
        event.stopPropagation();
        this.dropdownOpen = false;
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
        const completeFunc = () => {};
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
                this.reference = 'mine';
                return;
            case 'shared':
                this.channelsSub = this.sharedChannelsSub;
                this.reference = 'shared';
                return;
        }
        this.channelsSub = this.myChannelsSub;
    }

}
