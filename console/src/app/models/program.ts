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
    channelId: string;
    day: number;
    name: string;
    content: string;

    tags?: Array<Tag>;
    link?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;

    constructor(day: number, name: string, content: string) {
        this.day = day;
        this.name = name;
        this.content = content;
        this.tags = [];
    }

    static fromFirebase(id: string, values: any): Program {
        const program = new Program(values.day, values.name, values.content);
        program.id = id;
        program.tags = values.tags !== undefined ? values.tags.map(v => new Tag(v.name)) : [];
        program.link = values.link || undefined;
        program.startTime = values.startTime || undefined;
        program.endTime = values.endTime || undefined;
        program.startDate = values.startDate || undefined;
        program.endDate = values.endDate || undefined;
        console.log('fromFirebase:', program);
        return program;
    }

    toFirebase(): Program {
        const program = new Program(this.day, this.name, this.content);
        program.id = null;
        program.channelId = null;
        program.startTime = this.startTime || null;
        program.endTime = this.endTime || null;
        program.tags = this.tags || [];
        program.link = this.link || null;
        program.startDate = this.startDate || null;
        program.endDate = this.endDate || null;
        return program;
    }


}

type Programs = Array<Program>;

export class ProgramTable extends Array<Programs> {

    constructor(programs?: Programs) {
        const columns = [[], [], [], [], [], [], []];

        let maxSize = 0;
        programs.forEach((program: Program) => {
            columns[program.day].push(program);
            maxSize = Math.max(maxSize, columns[program.day].length);
        });

        // Sort programs by start time
        columns.forEach((_, index) => {
            // sort by start time
            columns[index].sort((x: Program, y: Program) => {
                if (x.startTime && y.startTime) {
                    return x.startTime < y.startTime ? -1 : 1;
                } else if (x.startTime && !y.startTime) {
                    return -1;
                } else if (!x.startTime && y.startTime) {
                    return 1;
                }
                return 0;
            });
        });

        const rows = Array.from(Array(maxSize)).map((_, i) => {
            return columns.map((__, j) => columns[j][i]);
        });

        super(...rows);
        Object.setPrototypeOf(this, Object.create(ProgramTable.prototype));
    }

}
