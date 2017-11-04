import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { ProgramsService } from '../../services/programs.service';

import { Program, Tag } from '../../models/program';

@Component({
    selector: 'app-program',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {

    @Input() isEditMode: boolean;
    @Input() programs: Array<Program>;
    @Input() channelId: string;

    private programTable: Array<Array<Program>>;

    // today's day of week
    private day: number;
    private namesOfDays: Array<string>;
    private datesOfWeek: Array<string>;

    // color cache
    private colors: Map<string, string>;

    // For adding/editing program
    private program: Program;

    @ViewChild('programModal') public programModal: ModalDirective;
    @ViewChild('infoModal') public infoModal: ModalDirective;

    private optionOpen: boolean;
    private inputTags: string;

    constructor(private programsService: ProgramsService) {
        this.colors = new Map<string, string>();
        this.namesOfDays = ProgramsService.namesOfDays;
        this.day = (new Date()).getDay();
        this.datesOfWeek = this.getDatesOfWeek();
        this.optionOpen = false;
        this.program = new Program(-1, '', '');
    }

    ngOnInit() {
        this.programTable = this.buildProgramTable(this.programs);
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

    // This should be protected by calling getColor()
    private calculateColor(tag: string) {
        let hash = 0;
        if (tag.length === 0) {
            return '';
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
        // return chroma('#' + r + g + b).darken().hex();
        return '';
    }

    private getColor(tag: string): string {
        if (!this.colors.has(tag)) {
            let color = this.calculateColor(tag);
            this.colors.set(tag, color);
        }
        return this.colors.get(tag);
    }

    private isToday(day: number): boolean {
        return day === this.day;
    }

    private buildProgramTable(programs: Array<Program>): Array<Array<Program>> {
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

    private titleInputLength(owner): string {
        return `calc(100% - ${owner.length + 1}ch - 66px)`;
    }

    private newProgram(day: number): void {
        this.optionOpen = false;
        this.program = new Program(day, '', '');
        console.log(this.program);
        // this.programModal.show();
    }

    private createProgram(program: Program): void {
        let success = (success) => {
            this.programs.push(program);
            this.programTable = this.buildProgramTable(this.programs);
            // this.programModal.hide();
        }
        let error = (error) => {
            console.error(error);
            // this.programModal.hide();
        }

        // TODO: Check program fields
        // this.programService.create(program, success, error);
    }

    private updateProgram(program: Program): void {
        let success = (success) => {
            // this.programModal.hide();
        }
        let error = (error) => {
            console.error(error);
            // this.programModal.hide();
        }
        // this.programService.update(program, success, error);
    }

    private saveProgram(): void {
        let update = this.program.id !== undefined;
        this.program.channelId = this.channelId;
        if (update) {
            this.updateProgram(this.program);
        } else {
            this.createProgram(this.program);
        }
    }

    private clickProgram(program: Program): void {
        if (program === undefined) {
            return;
        } else if (this.isEditMode) {
            this.editProgram(program);
        } else {
            this.showProgram(program);
        }
    }

    private showProgram(program: Program): void {
        this.program = program;
        // this.infoModal.show();
    }

    private tryAddTags(inputTags: string): void {
        this.inputTags = inputTags;
        if (inputTags && inputTags.indexOf(',') !== -1) {
            let tags = inputTags.split(',').map(v => {
                console.log("v", v);
                return new Tag(v);
            });
            this.inputTags = tags.pop().name;
            this.program.tags = this.program.tags.concat(tags);
        }
    }

    private editProgram(program: Program): void {
        this.optionOpen = false;
        this.program = program;
        // this.programModal.show();
    }

    private removeProgram(event, program): void {
        event.stopPropagation();
        let removeIt = confirm('Remove program: ' + program.title + ' ?');
        if (removeIt !== true) {
            return;
        }

        program.channelId = this.channelId;
        /*
        this.programService.remove(program,
            (success) => {
                let index = this.programs.findIndex((p) => p.id === program.id);
                this.programs.splice(index, 1);
                this.programTable = this.buildProgramTable(this.programs);
                // this.programModal.hide();
            },
            (error) => {
                console.error(error);
                this.programModal.hide();
            }
        )
         */
    }

    private removeTag(index: number): void {
        this.program.tags.splice(index, 1);
    }

}
