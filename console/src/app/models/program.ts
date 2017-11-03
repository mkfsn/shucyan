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
    channelId: string;
    day: number;
    title: string;
    content: string;

    tags?: Array<Tag>;
    link?: string;
    time?: Array<Time>;
    startedAt?: Date;
    endedAt?: Date;
    startTime?: string;
    endTime?: string;

    constructor(day: number, title: string, content: string) {
        this.day = day;
        this.title = title;
        this.content = content;
    }
}
