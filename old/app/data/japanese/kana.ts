// Japanese kana (monographs) with romaji readings.

export interface Kana {
    char: string;
    romaji: string;
}

export interface KanaChars {
    voiceless: Kana[];
    voiced: Kana[];
    contracted: Kana[];
}

export type KanaSetId = 'hiragana' | 'katakana';

const HIRAGANA_CHARS: KanaChars = {
    voiceless: [
        // a-row
        { char: 'あ', romaji: 'a' },
        { char: 'い', romaji: 'i' },
        { char: 'う', romaji: 'u' },
        { char: 'え', romaji: 'e' },
        { char: 'お', romaji: 'o' },
        // ka-row
        { char: 'か', romaji: 'ka' },
        { char: 'き', romaji: 'ki' },
        { char: 'く', romaji: 'ku' },
        { char: 'け', romaji: 'ke' },
        { char: 'こ', romaji: 'ko' },
        // sa-row
        { char: 'さ', romaji: 'sa' },
        { char: 'し', romaji: 'shi' },
        { char: 'す', romaji: 'su' },
        { char: 'せ', romaji: 'se' },
        { char: 'そ', romaji: 'so' },
        // ta-row
        { char: 'た', romaji: 'ta' },
        { char: 'ち', romaji: 'chi' },
        { char: 'つ', romaji: 'tsu' },
        { char: 'て', romaji: 'te' },
        { char: 'と', romaji: 'to' },
        // na-row
        { char: 'な', romaji: 'na' },
        { char: 'に', romaji: 'ni' },
        { char: 'ぬ', romaji: 'nu' },
        { char: 'ね', romaji: 'ne' },
        { char: 'の', romaji: 'no' },
        // ha-row
        { char: 'は', romaji: 'ha' },
        { char: 'ひ', romaji: 'hi' },
        { char: 'ふ', romaji: 'fu' },
        { char: 'へ', romaji: 'he' },
        { char: 'ほ', romaji: 'ho' },
        // ma-row
        { char: 'ま', romaji: 'ma' },
        { char: 'み', romaji: 'mi' },
        { char: 'む', romaji: 'mu' },
        { char: 'め', romaji: 'me' },
        { char: 'も', romaji: 'mo' },
        // ya-row (yi and ye do not exist)
        { char: 'や', romaji: 'ya' },
        { char: '', romaji: '' },
        { char: 'ゆ', romaji: 'yu' },
        { char: '', romaji: '' },
        { char: 'よ', romaji: 'yo' },
        // ra-row
        { char: 'ら', romaji: 'ra' },
        { char: 'り', romaji: 'ri' },
        { char: 'る', romaji: 'ru' },
        { char: 'れ', romaji: 're' },
        { char: 'ろ', romaji: 'ro' },
        // wa-row + n (wi and we do not exist)
        { char: 'わ', romaji: 'wa' },
        { char: '', romaji: '' },
        { char: 'を', romaji: 'wo' },
        { char: '', romaji: '' },
        { char: 'ん', romaji: 'n' },
    ],
    voiced: [
        // ga-row
        { char: 'が', romaji: 'ga' },
        { char: 'ぎ', romaji: 'gi' },
        { char: 'ぐ', romaji: 'gu' },
        { char: 'げ', romaji: 'ge' },
        { char: 'ご', romaji: 'go' },
        // za-row
        { char: 'ざ', romaji: 'za' },
        { char: 'じ', romaji: 'ji' },
        { char: 'ず', romaji: 'zu' },
        { char: 'ぜ', romaji: 'ze' },
        { char: 'ぞ', romaji: 'zo' },
        // da-row
        { char: 'だ', romaji: 'da' },
        { char: 'ぢ', romaji: 'ji' },
        { char: 'づ', romaji: 'zu' },
        { char: 'で', romaji: 'de' },
        { char: 'ど', romaji: 'do' },
        // ba-row
        { char: 'ば', romaji: 'ba' },
        { char: 'び', romaji: 'bi' },
        { char: 'ぶ', romaji: 'bu' },
        { char: 'べ', romaji: 'be' },
        { char: 'ぼ', romaji: 'bo' },
        // pa-row
        { char: 'ぱ', romaji: 'pa' },
        { char: 'ぴ', romaji: 'pi' },
        { char: 'ぷ', romaji: 'pu' },
        { char: 'ぺ', romaji: 'pe' },
        { char: 'ぽ', romaji: 'po' },
    ],
    contracted: [
        // kya-row
        { char: 'きゃ', romaji: 'kya' },
        { char: 'きゅ', romaji: 'kyu' },
        { char: 'きょ', romaji: 'kyo' },
        // sha-row
        { char: 'しゃ', romaji: 'sha' },
        { char: 'しゅ', romaji: 'shu' },
        { char: 'しょ', romaji: 'sho' },
        // cha-row
        { char: 'ちゃ', romaji: 'cha' },
        { char: 'ちゅ', romaji: 'chu' },
        { char: 'ちょ', romaji: 'cho' },
        // nya-row
        { char: 'にゃ', romaji: 'nya' },
        { char: 'にゅ', romaji: 'nyu' },
        { char: 'にょ', romaji: 'nyo' },
        // hya-row
        { char: 'ひゃ', romaji: 'hya' },
        { char: 'ひゅ', romaji: 'hyu' },
        { char: 'ひょ', romaji: 'hyo' },
        // mya-row
        { char: 'みゃ', romaji: 'mya' },
        { char: 'みゅ', romaji: 'myu' },
        { char: 'みょ', romaji: 'myo' },
        // rya-row
        { char: 'りゃ', romaji: 'rya' },
        { char: 'りゅ', romaji: 'ryu' },
        { char: 'りょ', romaji: 'ryo' },
        // gya-row
        { char: 'ぎゃ', romaji: 'gya' },
        { char: 'ぎゅ', romaji: 'gyu' },
        { char: 'ぎょ', romaji: 'gyo' },
        // ja-row
        { char: 'じゃ', romaji: 'ja' },
        { char: 'じゅ', romaji: 'ju' },
        { char: 'じょ', romaji: 'jo' },
        // bya-row
        { char: 'びゃ', romaji: 'bya' },
        { char: 'びゅ', romaji: 'byu' },
        { char: 'びょ', romaji: 'byo' },
        // pya-row
        { char: 'ぴゃ', romaji: 'pya' },
        { char: 'ぴゅ', romaji: 'pyu' },
        { char: 'ぴょ', romaji: 'pyo' },
    ],
};

