export class Channel {
    id: string;
    name: string;
    createdAt: Date;
    modifiedAt: Date;

    constructor(id: string, name: string, createdAt?: Date) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt ? createdAt : new Date();
    }
}
