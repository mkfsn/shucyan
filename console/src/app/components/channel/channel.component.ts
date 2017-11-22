import swal from 'sweetalert2';

import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { ChannelsService } from '../../services/channels.service';
import { AuthService } from '../../services/auth.service';

import { Channel, DemoChannel } from '../../models/channel';
import { Program, Tag } from '../../models/program';
import { PageMode } from '../../models/page';
import { User } from '../../models/user';

class TagStatus extends Tag {
    selected: boolean;

    constructor(name: string) {
        super(name);
        this.selected = true;
    }
}

@Component({
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

    channel: Channel;
    mode: PageMode = new PageMode();
    inputEmail: string;
    inputCollaborators: string[];

    tags: TagStatus[];
    filteredPrograms: Program[];
    collaborators: string[];

    @ViewChild('inputEmailElement') inputEmailElement: ElementRef;
    @ViewChild('shareModal') shareModal: ModalDirective;

    editingChannelName: boolean;
    editingChannelDescription: boolean;
    @ViewChild('inputChannelName') inputChannelName: ElementRef;
    @ViewChild('inputChannelDescription') inputChannelDescription: ElementRef;

    constructor(private route: ActivatedRoute,
                private channelsService: ChannelsService,
                private authService: AuthService,
                @Inject(DOCUMENT) private document,
                private router: Router) {
        this.setModeByURL();
        this.loadChannel();
        this.inputCollaborators = [];

        this.tags = [];
        this.filteredPrograms = [];
        this.collaborators = [];

        this.editingChannelName = false;
        this.editingChannelDescription = false;
    }

    ngOnInit() {
        if (this.document.selection && this.document.selection.empty) {
            this.document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }

    // Get channelId from URL
    private getChannelId(): string {
        const channelId = this.route.snapshot.params['id'];
        if (channelId === undefined && this.route.snapshot.url[1] !== undefined) {
            return this.route.snapshot.url[1].path;
        }
        return channelId;
    }

    private setChannel(channel: Channel): void {
        this.channel = channel;
        if (channel === null) {
            return;
        }
        // this.titleService.setTitle(this.channel.title);
    }

    private loadRealChannel(channelId: string): void {
        const successFunc = (channel: Channel) => {
            this.setChannel(channel);

            const uniqueFunc = (tag, i, arr) => arr.findIndex(v => v.name === tag.name) === i;
            const reduceProgramFunc = (all, program: Program) => all.concat(program.tags.map(v => new TagStatus(v.name)));
            this.tags = channel.programs.reduce(reduceProgramFunc, []).filter(uniqueFunc);
            this.updateFilteredPrograms();

            this.collaborators = Object.keys(channel.collaborators);
        };

        const errorFunc = () => {
            console.error('Failed to load channel');
            this.setChannel(null);
        };

        this.channelsService.getChannel(channelId).subscribe(successFunc, errorFunc);
    }

    private loadDemoChannel(): void {
        this.setChannel(DemoChannel);
    }

    private loadChannel(): void {
        const channelId: string = this.getChannelId();
        console.log('loadChannel:', channelId);

        if (channelId === 'demo') {
            this.loadDemoChannel();
        } else {
            this.loadRealChannel(channelId);
        }
    }

    private updateSelectedTags(tagName: string) {
        const tag = this.tags.find(v => v.name === tagName);
        if (tag === undefined) {
            return;
        }
        tag.selected = !tag.selected;
        this.updateFilteredPrograms();
    }

    private updateFilteredPrograms() {
        const selectedTagNames: string[] = this.tags.filter(v => v.selected).map(v => v.name);
        this.filteredPrograms = this.channel.programs.filter((p: Program) => {
            if (p.tags.length === 0) {
                return true;
            }

            return p.tags.map(tag => selectedTagNames.indexOf(tag.name) !== -1).reduce((sum, cur) => sum || cur, false);
        });
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

    private openShareModal() {
        this.inputCollaborators = [];
        this.shareModal.show();
    }

    private removeCollaborator(email: string) {
        email = email.trim();
        console.log('remove collaborator:', email, this.collaborators);
        if (email === '') {
            return;
        }
        this.collaborators = this.collaborators.filter(v => v !== email);
        this.channel.removeCollaborators(new User(email));
    }

    private inputEmailExists(email: string): boolean {
        return (new User(email)).canEdit(this.channel);
    }

    inputEmailChanged(event) {
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

    saveCollaborators() {
        this.channel.addCollaborators(...this.inputCollaborators.map(email => new User(email)));
        this.shareModal.hide();
        this.saveChannel();
    }

    private updateChannel(name: string, description: string) {
        // channel name cannot be empty
        this.channel.name = name ? name : this.channel.name;
        // channel description can be empty
        this.channel.description = description !== undefined ? description : this.channel.description;
        this.saveChannel(true);
    }

    private saveChannel(redirect: boolean = false) {
        const successFunc = () => {};
        const errorFunc = () => {};
        const completeFunc = () => {
            if (redirect) {
                this.router.navigate(['/channel', this.channel.id]);
            }
        };
        this.channelsService.updateChannel(this.channel.id, this.channel).subscribe(successFunc, errorFunc, completeFunc);
    }

    private changeChannelName(): void {
        this.editingChannelName = true;
        setTimeout(() => {
            this.inputChannelName.nativeElement.focus();
        }, 0);
    }

    private saveChannelName(name: string): void {
        this.editingChannelName = false;
        if (name && name.length > 0) {
            this.updateChannel(name, undefined);
        } else {
            swal({
                title: 'Error!',
                text: 'Channel Name cannot be empty',
                type: 'error',
                timer: 5000
            }).catch(_ => {});

        }
    }

    private changeChannelDescription(): void {
        this.editingChannelDescription = true;
        setTimeout(() => {
            this.inputChannelDescription.nativeElement.focus();
        }, 0);
    }

    private saveChannelDescription(description: string): void {
        this.editingChannelDescription = false;
        this.updateChannel(undefined, description);
    }

}