const KATAKANA_CHARS: KanaChars = {
    voiceless: [
        // a-row
        { char: 'ア', romaji: 'a' },
        { char: 'イ', romaji: 'i' },
        { char: 'ウ', romaji: 'u' },
        { char: 'エ', romaji: 'e' },
        { char: 'オ', romaji: 'o' },
        // ka-row
        { char: 'カ', romaji: 'ka' },
        { char: 'キ', romaji: 'ki' },
        { char: 'ク', romaji: 'ku' },
        { char: 'ケ', romaji: 'ke' },
        { char: 'コ', romaji: 'ko' },
        // sa-row
        { char: 'サ', romaji: 'sa' },
        { char: 'シ', romaji: 'shi' },
        { char: 'ス', romaji: 'su' },
        { char: 'セ', romaji: 'se' },
        { char: 'ソ', romaji: 'so' },
        // ta-row
        { char: 'タ', romaji: 'ta' },
        { char: 'チ', romaji: 'chi' },
        { char: 'ツ', romaji: 'tsu' },
        { char: 'テ', romaji: 'te' },
        { char: 'ト', romaji: 'to' },
        // na-row
        { char: 'ナ', romaji: 'na' },
        { char: 'ニ', romaji: 'ni' },
        { char: 'ヌ', romaji: 'nu' },
        { char: 'ネ', romaji: 'ne' },
        { char: 'ノ', romaji: 'no' },
        // ha-row
        { char: 'ハ', romaji: 'ha' },
        { char: 'ヒ', romaji: 'hi' },
        { char: 'フ', romaji: 'fu' },
        { char: 'ヘ', romaji: 'he' },
        { char: 'ホ', romaji: 'ho' },
        // ma-row
        { char: 'マ', romaji: 'ma' },
        { char: 'ミ', romaji: 'mi' },
        { char: 'ム', romaji: 'mu' },
        { char: 'メ', romaji: 'me' },
        { char: 'モ', romaji: 'mo' },
        // ya-row (yi and ye do not exist)
        { char: 'ヤ', romaji: 'ya' },
        { char: '', romaji: '' },
        { char: 'ユ', romaji: 'yu' },
        { char: '', romaji: '' },
        { char: 'ヨ', romaji: 'yo' },
        // ra-row
        { char: 'ラ', romaji: 'ra' },
        { char: 'リ', romaji: 'ri' },
        { char: 'ル', romaji: 'ru' },
        { char: 'レ', romaji: 're' },
        { char: 'ロ', romaji: 'ro' },
        // wa-row + n (wi and we do not exist)
        { char: 'ワ', romaji: 'wa' },
        { char: '', romaji: '' },
        { char: 'ヲ', romaji: 'wo' },
        { char: '', romaji: '' },
        { char: 'ン', romaji: 'n' },
    ],
    voiced: [
        // ga-row
        { char: 'ガ', romaji: 'ga' },
        { char: 'ギ', romaji: 'gi' },
        { char: 'グ', romaji: 'gu' },
        { char: 'ゲ', romaji: 'ge' },
        { char: 'ゴ', romaji: 'go' },
        // za-row
        { char: 'ザ', romaji: 'za' },
        { char: 'ジ', romaji: 'ji' },
        { char: 'ズ', romaji: 'zu' },
        { char: 'ゼ', romaji: 'ze' },
        { char: 'ゾ', romaji: 'zo' },
        // da-row
        { char: 'ダ', romaji: 'da' },
        { char: 'ヂ', romaji: 'ji' },
        { char: 'ヅ', romaji: 'zu' },
        { char: 'デ', romaji: 'de' },
        { char: 'ド', romaji: 'do' },
        // ba-row
        { char: 'バ', romaji: 'ba' },
        { char: 'ビ', romaji: 'bi' },
        { char: 'ブ', romaji: 'bu' },
        { char: 'ベ', romaji: 'be' },
        { char: 'ボ', romaji: 'bo' },
        // pa-row
        { char: 'パ', romaji: 'pa' },
        { char: 'ピ', romaji: 'pi' },
        { char: 'プ', romaji: 'pu' },
        { char: 'ペ', romaji: 'pe' },
        { char: 'ポ', romaji: 'po' },
    ],
    contracted: [
        // kya-row
        { char: 'キャ', romaji: 'kya' },
        { char: 'キュ', romaji: 'kyu' },
        { char: 'キョ', romaji: 'kyo' },
        // sha-row
        { char: 'シャ', romaji: 'sha' },
        { char: 'シュ', romaji: 'shu' },
        { char: 'ショ', romaji: 'sho' },
        // cha-row
        { char: 'チャ', romaji: 'cha' },
        { char: 'チュ', romaji: 'chu' },
        { char: 'チョ', romaji: 'cho' },
        // nya-row
        { char: 'ニャ', romaji: 'nya' },
        { char: 'ニュ', romaji: 'nyu' },
        { char: 'ニョ', romaji: 'nyo' },
        // hya-row
        { char: 'ヒャ', romaji: 'hya' },
        { char: 'ヒュ', romaji: 'hyu' },
        { char: 'ヒョ', romaji: 'hyo' },
        // mya-row
        { char: 'ミャ', romaji: 'mya' },
        { char: 'ミュ', romaji: 'myu' },
        { char: 'ミョ', romaji: 'myo' },
        // rya-row
        { char: 'リャ', romaji: 'rya' },
        { char: 'リュ', romaji: 'ryu' },
        { char: 'リョ', romaji: 'ryo' },
        // gya-row
        { char: 'ギャ', romaji: 'gya' },
        { char: 'ギュ', romaji: 'gyu' },
        { char: 'ギョ', romaji: 'gyo' },
        // ja-row
        { char: 'ジャ', romaji: 'ja' },
        { char: 'ジュ', romaji: 'ju' },
        { char: 'ジョ', romaji: 'jo' },
        // bya-row
        { char: 'ビャ', romaji: 'bya' },
        { char: 'ビュ', romaji: 'byu' },
        { char: 'ビョ', romaji: 'byo' },
        // pya-row
        { char: 'ピャ', romaji: 'pya' },
        { char: 'ピュ', romaji: 'pyu' },
        { char: 'ピョ', romaji: 'pyo' },
    ],
};

export const KANA_CHARS: Record<KanaSetId, KanaChars> = {
    hiragana: HIRAGANA_CHARS,
    katakana: KATAKANA_CHARS,
};

function flatten(chars: KanaChars): Kana[] {
    return [...chars.voiceless, ...chars.voiced, ...chars.contracted];
}

export const KANA_SETS: Record<KanaSetId, Kana[]> = {
    hiragana: flatten(HIRAGANA_CHARS),
    katakana: flatten(KATAKANA_CHARS),
};

export const KANA_SET_IDS: KanaSetId[] = ['hiragana', 'katakana'];
