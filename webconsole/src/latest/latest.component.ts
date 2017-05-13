import { Component } from '@angular/core';
import { Channel } from '../shared/channel';

declare var require: any;

@Component({
    selector: 'latest',
    template: require('./latest.html')
})

export class LatestComponent {

    // state
    private channels: Array<Channel>;

    constructor() {
        this.channels = [
            new Channel('mkfsn', 'mkfsn'),
            new Channel('akb48group', 'AKB48Group番組'),
            new Channel('seiyuu_radio', '声優ラジオ'),
            new Channel('acchan', 'あっちゃん'),
            new Channel('anime', 'アニメ'),
            new Channel('mizukinana', '水樹奈々'),
            new Channel('JapanTVprogram', '日本テレビ番組'),
            new Channel('', ''),
            new Channel('', ''),
            new Channel('', '')
        ];
    }
}
