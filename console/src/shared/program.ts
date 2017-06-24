class Time {
    // TODO: Supoort hour > 23?
    hour: number;
    minute: number;
}

export class Program {
    id: number;
    channelId: number;
    day: number;
    title: string;
    content: string;
    tags: Array<string>;
    link?: string;
    startedAt?: Date;
    endedAt?: Date;
    time?: Array<Time>;

    constructor(day, title, content, tags, link?, startedAt?, endedAt?) {
        this.day = day;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.link = link;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }
}
