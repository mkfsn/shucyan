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

    static fromFirebase(id: string, name: string, description: string, owner: string): Channel {
        const channel = new Channel(name, description);
        channel.id = id;
        channel.owner = owner;
        return channel;
    }

    addCollaborator(email: string): void {
    }

    removeCollaborator(email: string): void {
    }

}

export let NullChannel = new Channel(undefined, undefined);
