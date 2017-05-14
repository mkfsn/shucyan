class Time {
    // TODO: Supoort hour > 23?
    hour: number;
    minute: number;
}

export class Program {
    day: number;
    title: string;
    content: string;
    tags: Array<string>;
    link?: string;
    startedAt?: Date;
    endedAt?: Date;
    time?: Array<Time>;

    constructor(day, title, content, tags, link?, startedAt?, endedAt?) {
        this.day = day;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.link = link;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }
}

export function getPrograms(channelId: string): Array<Program> {
    if (channelId !== 'anime') {
        return [];
    }
    return [
        new Program(0, 'ドラゴンボール超(スーパー)', '龍珠超', ['長番', '2015'], 'http://www.toei-anim.co.jp/tv/dragon_s/', new Date(2015, 7, 5)),
        new Program(0, 'アリスと蔵六', '愛麗絲與藏六 22:30 tokyoMX', ['春番', '2017'], 'http://www.alicetozouroku.com/', new Date(2017, 4, 2)),
        new Program(1, 'ゼロから始める魔法の書', '從零開始的魔法書 24:30 TokyoMX', ['春番', '2017'], 'http://zeronosyo.com/', new Date(2017, 4, 10)),
        new Program(2, 'ロクでなし魔術講師と禁忌教典', '不正經的魔術講師與禁忌教典 24:30 tokyoMX (水) 24:00 BS11', ['春番', '2017'], 'http://rokuaka.jp/', new Date(2017, 4, 4)),
        new Program(2, 'アイドルマスター シンデレラガールズ劇場', '灰姑娘女孩劇場 21:55 TOKYO MX', ['春番', '2017'], 'http://cingeki-anime.com/', new Date(2017, 4, 4)),
        new Program(3, '武装少女マキャヴェリズム', '武裝少女Machiavellianism 25:35 tokyoMX', ['春番', '2017'], 'http://machiavellism-anime.jp/', new Date(2017, 4, 5)),
        new Program(3, 'サクラダリセット', '重啟咲良田 23:30 tokyoMX', ['春番', '2017'], 'http://sagrada-anime.com/', new Date(2017, 4, 5)),
        new Program(3, 'サクラクエスト', 'SAKURA QUEST 24:00 tokyoMX', ['春番', '2017'], 'http://sakura-quest.com/', new Date(2017, 4 ,5)),
        new Program(4, '月がきれい', '月色真美 24:00 TokyoMX', ['春番', '2017'], 'http://tsukigakirei.jp/', new Date(2017, 4, 6)),
        new Program(4, 'クロックワーク・プラネット', '時鐘機關之星 25:58 TBS', ['春番', '2017'], 'http://www.tbs.co.jp/anime/cp/', new Date(2017, 4, 6)),
        new Program(5, '正解するカド', '正確的卡多 22:30 TokyoMX (火) 24:00 BSフジ', ['春番', '2017'], 'http://seikaisuru-kado.com/', new Date(2017, 4, 7)),
        new Program(5, 'ひなこのーと', '25:40', ['春番', '2017'], 'http://hinakonote.jp/', new Date(2017, 4, 9)),
        new Program(5, 'ソード・オラトリア', '劍姬神聖譚 24:30 TokyoMX', ['春番', '2017'], 'http://danmachi.com/sword_oratoria/', new Date(2017, 4, 14)),
        new Program(6, 'グランプルーファンタジー　ジ・アニメーション', '碧藍幻想 The Animation 24:00 TokyoMX', ['春番', '2017'], 'http://anime.granbluefantasy.jp/', new Date(2017, 4, 1)),
        new Program(6, 'BANG DREAM', '', ['春番', '2017'], '', new Date(2017, 4, 2)),
        new Program(6, 'Re:CREATORS', 'Re:CREATORS 23:30 TokyoMX', ['春番', '2017'], 'http://recreators.tv/', new Date(2017, 4, 8)),
        new Program(6, 'エロマンガ先生', '情色漫畫老師 24:30 TokyoMX', ['春番', '2017'], 'http://eromanga-sensei.com/', new Date(2017, 4, 8)),
        // new Program(0, '', '', [], '', new Date()),
    ];
}
