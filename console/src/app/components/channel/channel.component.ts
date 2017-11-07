import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { ChannelsService } from '../../services/channels.service';
import { AuthService } from '../../services/auth.service';

import { Channel, NullChannel } from '../../models/channel';
import { PageMode } from '../../models/page';

@Component({
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

    private channel: Channel;
    private mode: PageMode = new PageMode();
    private inputEmail: string;
    private inputCollaborators: string[];
    private editable: boolean = false;

    @ViewChild('inputEmailElement') private inputEmailElement: ElementRef;
    @ViewChild('shareModal') private shareModal: ModalDirective;

    constructor(private route: ActivatedRoute, private channelsService: ChannelsService, private authService: AuthService) {
        this.setModeByURL();
        this.loadChannel();
        this.inputCollaborators = [];
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

            const email = this.authService.user.email;
            this.editable = email === channel.owner || channel.collaborators.find(v => v === email) !== undefined;
        };

        const errorFunc = () => {
            this.setChannel(NullChannel);
        };

        this.channelsService.getChannel(channelId).subscribe(successFunc, errorFunc);
    }

    private setModeByURL(): void {
        // TODO: Also check user has permission to edit
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

    private openShareModal() {
        this.inputCollaborators = [];
        this.shareModal.show();
    }

    private removeCollaborator(email: string) {
        email = email.trim();
        if (email === '') {
            return;
        }
        this.channel.collaborators = this.channel.collaborators.filter(v => v !== email);
    }

    private inputEmailExists(email: string): Boolean {
        email = email.trim();
        return this.channel.collaborators.find(v => v === email) !== undefined || this.channel.owner === email;
    }

    private inputEmailChanged(event) {
        if (event.keyCode !== 32 && event.keyCode !== 9 && event.keyCode !== 13) {
            return;
        }

        const email: string = this.inputEmail.trim();
        this.inputEmail = undefined;

        if (this.inputEmailExists(email) || email === '') {
            return;
        }

        if (undefined !== this.inputCollaborators.find(v => v === email)) {
            return;
        }
        this.inputCollaborators.push(email);
    }

    private inputEmailRemove(email) {
        email = email.trim();
        if (email === '') {
            return;
        }
        this.inputCollaborators = this.inputCollaborators.filter(v => v !== email);
        this.inputEmailElement.nativeElement.focus();
    }

    private saveCollaborators() {
        this.channel.collaborators = this.channel.collaborators.concat(this.inputCollaborators);
        this.shareModal.hide();
        this.saveChannel();
    }

    private saveChannel() {
        const successFunc = () => {};
        const errorFunc = () => {};
        const completeFunc = () => {};
        this.channelsService.updateChannel(this.channel.id, this.channel).subscribe(successFunc, errorFunc, completeFunc);
    }

}
