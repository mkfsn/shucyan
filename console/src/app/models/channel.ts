import { Program } from './program';
import { User } from './user';

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
    createdAt: number;
    updatedAt: number;
    programs: Program[];
    collaborators: ICollaborators;
    starred: Email[];

    private user: User;

    constructor(name: string, description: string, user?: User) {
        this.id = null;
        this.name = name || '';
        this.owner = null;
        this.description = description || '';
        this.programs = [];
        this.collaborators = {};
        this.starred = [];

        if (name === undefined && description === undefined) {
            return;
        }

        this.createdAt = Date.now();
        this.updatedAt = null;

        this.user = user || null;
    }

    static fromFirebase(id: string, values: any, user?: User): Channel {
        const channel = new Channel(values.name, values.description, user);
        channel.id = id;
        channel.owner = values.owner;
        channel.collaborators = values.collaborators || {};
        channel.starred = values.starred || [];
        channel.createdAt = values.createdAt || 0;
        channel.updatedAt = values.updatedAt || 0;
        console.log('[fromFirebase]', channel);
        return channel;
    }

    static sort(channels: Channel[], keys: string[] = ['createdAt', 'updatedAt']): Channel[] {
        channels.sort((x: Channel, y: Channel) => {
            let result = 0;

            for (let key of keys) {
                let order = 1;
                if (key[0] === '-') {
                    order = -1;
                    key = key.slice(1, key.length);
                }

                if (x[key] === y[key]) {
                    continue;
                }

                result = order * (x[key] > y[key] ? -1 : 1);
                break;
            }

            return result;
        });
        return channels;
    }

    toFirebase(): Channel {
        const channel = new Channel(this.name, this.description);
        channel.id = null;
        channel.owner = this.owner;
        channel.createdAt = this.createdAt || 0;
        channel.updatedAt = this.updatedAt || 0;
        channel.programs = null;
        channel.collaborators = this.collaborators || null;
        channel.starred = this.starred || [];
        console.log('[toFirebase]', channel);
        return channel;
    }

    get allowToEdit(): boolean {
        return this.user && this.user.canEdit(this);
    }

    get allowToShare(): boolean {
        return this.user && this.user.canShare(this);
    }

    get allowToStar(): boolean {
        return this.user !== undefined && this.user !== null;
    }

    get allowToDelete(): boolean {
        return this.user && this.user.canDelete(this);
    }

    addCollaborators(...users: User[]): void {
        users.forEach(user => {
            this.collaborators[user.encodedEmail] = {
                editable: true
            };
        });
    }

    removeCollaborators(...users: User[]): void {
        users.forEach(user => {
            delete this.collaborators[user.encodedEmail];
        });
    }

    belongsTo(user: User): boolean {
        return user.encodedEmail === this.owner;
    }

    sharedWith(user: User): boolean {
        const collaborator = this.collaborators[user.encodedEmail];
        return collaborator && collaborator.editable;
    }

}

export let NullChannel = new Channel(undefined, undefined);
