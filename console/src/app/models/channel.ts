import { Program } from './program';

type Email = string;

export class Channel {
    id: string;
    name: string;
    owner: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    programs: Program[];
    collaborators: Email[];
    starred: Email[];

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        if (name === undefined && description === undefined) {
            return;
        }
        this.createdAt = new Date();
        this.starred = [];
        this.collaborators = [];
    }

    static fromFirebase(id: string, values: any): Channel {
        const channel = new Channel(values.name, values.description);
        channel.id = id;
        channel.owner = values.owner;
        channel.collaborators = values.collaborators || [];
        channel.starred = values.starred || [];
        channel.createdAt = values.createdAt || null;
        channel.updatedAt = values.updatedAt || null;
        console.log('fromFirebase:', channel);
        return channel;
    }

    addCollaborator(email: string): void {
    }

    removeCollaborator(email: string): void {
    }

}

export let NullChannel = new Channel(undefined, undefined);
