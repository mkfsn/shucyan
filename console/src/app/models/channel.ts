import { Program } from './program';

export class Channel {
    id: string;
    name: string;
    owner: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    programs: Array<Program>;

    constructor(id: string, name: string, owner: string, description?: string, programs?: Array<Program>, createdAt?: Date) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.description = description || '';
        this.programs = programs || [];
        this.createdAt = createdAt || new Date();
    }
}

export let NullChannel = new Channel(undefined, undefined, undefined);
