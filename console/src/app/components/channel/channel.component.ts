import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { ChannelsService } from '../../services/channels.service';
import { AuthService } from '../../services/auth.service';

import { Channel, NullChannel } from '../../models/channel';
import { Program, Tag } from '../../models/program';
import { PageMode } from '../../models/page';

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

    private channel: Channel;
    private mode: PageMode = new PageMode();
    private inputEmail: string;
    private inputCollaborators: string[];
    private editable: boolean;
    private shareable: boolean;

    private tags: TagStatus[];
    private filteredPrograms: Program[];
    private collaborators: string[];

    @ViewChild('inputEmailElement') private inputEmailElement: ElementRef;
    @ViewChild('shareModal') private shareModal: ModalDirective;

    constructor(private route: ActivatedRoute,
                private channelsService: ChannelsService,
                private authService: AuthService,
                private router: Router) {
        this.setModeByURL();
        this.loadChannel();
        this.inputCollaborators = [];

        this.editable = false;
        this.shareable = false;

        this.tags = [];
        this.filteredPrograms = [];
        this.collaborators = [];
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

        const successFunc = (channel: Channel) => {
            this.setChannel(channel);

            const email = this.authService.user.email;
            this.editable = channel.canEdit(email);
            this.shareable = channel.canShare(email);

            const uniqueFunc = (tag, i, arr) => arr.findIndex(v => v.name === tag.name) === i;
            const reduceProgramFunc = (all, program: Program) => all.concat(program.tags.map(v => new TagStatus(v.name)));
            this.tags = channel.programs.reduce(reduceProgramFunc, []).filter(uniqueFunc);
            this.updateFilteredPrograms();

            this.collaborators = Object.keys(channel.collaborators);
        };

        const errorFunc = () => {
            this.setChannel(NullChannel);
        };

        this.channelsService.getChannel(channelId).subscribe(successFunc, errorFunc);
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

    private nameInputLength(owner): string {
        return `calc(100% - ${owner.length + 1}ch - 200px)`;
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
        this.channel.removeCollaborators(email);
    }

    private inputEmailExists(email: string): Boolean {
        email = email.trim();
        // FIXME: bad naming
        return this.channel.canEdit(email);
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
        this.channel.addCollaborators(...this.inputCollaborators);
        this.shareModal.hide();
        this.saveChannel();
    }

    private updateChannel(name, description) {
        this.channel.name = name;
        this.channel.description = description;
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

}
