import './channel.scss';
import * as chroma from 'chroma-js';
import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Channel } from '../shared/channel';
import { Program } from '../shared/program';
// Service
import { ChannelService } from '../service/channel.service';

declare var require: any;

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

    constructor(private route: ActivatedRoute, private channelService: ChannelService) {
        this.colors = new Map<string, string>();
        this.namesOfDays = ChannelService.namesOfDays;
        this.day = (new Date()).getDay();
        this.datesOfWeek = this.getDatesOfWeek();
        this.channel = this.getChannel();
        this.programTable = this.buildProgramTable(this.channel.programs);
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
            ) ;
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

    private getChannel(): Channel {
        let channelId: string;
        this.route.params.forEach((param: Params) => {
            channelId = param.id;
        });
        return this.channelService.find(channelId);
    }

    private buildProgramTable(programs: Array<Program>) {
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
}
