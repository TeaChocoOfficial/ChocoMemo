// Japanese kana (monographs) with romaji readings.
import type { OptionsItem, ReadableChar } from '~/types/characters';

export interface KanaChars {
    voiceless: ReadableChar[];
    voiced: ReadableChar[];
    contracted: ReadableChar[];
}

export type KanaSetId = 'hiragana' | 'katakana';

const HIRAGANA_CHARS: KanaChars = {
    voiceless: [
        // a-row
        { char: 'あ', read: 'a', sound: 'a.mp3' },
        { char: 'い', read: 'i', sound: 'i.mp3' },
        { char: 'う', read: 'u', sound: 'u.mp3' },
        { char: 'え', read: 'e', sound: 'e.mp3' },
        { char: 'お', read: 'o', sound: 'o.mp3' },
        // ka-row
        { char: 'か', read: 'ka', sound: 'ka.mp3' },
        { char: 'き', read: 'ki', sound: 'ki.mp3' },
        { char: 'く', read: 'ku', sound: 'ku.mp3' },
        { char: 'け', read: 'ke', sound: 'ke.mp3' },
        { char: 'こ', read: 'ko', sound: 'ko.mp3' },
        // sa-row
        { char: 'さ', read: 'sa', sound: 'sa.mp3' },
        { char: 'し', read: 'shi', sound: 'shi.mp3' },
        { char: 'す', read: 'su', sound: 'su.mp3' },
        { char: 'せ', read: 'se', sound: 'se.mp3' },
        { char: 'そ', read: 'so', sound: 'so.mp3' },
        // ta-row
        { char: 'た', read: 'ta', sound: 'ta.mp3' },
        { char: 'ち', read: 'chi', sound: 'chi.mp3' },
        { char: 'つ', read: 'tsu', sound: 'tsu.mp3' },
        { char: 'て', read: 'te', sound: 'te.mp3' },
        { char: 'と', read: 'to', sound: 'to.mp3' },
        // na-row
        { char: 'な', read: 'na', sound: 'na.mp3' },
        { char: 'に', read: 'ni', sound: 'ni.mp3' },
        { char: 'ぬ', read: 'nu', sound: 'nu.mp3' },
        { char: 'ね', read: 'ne', sound: 'ne.mp3' },
        { char: 'の', read: 'no', sound: 'no.mp3' },
        // ha-row
        { char: 'は', read: 'ha', sound: 'ha.mp3' },
        { char: 'ひ', read: 'hi', sound: 'hi.mp3' },
        { char: 'ふ', read: 'fu', sound: 'fu.mp3' },
        { char: 'へ', read: 'he', sound: 'he.mp3' },
        { char: 'ほ', read: 'ho', sound: 'ho.mp3' },
        // ma-row
        { char: 'ま', read: 'ma', sound: 'ma.mp3' },
        { char: 'み', read: 'mi', sound: 'mi.mp3' },
        { char: 'む', read: 'mu', sound: 'mu.mp3' },
        { char: 'め', read: 'me', sound: 'me.mp3' },
        { char: 'も', read: 'mo', sound: 'mo.mp3' },
        // ya-row (yi and ye do not exist)
        { char: 'や', read: 'ya', sound: 'ya.mp3' },
        { char: '', read: '', sound: '' },
        { char: 'ゆ', read: 'yu', sound: 'yu.mp3' },
        { char: '', read: '', sound: '' },
        { char: 'よ', read: 'yo', sound: 'yo.mp3' },
        // ra-row
        { char: 'ら', read: 'ra', sound: 'ra.mp3' },
        { char: 'り', read: 'ri', sound: 'ri.mp3' },
        { char: 'る', read: 'ru', sound: 'ru.mp3' },
        { char: 'れ', read: 're', sound: 're.mp3' },
        { char: 'ろ', read: 'ro', sound: 'ro.mp3' },
        // wa-row + n (wi and we do not exist)
        { char: 'わ', read: 'wa', sound: 'wa.mp3' },
        { char: '', read: '', sound: '' },
        { char: 'を', read: 'wo', sound: 'wo.mp3' },
        { char: '', read: '', sound: '' },
        { char: 'ん', read: 'n', sound: 'n.mp3' },
    ],
    voiced: [
        // ga-row
        { char: 'が', read: 'ga', sound: 'ga.mp3' },
        { char: 'ぎ', read: 'gi', sound: 'gi.mp3' },
        { char: 'ぐ', read: 'gu', sound: 'gu.mp3' },
        { char: 'げ', read: 'ge', sound: 'ge.mp3' },
        { char: 'ご', read: 'go', sound: 'go.mp3' },
        // za-row
        { char: 'ざ', read: 'za', sound: 'za.mp3' },
        { char: 'じ', read: 'ji', sound: 'ji.mp3' },
        { char: 'ず', read: 'zu', sound: 'zu.mp3' },
        { char: 'ぜ', read: 'ze', sound: 'ze.mp3' },
        { char: 'ぞ', read: 'zo', sound: 'zo.mp3' },
        // da-row
        { char: 'だ', read: 'da', sound: 'da.mp3' },
        { char: 'ぢ', read: 'ji', sound: 'ji.mp3' },
        { char: 'づ', read: 'zu', sound: 'zu.mp3' },
        { char: 'で', read: 'de', sound: 'de.mp3' },
        { char: 'ど', read: 'do', sound: 'do.mp3' },
        // ba-row
        { char: 'ば', read: 'ba', sound: 'ba.mp3' },
        { char: 'び', read: 'bi', sound: 'bi.mp3' },
        { char: 'ぶ', read: 'bu', sound: 'bu.mp3' },
        { char: 'べ', read: 'be', sound: 'be.mp3' },
        { char: 'ぼ', read: 'bo', sound: 'bo.mp3' },
        // pa-row
        { char: 'ぱ', read: 'pa', sound: 'pa.mp3' },
        { char: 'ぴ', read: 'pi', sound: 'pi.mp3' },
        { char: 'ぷ', read: 'pu', sound: 'pu.mp3' },
        { char: 'ぺ', read: 'pe', sound: 'pe.mp3' },
        { char: 'ぽ', read: 'po', sound: 'po.mp3' },
    ],
    contracted: [
        // kya-row
        { char: 'きゃ', read: 'kya', sound: 'kya.mp3' },
        { char: 'きゅ', read: 'kyu', sound: 'kyu.mp3' },
        { char: 'きょ', read: 'kyo', sound: 'kyo.mp3' },
        // sha-row
        { char: 'しゃ', read: 'sha', sound: 'sha.mp3' },
        { char: 'しゅ', read: 'shu', sound: 'shu.mp3' },
        { char: 'しょ', read: 'sho', sound: 'sho.mp3' },
        // cha-row
        { char: 'ちゃ', read: 'cha', sound: 'cha.mp3' },
        { char: 'ちゅ', read: 'chu', sound: 'chu.mp3' },
        { char: 'ちょ', read: 'cho', sound: 'cho.mp3' },
        // nya-row
        { char: 'にゃ', read: 'nya', sound: 'nya.mp3' },
        { char: 'にゅ', read: 'nyu', sound: 'nyu.mp3' },
        { char: 'にょ', read: 'nyo', sound: 'nyo.mp3' },
        // hya-row
        { char: 'ひゃ', read: 'hya', sound: 'hya.mp3' },
        { char: 'ひゅ', read: 'hyu', sound: 'hyu.mp3' },
        { char: 'ひょ', read: 'hyo', sound: 'hyo.mp3' },
        // mya-row
        { char: 'みゃ', read: 'mya', sound: 'mya.mp3' },
        { char: 'みゅ', read: 'myu', sound: 'myu.mp3' },
        { char: 'みょ', read: 'myo', sound: 'myo.mp3' },
        // rya-row
        { char: 'りゃ', read: 'rya', sound: 'rya.mp3' },
        { char: 'りゅ', read: 'ryu', sound: 'ryu.mp3' },
        { char: 'りょ', read: 'ryo', sound: 'ryo.mp3' },
        // gya-row
        { char: 'ぎゃ', read: 'gya', sound: 'gya.mp3' },
        { char: 'ぎゅ', read: 'gyu', sound: 'gyu.mp3' },
        { char: 'ぎょ', read: 'gyo', sound: 'gyo.mp3' },
        // ja-row
        { char: 'じゃ', read: 'ja', sound: 'ja.mp3' },
        { char: 'じゅ', read: 'ju', sound: 'ju.mp3' },
        { char: 'じょ', read: 'jo', sound: 'jo.mp3' },
        // bya-row
        { char: 'びゃ', read: 'bya', sound: 'bya.mp3' },
        { char: 'びゅ', read: 'byu', sound: 'byu.mp3' },
        { char: 'びょ', read: 'byo', sound: 'byo.mp3' },
        // pya-row
        { char: 'ぴゃ', read: 'pya', sound: 'pya.mp3' },
        { char: 'ぴゅ', read: 'pyu', sound: 'pyu.mp3' },
        { char: 'ぴょ', read: 'pyo', sound: 'pyo.mp3' },
    ],
};

