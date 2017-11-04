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
    id: string;
    // deprecated?
    channelId: string;
    day: number;
    name: string;
    content: string;

    tags?: Array<Tag>;
    link?: string;
    time?: Array<Time>;
    startedAt?: Date;
    endedAt?: Date;
    startTime?: string;
    endTime?: string;

    constructor(day: number, name: string, content: string) {
        this.day = day;
        this.name = name;
        this.content = content;
        this.tags = [];
    }

    static fromFirebase(id: string, day: number, name: string, content: string): Program {
        const program = new Program(day, name, content);
        program.id = id;
        return program;
    }
}
