export class Channel {
    id: string;
    name: string;
    owner: string;
    description: string;
    createdAt: Date;
    modifiedAt: Date;

    constructor(id: string, name: string, owner: string, description?: string, createdAt?: Date) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.description = description || '';
        this.createdAt = createdAt || new Date();
    }

    static getDefault(): Array<Channel> {
        return [
            new Channel('mkfsn', 'mkfsn', 'mkfsn', 'About mkfsn'),
            new Channel('akb48group', 'AKB48Group番組', 'mkfsn', 'AKB、SKE、NMB、HKTのTV番組、ラジオ．．．など。'),
            new Channel('seiyuu_radio', '声優ラジオ', 'mkfsn', '声優さんのラジオ'),
            new Channel('acchan', 'あっちゃん', 'mkfsn', 'About acchan'),
            new Channel('anime', 'アニメ', 'mkfsn', 'アニメ番組表'),
            new Channel('mizukinana', '水樹奈々', 'mkfsn'),
            new Channel('JapanTVprogram', '日本テレビ番組', 'mkfsn')
        ];
    }
}
