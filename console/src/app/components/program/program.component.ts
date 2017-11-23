import * as chroma from 'chroma-js';
import swal from 'sweetalert2';

import { Component, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { ProgramsService } from '../../services/programs.service';
import { ColorService } from '../../services/color.service';

import { Tag, Program, ProgramTable } from '../../models/program';

@Component({
    selector: 'app-program',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnChanges {

    @Input() isEditMode: boolean;
    @Input() programs: Array<Program>;
    @Input() channelId: string;

    programTable: Array<Array<Program>>;
    namesOfDays: string[];

    // today's day of week
    private day: number;
    private datesOfWeek: Array<string>;

    // For adding/editing program
    program: Program;

    @ViewChild('programModal') public programModal: ModalDirective;
    @ViewChild('infoModal') public infoModal: ModalDirective;

    @ViewChild('programsContainer') programsContainer: ElementRef;

    optionOpen: boolean;
    inputTags: string;

    constructor(private programsService: ProgramsService, private colorService: ColorService) {
        this.day = (new Date()).getDay();
        this.datesOfWeek = this.programsService.dates;
        this.namesOfDays = ProgramsService.days;
        this.optionOpen = false;
        this.program = new Program(-1, '', '');
    }

    ngOnChanges(changes: any) {
        if (changes.programs) {
            this.programTable = new ProgramTable(this.programs);
            if (changes.programs.firstChange) {
                setTimeout(() => {
                    const element = this.programsContainer.nativeElement;
                    const offset = element.querySelector('.today').offsetLeft;
                    element.scrollLeft = offset - 14; // 14 = 1em
                });
            }
        }
    }

    private getColor(tag: string): string {
        return this.colorService.getColor(tag);
    }

    private isToday(day: number): boolean {
        return day === this.day;
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
            this.programTable = new ProgramTable(this.programs);
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

    saveProgram(): void {
        const update = this.program.id !== undefined;
        this.program.channelId = this.channelId;
        if (update) {
            this.updateProgram(this.program);
        } else {
            this.createProgram(this.program);
        }
    }

    private clickProgram(program: Program): void {
        const selection = window.getSelection();
        if (selection.toString().length !== 0) {
            // selection text, return
            return;
        }

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

    tryAddTags(inputTags: string): void {
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
                this.programTable = new ProgramTable(this.programs);
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