const KATAKANA_CHARS: KanaChars = {
    voiceless: [
        // a-row
        { char: 'ア', read: 'a', sound: 'a.mp3' },
        { char: 'イ', read: 'i', sound: 'i.mp3' },
        { char: 'ウ', read: 'u', sound: 'u.mp3' },
        { char: 'エ', read: 'e', sound: 'e.mp3' },
        { char: 'オ', read: 'o', sound: 'o.mp3' },
        // ka-row
        { char: 'カ', read: 'ka', sound: 'ka.mp3' },
        { char: 'キ', read: 'ki', sound: 'ki.mp3' },
        { char: 'ク', read: 'ku', sound: 'ku.mp3' },
        { char: 'ケ', read: 'ke', sound: 'ke.mp3' },
        { char: 'コ', read: 'ko', sound: 'ko.mp3' },
        // sa-row
        { char: 'サ', read: 'sa', sound: 'sa.mp3' },
        { char: 'シ', read: 'shi', sound: 'shi.mp3' },
        { char: 'ス', read: 'su', sound: 'su.mp3' },
        { char: 'セ', read: 'se', sound: 'se.mp3' },
        { char: 'ソ', read: 'so', sound: 'so.mp3' },
        // ta-row
        { char: 'タ', read: 'ta', sound: 'ta.mp3' },
        { char: 'チ', read: 'chi', sound: 'chi.mp3' },
        { char: 'ツ', read: 'tsu', sound: 'tsu.mp3' },
        { char: 'テ', read: 'te', sound: 'te.mp3' },
        { char: 'ト', read: 'to', sound: 'to.mp3' },
        // na-row
        { char: 'ナ', read: 'na', sound: 'na.mp3' },
        { char: 'ニ', read: 'ni', sound: 'ni.mp3' },
        { char: 'ヌ', read: 'nu', sound: 'nu.mp3' },
        { char: 'ネ', read: 'ne', sound: 'ne.mp3' },
        { char: 'ノ', read: 'no', sound: 'no.mp3' },
        // ha-row
        { char: 'ハ', read: 'ha', sound: 'ha.mp3' },
        { char: 'ヒ', read: 'hi', sound: 'hi.mp3' },
        { char: 'フ', read: 'fu', sound: 'fu.mp3' },
        { char: 'ヘ', read: 'he', sound: 'he.mp3' },
        { char: 'ホ', read: 'ho', sound: 'ho.mp3' },
        // ma-row
        { char: 'マ', read: 'ma', sound: 'ma.mp3' },
        { char: 'ミ', read: 'mi', sound: 'mi.mp3' },
        { char: 'ム', read: 'mu', sound: 'mu.mp3' },
        { char: 'メ', read: 'me', sound: 'me.mp3' },
        { char: 'モ', read: 'mo', sound: 'mo.mp3' },
        // ya-row (yi and ye do not exist)
        { char: 'ヤ', read: 'ya', sound: 'ya.mp3' },
        { char: '', read: '', sound: '' },
        { char: 'ユ', read: 'yu', sound: 'yu.mp3' },
        { char: '', read: '', sound: '' },
        { char: 'ヨ', read: 'yo', sound: 'yo.mp3' },
        // ra-row
        { char: 'ラ', read: 'ra', sound: 'ra.mp3' },
        { char: 'リ', read: 'ri', sound: 'ri.mp3' },
        { char: 'ル', read: 'ru', sound: 'ru.mp3' },
        { char: 'レ', read: 're', sound: 're.mp3' },
        { char: 'ロ', read: 'ro', sound: 'ro.mp3' },
        // wa-row + n (wi and we do not exist)
        { char: 'ワ', read: 'wa', sound: 'wa.mp3' },
        { char: '', read: '', sound: '' },
        { char: 'ヲ', read: 'wo', sound: 'wo.mp3' },
        { char: '', read: '', sound: '' },
        { char: 'ン', read: 'n', sound: 'n.mp3' },
    ],
    voiced: [
        // ga-row
        { char: 'ガ', read: 'ga', sound: 'ga.mp3' },
        { char: 'ギ', read: 'gi', sound: 'gi.mp3' },
        { char: 'グ', read: 'gu', sound: 'gu.mp3' },
        { char: 'ゲ', read: 'ge', sound: 'ge.mp3' },
        { char: 'ゴ', read: 'go', sound: 'go.mp3' },
        // za-row
        { char: 'ザ', read: 'za', sound: 'za.mp3' },
        { char: 'ジ', read: 'ji', sound: 'ji.mp3' },
        { char: 'ズ', read: 'zu', sound: 'zu.mp3' },
        { char: 'ゼ', read: 'ze', sound: 'ze.mp3' },
        { char: 'ゾ', read: 'zo', sound: 'zo.mp3' },
        // da-row
        { char: 'ダ', read: 'da', sound: 'da.mp3' },
        { char: 'ヂ', read: 'ji', sound: 'ji.mp3' },
        { char: 'ヅ', read: 'zu', sound: 'zu.mp3' },
        { char: 'デ', read: 'de', sound: 'de.mp3' },
        { char: 'ド', read: 'do', sound: 'do.mp3' },
        // ba-row
        { char: 'バ', read: 'ba', sound: 'ba.mp3' },
        { char: 'ビ', read: 'bi', sound: 'bi.mp3' },
        { char: 'ブ', read: 'bu', sound: 'bu.mp3' },
        { char: 'ベ', read: 'be', sound: 'be.mp3' },
        { char: 'ボ', read: 'bo', sound: 'bo.mp3' },
        // pa-row
        { char: 'パ', read: 'pa', sound: 'pa.mp3' },
        { char: 'ピ', read: 'pi', sound: 'pi.mp3' },
        { char: 'プ', read: 'pu', sound: 'pu.mp3' },
        { char: 'ペ', read: 'pe', sound: 'pe.mp3' },
        { char: 'ポ', read: 'po', sound: 'po.mp3' },
    ],
    contracted: [
        // kya-row
        { char: 'キャ', read: 'kya', sound: 'kya.mp3' },
        { char: 'キュ', read: 'kyu', sound: 'kyu.mp3' },
        { char: 'キョ', read: 'kyo', sound: 'kyo.mp3' },
        // sha-row
        { char: 'シャ', read: 'sha', sound: 'sha.mp3' },
        { char: 'シュ', read: 'shu', sound: 'shu.mp3' },
        { char: 'ショ', read: 'sho', sound: 'sho.mp3' },
        // cha-row
        { char: 'チャ', read: 'cha', sound: 'cha.mp3' },
        { char: 'チュ', read: 'chu', sound: 'chu.mp3' },
        { char: 'チョ', read: 'cho', sound: 'cho.mp3' },
        // nya-row
        { char: 'ニャ', read: 'nya', sound: 'nya.mp3' },
        { char: 'ニュ', read: 'nyu', sound: 'nyu.mp3' },
        { char: 'ニョ', read: 'nyo', sound: 'nyo.mp3' },
        // hya-row
        { char: 'ヒャ', read: 'hya', sound: 'hya.mp3' },
        { char: 'ヒュ', read: 'hyu', sound: 'hyu.mp3' },
        { char: 'ヒョ', read: 'hyo', sound: 'hyo.mp3' },
        // mya-row
        { char: 'ミャ', read: 'mya', sound: 'mya.mp3' },
        { char: 'ミュ', read: 'myu', sound: 'myu.mp3' },
        { char: 'ミョ', read: 'myo', sound: 'myo.mp3' },
        // rya-row
        { char: 'リャ', read: 'rya', sound: 'rya.mp3' },
        { char: 'リュ', read: 'ryu', sound: 'ryu.mp3' },
        { char: 'リョ', read: 'ryo', sound: 'ryo.mp3' },
        // gya-row
        { char: 'ギャ', read: 'gya', sound: 'gya.mp3' },
        { char: 'ギュ', read: 'gyu', sound: 'gyu.mp3' },
        { char: 'ギョ', read: 'gyo', sound: 'gyo.mp3' },
        // ja-row
        { char: 'ジャ', read: 'ja', sound: 'ja.mp3' },
        { char: 'ジュ', read: 'ju', sound: 'ju.mp3' },
        { char: 'ジョ', read: 'jo', sound: 'jo.mp3' },
        // bya-row
        { char: 'ビャ', read: 'bya', sound: 'bya.mp3' },
        { char: 'ビュ', read: 'byu', sound: 'byu.mp3' },
        { char: 'ビョ', read: 'byo', sound: 'byo.mp3' },
        // pya-row
        { char: 'ピャ', read: 'pya', sound: 'pya.mp3' },
        { char: 'ピュ', read: 'pyu', sound: 'pyu.mp3' },
        { char: 'ピョ', read: 'pyo', sound: 'pyo.mp3' },
    ],
};

export const KANA_CHARS: OptionsItem<'ja'> = {
    hiragana: HIRAGANA_CHARS,
    katakana: KATAKANA_CHARS,
};

function flatten(chars: KanaChars): ReadableChar[] {
    return [...chars.voiceless, ...chars.voiced, ...chars.contracted];
}

export const KANA_SETS: Record<KanaSetId, ReadableChar[]> = {
    hiragana: flatten(HIRAGANA_CHARS),
    katakana: flatten(KATAKANA_CHARS),
};

export const KANA_SET_IDS: KanaSetId[] = ['hiragana', 'katakana'];
