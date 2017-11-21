export type EventAction =  'create' | 'update' | 'delete';

export type EventTarget =  'program' | 'channel';

export class Event {

    // user who trigger this event
    email: string;

    // timestamp of this event occurs
    timestamp: number;

    // target of the event
    target: string;

    // action of the event
    action: string;

    // data changed before and after this event
    before: string;
    after: string;

    constructor(email?: string, action?: EventAction, target?: EventTarget, before?: string, after?: string) {
        this.timestamp = Date.now();
        this.email = email;
        this.action = action;
        this.target = target;
        this.before = before;
        this.after = after;
    }

    static fromFirebase(values: any): Event {
        const event = new Event(values.email, values.action, values.target, values.before, values.after);
        event.timestamp = values.timestamp;
        return event;
    }

}
