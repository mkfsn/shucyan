class Time {
    // TODO: Supoort hour > 23?
    hour: number;
    minute: number;
}

export class Tag {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class Program {
    id: number;
    channelId: number;
    day: number;
    title: string;
    content: string;
    tags: Array<Tag>;
    link?: string;
    time?: Array<Time>;
    startedAt?: Date;
    endedAt?: Date;

    constructor(day: number, title: string, content: string, tags?: Array<Tag>, link?: string, time?, startedAt?, endedAt?) {
        this.day = day;
        this.title = title;
        this.content = content;
        this.tags = tags || [];
        this.link = link || '';
        this.time = time || [];
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }
}
