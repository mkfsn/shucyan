import { Program } from './program';

type Email = string;


interface ICollaborator {
    editable: boolean;
}

interface ICollaborators {
    [email: string]: ICollaborator;
}

export class Channel {
    id: string;
    name: string;
    owner: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    programs: Program[];
    collaborators: ICollaborators;
    starred: Email[];

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        if (name === undefined && description === undefined) {
            return;
        }
        this.createdAt = new Date();
        this.starred = [];
        this.collaborators = {};
    }

    static fromFirebase(id: string, values: any): Channel {
        const channel = new Channel(values.name, values.description);
        channel.id = id;
        channel.owner = values.owner;
        channel.collaborators = values.collaborators || {};
        channel.starred = values.starred || [];
        channel.createdAt = values.createdAt || null;
        channel.updatedAt = values.updatedAt || null;
        console.log('fromFirebase:', channel);
        return channel;
    }

    addCollaborators(...emails: string[]): void {
        emails.forEach(email => {
            email = this.emailEncode(email);
            this.collaborators[email] = {
                editable: true
            };
        });
    }

    removeCollaborators(...emails: string[]): void {
        emails.forEach(email => {
            email = this.emailEncode(email);
            delete this.collaborators[email];
        });
    }

    isEditable(plainEmail: string) {
        const collaborator = this.findCollaborator(plainEmail);
        return (collaborator !== undefined && collaborator.editable) || this.owner === this.emailEncode(plainEmail);
    }

    findCollaborator(email: string): ICollaborator {
        email = this.emailEncode(email);
        return this.collaborators[email];
    }

    canShare(plainEmail: string): boolean {
        // TODO
        return true;
    }

    canEdit(plainEmail: string): boolean {
        // TODO
        return this.isEditable(plainEmail);
    }

    private emailEncode(plainEmail: string) {
        // https://firebase.google.com/docs/reference/security/database/#replacesubstring_replacement
        // https://groups.google.com/forum/#!topic/firebase-talk/vtX8lfxxShk
        return plainEmail.replace('.', '%2E');
    }

}

export let NullChannel = new Channel(undefined, undefined);
