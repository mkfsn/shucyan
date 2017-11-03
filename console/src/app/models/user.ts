export class User {
    name: string;
    email: string;
    uid: string;
    provider: string;
    avatar: string;

    constructor(uid: string, name: string, email: string, provider: string, avatar?: string) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.provider = provider;
        this.avatar = avatar;
    }
}
