import { Program } from './program';

export class Channel {
    id: string;
    title: string;
    owner: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    programs: Array<Program>;

    static fromJSON(data: Array<any>): Array<Channel> {
        let channels: Array<Channel>;
        return data.map((ch) => {
            let programs: Array<Program> = ch.programs.map((pg) => {
                return new Program(pg.day, pg.title, pg.content, pg.tags, pg.link, pg.startedAt);
            });
            return new Channel(ch.id, ch.title, ch.owner, ch.description, programs);
        })
    }

    constructor(id: string, title: string, owner: string, description?: string, programs?: Array<Program>, createdAt?: Date) {
        this.id = id;
        this.title = title;
        this.owner = owner;
        this.description = description || '';
        this.programs = programs || [];
        this.createdAt = createdAt || new Date();
    }
}
