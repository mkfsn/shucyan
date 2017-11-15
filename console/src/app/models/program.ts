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
        program.startTime = values.startTime;
        program.endTime = values.endTime;
        program.startDate = values.startDate;
        program.endDate = values.endDate;
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

        const rows = Array.from(Array(maxSize)).map((_, i) => {
            return columns.map((__, j) => columns[j][i]);
        });

        super(...rows);
        Object.setPrototypeOf(this, Object.create(ProgramTable.prototype));
    }

}
