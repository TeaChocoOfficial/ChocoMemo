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
        { char: 'あ', read: 'a' },
        { char: 'い', read: 'i' },
        { char: 'う', read: 'u' },
        { char: 'え', read: 'e' },
        { char: 'お', read: 'o' },
        // ka-row
        { char: 'か', read: 'ka' },
        { char: 'き', read: 'ki' },
        { char: 'く', read: 'ku' },
        { char: 'け', read: 'ke' },
        { char: 'こ', read: 'ko' },
        // sa-row
        { char: 'さ', read: 'sa' },
        { char: 'し', read: 'shi' },
        { char: 'す', read: 'su' },
        { char: 'せ', read: 'se' },
        { char: 'そ', read: 'so' },
        // ta-row
        { char: 'た', read: 'ta' },
        { char: 'ち', read: 'chi' },
        { char: 'つ', read: 'tsu' },
        { char: 'て', read: 'te' },
        { char: 'と', read: 'to' },
        // na-row
        { char: 'な', read: 'na' },
        { char: 'に', read: 'ni' },
        { char: 'ぬ', read: 'nu' },
        { char: 'ね', read: 'ne' },
        { char: 'の', read: 'no' },
        // ha-row
        { char: 'は', read: 'ha' },
        { char: 'ひ', read: 'hi' },
        { char: 'ふ', read: 'fu' },
        { char: 'へ', read: 'he' },
        { char: 'ほ', read: 'ho' },
        // ma-row
        { char: 'ま', read: 'ma' },
        { char: 'み', read: 'mi' },
        { char: 'む', read: 'mu' },
        { char: 'め', read: 'me' },
        { char: 'も', read: 'mo' },
        // ya-row (yi and ye do not exist)
        { char: 'や', read: 'ya' },
        { char: '', read: '' },
        { char: 'ゆ', read: 'yu' },
        { char: '', read: '' },
        { char: 'よ', read: 'yo' },
        // ra-row
        { char: 'ら', read: 'ra' },
        { char: 'り', read: 'ri' },
        { char: 'る', read: 'ru' },
        { char: 'れ', read: 're' },
        { char: 'ろ', read: 'ro' },
        // wa-row + n (wi and we do not exist)
        { char: 'わ', read: 'wa' },
        { char: '', read: '' },
        { char: 'を', read: 'wo' },
        { char: '', read: '' },
        { char: 'ん', read: 'n' },
    ],
    voiced: [
        // ga-row
        { char: 'が', read: 'ga' },
        { char: 'ぎ', read: 'gi' },
        { char: 'ぐ', read: 'gu' },
        { char: 'げ', read: 'ge' },
        { char: 'ご', read: 'go' },
        // za-row
        { char: 'ざ', read: 'za' },
        { char: 'じ', read: 'ji' },
        { char: 'ず', read: 'zu' },
        { char: 'ぜ', read: 'ze' },
        { char: 'ぞ', read: 'zo' },
        // da-row
        { char: 'だ', read: 'da' },
        { char: 'ぢ', read: 'ji' },
        { char: 'づ', read: 'zu' },
        { char: 'で', read: 'de' },
        { char: 'ど', read: 'do' },
        // ba-row
        { char: 'ば', read: 'ba' },
        { char: 'び', read: 'bi' },
        { char: 'ぶ', read: 'bu' },
        { char: 'べ', read: 'be' },
        { char: 'ぼ', read: 'bo' },
        // pa-row
        { char: 'ぱ', read: 'pa' },
        { char: 'ぴ', read: 'pi' },
        { char: 'ぷ', read: 'pu' },
        { char: 'ぺ', read: 'pe' },
        { char: 'ぽ', read: 'po' },
    ],
    contracted: [
        // kya-row
        { char: 'きゃ', read: 'kya' },
        { char: 'きゅ', read: 'kyu' },
        { char: 'きょ', read: 'kyo' },
        // sha-row
        { char: 'しゃ', read: 'sha' },
        { char: 'しゅ', read: 'shu' },
        { char: 'しょ', read: 'sho' },
        // cha-row
        { char: 'ちゃ', read: 'cha' },
        { char: 'ちゅ', read: 'chu' },
        { char: 'ちょ', read: 'cho' },
        // nya-row
        { char: 'にゃ', read: 'nya' },
        { char: 'にゅ', read: 'nyu' },
        { char: 'にょ', read: 'nyo' },
        // hya-row
        { char: 'ひゃ', read: 'hya' },
        { char: 'ひゅ', read: 'hyu' },
        { char: 'ひょ', read: 'hyo' },
        // mya-row
        { char: 'みゃ', read: 'mya' },
        { char: 'みゅ', read: 'myu' },
        { char: 'みょ', read: 'myo' },
        // rya-row
        { char: 'りゃ', read: 'rya' },
        { char: 'りゅ', read: 'ryu' },
        { char: 'りょ', read: 'ryo' },
        // gya-row
        { char: 'ぎゃ', read: 'gya' },
        { char: 'ぎゅ', read: 'gyu' },
        { char: 'ぎょ', read: 'gyo' },
        // ja-row
        { char: 'じゃ', read: 'ja' },
        { char: 'じゅ', read: 'ju' },
        { char: 'じょ', read: 'jo' },
        // bya-row
        { char: 'びゃ', read: 'bya' },
        { char: 'びゅ', read: 'byu' },
        { char: 'びょ', read: 'byo' },
        // pya-row
        { char: 'ぴゃ', read: 'pya' },
        { char: 'ぴゅ', read: 'pyu' },
        { char: 'ぴょ', read: 'pyo' },
    ],
};

