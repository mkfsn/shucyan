enum Mode {
    normal,
    edit
};

export class PageMode {

    private mode: Mode;

    constructor() {
        this.mode = Mode.normal;
    }

    get isEdit(): boolean {
        return this.mode === Mode.edit;
    }

    get isNormal(): boolean {
        return this.mode === Mode.normal;
    }

    public setEdit(): void {
        this.mode = Mode.edit;
    }

    public setNormal(): void {
        this.mode = Mode.normal;
    }
};
