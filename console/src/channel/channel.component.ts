import './channel.scss';
import * as chroma from 'chroma-js';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
// Model
import { Channel } from '../shared/channel';
import { Program } from '../shared/program';
// Service
import { ChannelService } from '../service/channel.service';

declare var require: any;

enum Mode {
    normal,
    edit
};


@Component({
    selector: 'channel',
    template: require('./channel.html')
})

export class ChannelComponent {

    private channel: Channel;
    private programTable: Array<Array<Program>>;
    // today's day of week
    private day: number;
    private namesOfDays: Array<string>;
    private datesOfWeek: Array<string>;
    // color cache
    private colors: Map<string, string>;
    private mode: Mode;
    // For adding/editing program
    private program: Program;

    @ViewChild('programModal') public programModal: ModalDirective;
    @ViewChild('infoModal') public infoModal: ModalDirective;
    private optionOpen: boolean;
    private inputTags: string;

    constructor(private route: ActivatedRoute, private channelService: ChannelService, private titleService: Title) {
        this.colors = new Map<string, string>();
        this.namesOfDays = ChannelService.namesOfDays;
        this.day = (new Date()).getDay();
        this.datesOfWeek = this.getDatesOfWeek();
        this.optionOpen = false;
        if (this.route.snapshot.url.length > 2 && this.route.snapshot.url[2].path === 'edit') {
            this.mode = Mode.edit;
        } else {
            this.mode = Mode.normal;
        }
        this.program = new Program(-1, '', '', []);

        this.loadChannel((channel: Channel) => {
            this.channel = channel;
            this.titleService.setTitle(this.channel.title);
            this.programTable = this.buildProgramTable(this.channel.programs);
        });
    }

    private getDatesOfWeek(): Array<string> {
        let dates: Array<string> = Array(7).fill('');
        this.namesOfDays.map((_, i) => {
            let date = new Date();
            date.setDate(date.getDate() + i);
            dates[(i + this.day) % this.namesOfDays.length] = (
                date.getFullYear() + '/' +
                (date.getMonth() + 1) + '/' +
                date.getDate()
            );
        });
        return dates;
    }

    private calculateColor(tag: string) {
        let hash = 0;
        if (tag.length === 0) {
            return hash;
        }
        for (let i = 0; i < tag.length; i++) {
            let ch = tag.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash = hash & hash; // Convert to 32bit integer
        }
        hash = Math.abs(hash) % (1 << 24) // 256 x 256 x 256
        let hex = ((hash) >>> 0).toString(16).slice(-6);
        let b = ('00' + Math.floor(hash / 256 / 256).toString(16)).substr(-2),
            g = ('00' + Math.floor((hash % (256 * 256)) / 256).toString(16)).substr(-2),
            r = ('00' + Math.floor(hash % 256).toString(16)).substr(-2);
        return chroma('#' + r + g + b).darken().hex();
    }

    private getColor(tag: string) {
        if (!this.colors.has(tag)) {
            let color = this.calculateColor(tag);
            this.colors.set(tag, color);
        }
        return this.colors.get(tag);
    }

    private isToday(day: number): boolean {
        return day === this.day;
    }

    private loadChannel(callback?: (res: Channel) => any) {
        let channelId: string;
        this.route.params.forEach((param: Params) => {
            channelId = param.id;
        });
        this.channelService.find({id: channelId}, callback);
    }

    private buildProgramTable(programs: Array<Program>) {
        if (!programs) return;

        let columns = [[], [], [], [], [], [], []],
            table = [],
            maxSize = 0;

        programs.forEach((program: Program) => {
            columns[program.day].push(program);
            maxSize = Math.max(maxSize, columns[program.day].length);
        });

        for (let i = 0; i < maxSize; i++) {
            table.push(this.namesOfDays.map((v, j) => columns[j][i]));
        }

        return table;
    }

    get isEditMode(): boolean {
        return this.mode === Mode.edit;
    }

    get isNormalMode(): boolean {
        return this.mode === Mode.normal;
    }

    private titleInputLength(owner): string {
        return `calc(100% - ${owner.length + 1}ch - 66px)`;
    }

    private newProgram(day: number) {
        this.optionOpen = false;
        this.program = new Program(day, '', '', []);
        this.programModal.show();
    }

    private saveProgram(update: boolean = false) {
        console.log(update, this.program);
    }

    private clickProgram(program: Program) {
        if (program === undefined) {
            return;
        } else if (this.isEditMode) {
            this.editProgram(program);
        } else {
            this.showProgram(program);
        }
    }

    private showProgram(program: Program) {
        this.program = program;
        this.infoModal.show();
    }

    private tryAddTags(inputTags: string) {
        if (inputTags && inputTags.indexOf(',') !== -1) {
            let tags = inputTags.split(',');
            this.inputTags = tags.pop();
            this.program.tags = this.program.tags.concat(tags);
        }
    }

    private editProgram(program: Program) {
        this.optionOpen = false;
        this.program = program;
        this.programModal.show();
    }

    private removeProgram(program) {
        confirm('Remove program: ' + program.title + ' ?');
    }
}
