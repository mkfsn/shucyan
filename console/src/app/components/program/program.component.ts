import * as chroma from 'chroma-js';
import swal from 'sweetalert2';

import { Component, OnChanges, Input, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { ProgramsService } from '../../services/programs.service';

import { Program, Tag } from '../../models/program';

@Component({
    selector: 'app-program',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnChanges {

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

    ngOnChanges(changes: any) {
        if (changes.programs) {
            this.programTable = this.buildProgramTable(this.programs);
        }
    }

    private getDatesOfWeek(): Array<string> {
        const dates: Array<string> = Array(7).fill('');
        this.namesOfDays.map((_, i) => {
            const date = new Date();
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
    private calculateColor(tag: string): string {
        const sum = tag.split('').reduce((acc, val, arr) => acc * val.charCodeAt(0), 0x5F3759DF);
        // NOTE: v / 2 + 128 for displaying brighter color
        // e.g. 4 / 2 + 128 => 130, where 4 is too dark but 130 is not.
        const itoa = (v: number): string => ('00' + Math.floor(v / 2 + 128).toString(16)).substr(-2);
        const b = itoa(sum % 256),
            g = itoa((sum / 256) % 256),
            r = itoa((sum / 256 / 256) % 256);
        return chroma('#' + r + g + b).darker(2).hex();
    }

    private getColor(tag: string): string {
        if (!this.colors.has(tag)) {
            const color = this.calculateColor(tag);
            this.colors.set(tag, color);
        }
        return this.colors.get(tag);
    }

    private isToday(day: number): boolean {
        return day === this.day;
    }

    private buildProgramTable(programs: Array<Program>): Array<Array<Program>> {
        if (!programs) {
            return;
        }

        const columns = [[], [], [], [], [], [], []],
              table = [];
        let maxSize = 0;

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
        this.programModal.show();
    }

    private createProgram(program: Program): void {
        const successFunc = (success) => {
            swal({
                title: 'Added!',
                text: 'The program has been added successfully.',
                type: 'success',
                timer: 1500
            }).catch(_ => {});
            this.programTable = this.buildProgramTable(this.programs);
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
            this.programModal.hide();
        };

        // TODO: Check program fields
        this.programsService.addProgram(this.channelId, program).subscribe(successFunc, errorFunc, completeFunc);
    }

    private updateProgram(program: Program): void {
        const successFunc = (success) => {};
        const errorFunc = (error) => {};
        const completeFunc = () => {
            this.programModal.hide();
        };
        this.programsService.updateProgram(this.channelId, program).subscribe(successFunc, errorFunc, completeFunc);
    }

    private saveProgram(): void {
        const update = this.program.id !== undefined;
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
        this.infoModal.show();
    }

    private tryAddTags(inputTags: string): void {
        this.inputTags = inputTags;
        if (inputTags && inputTags.indexOf(',') !== -1) {
            const tags = inputTags.split(',').map(v => {
                return new Tag(v);
            });
            this.inputTags = tags.pop().name;
            this.program.tags = this.program.tags.concat(tags);
        }
    }

    private editProgram(program: Program): void {
        this.optionOpen = false;
        this.program = program;
        this.programModal.show();
    }

    private removeProgram(event, program): void {
        event.stopPropagation();
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(() => {
            const successFunc = () => {
                swal({
                    title: 'Deleted',
                    text: 'The program has been deleted.',
                    type: 'success',
                    timer: 1500
                }).catch(_ => {});
                this.programTable = this.buildProgramTable(this.programs);
            };
            const errorFunc = () => {};
            const completeFunc = () => {
                this.programModal.hide();
            };

            this.programsService.removeProgram(this.channelId, program.id).subscribe(successFunc, errorFunc, completeFunc);
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

    private removeTag(index: number): void {
        this.program.tags.splice(index, 1);
    }

}