const KATAKANA_CHARS: KanaChars = {
    voiceless: [
        // a-row
        { char: 'ア', read: 'a' },
        { char: 'イ', read: 'i' },
        { char: 'ウ', read: 'u' },
        { char: 'エ', read: 'e' },
        { char: 'オ', read: 'o' },
        // ka-row
        { char: 'カ', read: 'ka' },
        { char: 'キ', read: 'ki' },
        { char: 'ク', read: 'ku' },
        { char: 'ケ', read: 'ke' },
        { char: 'コ', read: 'ko' },
        // sa-row
        { char: 'サ', read: 'sa' },
        { char: 'シ', read: 'shi' },
        { char: 'ス', read: 'su' },
        { char: 'セ', read: 'se' },
        { char: 'ソ', read: 'so' },
        // ta-row
        { char: 'タ', read: 'ta' },
        { char: 'チ', read: 'chi' },
        { char: 'ツ', read: 'tsu' },
        { char: 'テ', read: 'te' },
        { char: 'ト', read: 'to' },
        // na-row
        { char: 'ナ', read: 'na' },
        { char: 'ニ', read: 'ni' },
        { char: 'ヌ', read: 'nu' },
        { char: 'ネ', read: 'ne' },
        { char: 'ノ', read: 'no' },
        // ha-row
        { char: 'ハ', read: 'ha' },
        { char: 'ヒ', read: 'hi' },
        { char: 'フ', read: 'fu' },
        { char: 'ヘ', read: 'he' },
        { char: 'ホ', read: 'ho' },
        // ma-row
        { char: 'マ', read: 'ma' },
        { char: 'ミ', read: 'mi' },
        { char: 'ム', read: 'mu' },
        { char: 'メ', read: 'me' },
        { char: 'モ', read: 'mo' },
        // ya-row (yi and ye do not exist)
        { char: 'ヤ', read: 'ya' },
        { char: '', read: '' },
        { char: 'ユ', read: 'yu' },
        { char: '', read: '' },
        { char: 'ヨ', read: 'yo' },
        // ra-row
        { char: 'ラ', read: 'ra' },
        { char: 'リ', read: 'ri' },
        { char: 'ル', read: 'ru' },
        { char: 'レ', read: 're' },
        { char: 'ロ', read: 'ro' },
        // wa-row + n (wi and we do not exist)
        { char: 'ワ', read: 'wa' },
        { char: '', read: '' },
        { char: 'ヲ', read: 'wo' },
        { char: '', read: '' },
        { char: 'ン', read: 'n' },
    ],
    voiced: [
        // ga-row
        { char: 'ガ', read: 'ga' },
        { char: 'ギ', read: 'gi' },
        { char: 'グ', read: 'gu' },
        { char: 'ゲ', read: 'ge' },
        { char: 'ゴ', read: 'go' },
        // za-row
        { char: 'ザ', read: 'za' },
        { char: 'ジ', read: 'ji' },
        { char: 'ズ', read: 'zu' },
        { char: 'ゼ', read: 'ze' },
        { char: 'ゾ', read: 'zo' },
        // da-row
        { char: 'ダ', read: 'da' },
        { char: 'ヂ', read: 'ji' },
        { char: 'ヅ', read: 'zu' },
        { char: 'デ', read: 'de' },
        { char: 'ド', read: 'do' },
        // ba-row
        { char: 'バ', read: 'ba' },
        { char: 'ビ', read: 'bi' },
        { char: 'ブ', read: 'bu' },
        { char: 'ベ', read: 'be' },
        { char: 'ボ', read: 'bo' },
        // pa-row
        { char: 'パ', read: 'pa' },
        { char: 'ピ', read: 'pi' },
        { char: 'プ', read: 'pu' },
        { char: 'ペ', read: 'pe' },
        { char: 'ポ', read: 'po' },
    ],
    contracted: [
        // kya-row
        { char: 'キャ', read: 'kya' },
        { char: 'キュ', read: 'kyu' },
        { char: 'キョ', read: 'kyo' },
        // sha-row
        { char: 'シャ', read: 'sha' },
        { char: 'シュ', read: 'shu' },
        { char: 'ショ', read: 'sho' },
        // cha-row
        { char: 'チャ', read: 'cha' },
        { char: 'チュ', read: 'chu' },
        { char: 'チョ', read: 'cho' },
        // nya-row
        { char: 'ニャ', read: 'nya' },
        { char: 'ニュ', read: 'nyu' },
        { char: 'ニョ', read: 'nyo' },
        // hya-row
        { char: 'ヒャ', read: 'hya' },
        { char: 'ヒュ', read: 'hyu' },
        { char: 'ヒョ', read: 'hyo' },
        // mya-row
        { char: 'ミャ', read: 'mya' },
        { char: 'ミュ', read: 'myu' },
        { char: 'ミョ', read: 'myo' },
        // rya-row
        { char: 'リャ', read: 'rya' },
        { char: 'リュ', read: 'ryu' },
        { char: 'リョ', read: 'ryo' },
        // gya-row
        { char: 'ギャ', read: 'gya' },
        { char: 'ギュ', read: 'gyu' },
        { char: 'ギョ', read: 'gyo' },
        // ja-row
        { char: 'ジャ', read: 'ja' },
        { char: 'ジュ', read: 'ju' },
        { char: 'ジョ', read: 'jo' },
        // bya-row
        { char: 'ビャ', read: 'bya' },
        { char: 'ビュ', read: 'byu' },
        { char: 'ビョ', read: 'byo' },
        // pya-row
        { char: 'ピャ', read: 'pya' },
        { char: 'ピュ', read: 'pyu' },
        { char: 'ピョ', read: 'pyo' },
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
