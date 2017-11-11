import { Channel } from './channel';

export class User {
    email: string;

    constructor(email: string) {
        this.email = email.trim();
    }

    canEdit(channel: Channel): boolean {
        return channel.belongsTo(this) || channel.sharedWith(this);
    }

    canShare(channel: Channel): boolean {
        return channel.belongsTo(this);
    }

    canDelete(channel: Channel): boolean {
        return channel.belongsTo(this);
    }

    get encodedEmail(): string {
        // https://firebase.google.com/docs/reference/security/database/#replacesubstring_replacement
        // https://groups.google.com/forum/#!topic/firebase-talk/vtX8lfxxShk
        return this.email.replace('.', '%2E');
    }
}

export class AuthUser extends User {
    name: string;
    uid: string;
    provider: string;
    avatar: string;

    constructor(uid: string, name: string, email: string, provider: string, avatar?: string) {
        super(email);
        this.uid = uid;
        this.name = name;
        this.provider = provider;
        this.avatar = avatar;
    }
}
