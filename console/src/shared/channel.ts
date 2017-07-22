import { Program } from './program';

export class Channel {
    id: string;
    title: string;
    owner: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    programs: Array<Program>;

    constructor(id: string, title: string, owner: string, description?: string, programs?: Array<Program>, createdAt?: Date) {
        this.id = id;
        this.title = title;
        this.owner = owner;
        this.description = description || '';
        this.programs = programs || [];
        this.createdAt = createdAt || new Date();
    }
}

export let NullChannel = new Channel(undefined, undefined, undefined);
