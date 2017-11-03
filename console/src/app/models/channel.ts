import { Program } from './program';

export class Channel {
    id: string;
    name: string;
    owner: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    programs: Array<Program>;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
		if (name === undefined && description === undefined) {
			return;
		}
        this.createdAt = new Date();
    }

	static fromFirebase(id: string, name: string, description: string, owner: string): Channel {
		let channel = new Channel(name, description);
		channel.id = id;
		channel.owner = owner;
		return channel;
	}
}

export let NullChannel = new Channel(undefined, undefined);
