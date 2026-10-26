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
        { char: 'あ', read: 'a', sound: 'a.mp3', image: '/ja/image/a.png' },
        { char: 'い', read: 'i', sound: 'i.mp3', image: '/ja/image/i.png' },
        { char: 'う', read: 'u', sound: 'u.mp3', image: '/ja/image/u.png' },
        { char: 'え', read: 'e', sound: 'e.mp3', image: '/ja/image/e.png' },
        { char: 'お', read: 'o', sound: 'o.mp3', image: '/ja/image/o.png' },
        // ka-row
        { char: 'か', read: 'ka', sound: 'ka.mp3', image: '/ja/image/ka.png' },
        { char: 'き', read: 'ki', sound: 'ki.mp3', image: '/ja/image/ki.png' },
        { char: 'く', read: 'ku', sound: 'ku.mp3', image: '/ja/image/ku.png' },
        { char: 'け', read: 'ke', sound: 'ke.mp3', image: '/ja/image/ke.png' },
        { char: 'こ', read: 'ko', sound: 'ko.mp3', image: '/ja/image/ko.png' },
        // sa-row
        { char: 'さ', read: 'sa', sound: 'sa.mp3', image: '/ja/image/sa.png' },
        { char: 'し', read: 'shi', sound: 'shi.mp3', image: '/ja/image/shi.png' },
        { char: 'す', read: 'su', sound: 'su.mp3', image: '/ja/image/su.png' },
        { char: 'せ', read: 'se', sound: 'se.mp3', image: '/ja/image/se.png' },
        { char: 'そ', read: 'so', sound: 'so.mp3', image: '/ja/image/so.png' },
        // ta-row
        { char: 'た', read: 'ta', sound: 'ta.mp3', image: '/ja/image/ta.png' },
        { char: 'ち', read: 'chi', sound: 'chi.mp3', image: '/ja/image/chi.png' },
        { char: 'つ', read: 'tsu', sound: 'tsu.mp3', image: '/ja/image/tsu.png' },
        { char: 'て', read: 'te', sound: 'te.mp3', image: '/ja/image/te.png' },
        { char: 'と', read: 'to', sound: 'to.mp3', image: '/ja/image/to.png' },
        // na-row
        { char: 'な', read: 'na', sound: 'na.mp3', image: '/ja/image/na.png' },
        { char: 'に', read: 'ni', sound: 'ni.mp3', image: '/ja/image/ni.png' },
        { char: 'ぬ', read: 'nu', sound: 'nu.mp3', image: '/ja/image/nu.png' },
        { char: 'ね', read: 'ne', sound: 'ne.mp3', image: '/ja/image/ne.png' },
        { char: 'の', read: 'no', sound: 'no.mp3', image: '/ja/image/no.png' },
        // ha-row
        { char: 'は', read: 'ha', sound: 'ha.mp3', image: '/ja/image/ha.png' },
        { char: 'ひ', read: 'hi', sound: 'hi.mp3', image: '/ja/image/hi.png' },
        { char: 'ふ', read: 'fu', sound: 'fu.mp3', image: '/ja/image/fu.png' },
        { char: 'へ', read: 'he', sound: 'he.mp3', image: '/ja/image/he.png' },
        { char: 'ほ', read: 'ho', sound: 'ho.mp3', image: '/ja/image/ho.png' },
        // ma-row
        { char: 'ま', read: 'ma', sound: 'ma.mp3', image: '/ja/image/ma.png' },
        { char: 'み', read: 'mi', sound: 'mi.mp3', image: '/ja/image/mi.png' },
        { char: 'む', read: 'mu', sound: 'mu.mp3', image: '/ja/image/mu.png' },
        { char: 'め', read: 'me', sound: 'me.mp3', image: '/ja/image/me.png' },
        { char: 'も', read: 'mo', sound: 'mo.mp3', image: '/ja/image/mo.png' },
        // ya-row (yi and ye do not exist)
        { char: 'や', read: 'ya', sound: 'ya.mp3', image: '/ja/image/ya.png' },
        { char: '', read: '', sound: '', image: '' },
        { char: 'ゆ', read: 'yu', sound: 'yu.mp3', image: '/ja/image/yu.png' },
        { char: '', read: '', sound: '', image: '' },
        { char: 'よ', read: 'yo', sound: 'yo.mp3', image: '/ja/image/yo.png' },
        // ra-row
        { char: 'ら', read: 'ra', sound: 'ra.mp3', image: '/ja/image/ra.png' },
        { char: 'り', read: 'ri', sound: 'ri.mp3', image: '/ja/image/ri.png' },
        { char: 'る', read: 'ru', sound: 'ru.mp3', image: '/ja/image/ru.png' },
        { char: 'れ', read: 're', sound: 're.mp3', image: '/ja/image/re.png' },
        { char: 'ろ', read: 'ro', sound: 'ro.mp3', image: '/ja/image/ro.png' },
        // wa-row + n (wi and we do not exist)
        { char: 'わ', read: 'wa', sound: 'wa.mp3', image: '/ja/image/wa.png' },
        { char: '', read: '', sound: '', image: '' },
        { char: 'を', read: 'wo', sound: 'wo.mp3', image: '/ja/image/wo.png' },
        { char: '', read: '', sound: '', image: '' },
        { char: 'ん', read: 'n', sound: 'n.mp3', image: '/ja/image/n.png' },
    ],
    voiced: [
        // ga-row
        { char: 'が', read: 'ga', sound: 'ga.mp3', image: '/ja/image/ga.png' },
        { char: 'ぎ', read: 'gi', sound: 'gi.mp3', image: '/ja/image/gi.png' },
        { char: 'ぐ', read: 'gu', sound: 'gu.mp3', image: '/ja/image/gu.png' },
        { char: 'げ', read: 'ge', sound: 'ge.mp3', image: '/ja/image/ge.png' },
        { char: 'ご', read: 'go', sound: 'go.mp3', image: '/ja/image/go.png' },
        // za-row
        { char: 'ざ', read: 'za', sound: 'za.mp3', image: '/ja/image/za.png' },
        { char: 'じ', read: 'ji', sound: 'ji.mp3', image: '/ja/image/ji.png' },
        { char: 'ず', read: 'zu', sound: 'zu.mp3', image: '/ja/image/zu.png' },
        { char: 'ぜ', read: 'ze', sound: 'ze.mp3', image: '/ja/image/ze.png' },
        { char: 'ぞ', read: 'zo', sound: 'zo.mp3', image: '/ja/image/zo.png' },
        // da-row
        { char: 'だ', read: 'da', sound: 'da.mp3', image: '/ja/image/da.png' },
        { char: 'ぢ', read: 'ji', sound: 'ji.mp3', image: '/ja/image/ji.png' },
        { char: 'づ', read: 'zu', sound: 'zu.mp3', image: '/ja/image/zu.png' },
        { char: 'で', read: 'de', sound: 'de.mp3', image: '/ja/image/de.png' },
        { char: 'ど', read: 'do', sound: 'do.mp3', image: '/ja/image/do.png' },
        // ba-row
        { char: 'ば', read: 'ba', sound: 'ba.mp3', image: '/ja/image/ba.png' },
        { char: 'び', read: 'bi', sound: 'bi.mp3', image: '/ja/image/bi.png' },
        { char: 'ぶ', read: 'bu', sound: 'bu.mp3', image: '/ja/image/bu.png' },
        { char: 'べ', read: 'be', sound: 'be.mp3', image: '/ja/image/be.png' },
        { char: 'ぼ', read: 'bo', sound: 'bo.mp3', image: '/ja/image/bo.png' },
        // pa-row
        { char: 'ぱ', read: 'pa', sound: 'pa.mp3', image: '/ja/image/pa.png' },
        { char: 'ぴ', read: 'pi', sound: 'pi.mp3', image: '/ja/image/pi.png' },
        { char: 'ぷ', read: 'pu', sound: 'pu.mp3', image: '/ja/image/pu.png' },
        { char: 'ぺ', read: 'pe', sound: 'pe.mp3', image: '/ja/image/pe.png' },
        { char: 'ぽ', read: 'po', sound: 'po.mp3', image: '/ja/image/po.png' },
    ],
    contracted: [
        // kya-row
        { char: 'きゃ', read: 'kya', sound: 'kya.mp3', image: '/ja/image/kya.png' },
        { char: 'きゅ', read: 'kyu', sound: 'kyu.mp3', image: '/ja/image/kyu.png' },
        { char: 'きょ', read: 'kyo', sound: 'kyo.mp3', image: '/ja/image/kyo.png' },
        // sha-row
        { char: 'しゃ', read: 'sha', sound: 'sha.mp3', image: '/ja/image/sha.png' },
        { char: 'しゅ', read: 'shu', sound: 'shu.mp3', image: '/ja/image/shu.png' },
        { char: 'しょ', read: 'sho', sound: 'sho.mp3', image: '/ja/image/sho.png' },
        // cha-row
        { char: 'ちゃ', read: 'cha', sound: 'cha.mp3', image: '/ja/image/cha.png' },
        { char: 'ちゅ', read: 'chu', sound: 'chu.mp3', image: '/ja/image/chu.png' },
        { char: 'ちょ', read: 'cho', sound: 'cho.mp3', image: '/ja/image/cho.png' },
        // nya-row
        { char: 'にゃ', read: 'nya', sound: 'nya.mp3', image: '/ja/image/nya.png' },
        { char: 'にゅ', read: 'nyu', sound: 'nyu.mp3', image: '/ja/image/nyu.png' },
        { char: 'にょ', read: 'nyo', sound: 'nyo.mp3', image: '/ja/image/nyo.png' },
        // hya-row
        { char: 'ひゃ', read: 'hya', sound: 'hya.mp3', image: '/ja/image/hya.png' },
        { char: 'ひゅ', read: 'hyu', sound: 'hyu.mp3', image: '/ja/image/hyu.png' },
        { char: 'ひょ', read: 'hyo', sound: 'hyo.mp3', image: '/ja/image/hyo.png' },
        // mya-row
        { char: 'みゃ', read: 'mya', sound: 'mya.mp3', image: '/ja/image/mya.png' },
        { char: 'みゅ', read: 'myu', sound: 'myu.mp3', image: '/ja/image/myu.png' },
        { char: 'みょ', read: 'myo', sound: 'myo.mp3', image: '/ja/image/myo.png' },
        // rya-row
        { char: 'りゃ', read: 'rya', sound: 'rya.mp3', image: '/ja/image/rya.png' },
        { char: 'りゅ', read: 'ryu', sound: 'ryu.mp3', image: '/ja/image/ryu.png' },
        { char: 'りょ', read: 'ryo', sound: 'ryo.mp3', image: '/ja/image/ryo.png' },
        // gya-row
        { char: 'ぎゃ', read: 'gya', sound: 'gya.mp3', image: '/ja/image/gya.png' },
        { char: 'ぎゅ', read: 'gyu', sound: 'gyu.mp3', image: '/ja/image/gyu.png' },
        { char: 'ぎょ', read: 'gyo', sound: 'gyo.mp3', image: '/ja/image/gyo.png' },
        // ja-row
        { char: 'じゃ', read: 'ja', sound: 'ja.mp3', image: '/ja/image/ja.png' },
        { char: 'じゅ', read: 'ju', sound: 'ju.mp3', image: '/ja/image/ju.png' },
        { char: 'じょ', read: 'jo', sound: 'jo.mp3', image: '/ja/image/jo.png' },
        // bya-row
        { char: 'びゃ', read: 'bya', sound: 'bya.mp3', image: '/ja/image/bya.png' },
        { char: 'びゅ', read: 'byu', sound: 'byu.mp3', image: '/ja/image/byu.png' },
        { char: 'びょ', read: 'byo', sound: 'byo.mp3', image: '/ja/image/byo.png' },
        // pya-row
        { char: 'ぴゃ', read: 'pya', sound: 'pya.mp3', image: '/ja/image/pya.png' },
        { char: 'ぴゅ', read: 'pyu', sound: 'pyu.mp3', image: '/ja/image/pyu.png' },
        { char: 'ぴょ', read: 'pyo', sound: 'pyo.mp3', image: '/ja/image/pyo.png' },
    ],
};

const KATAKANA_CHARS: KanaChars = {
    voiceless: [
        // a-row
        { char: 'ア', read: 'a', sound: 'a.mp3', image: '/ja/image/a.png' },
        { char: 'イ', read: 'i', sound: 'i.mp3', image: '/ja/image/i.png' },
        { char: 'ウ', read: 'u', sound: 'u.mp3', image: '/ja/image/u.png' },
        { char: 'エ', read: 'e', sound: 'e.mp3', image: '/ja/image/e.png' },
        { char: 'オ', read: 'o', sound: 'o.mp3', image: '/ja/image/o.png' },
        // ka-row
        { char: 'カ', read: 'ka', sound: 'ka.mp3', image: '/ja/image/ka.png' },
        { char: 'キ', read: 'ki', sound: 'ki.mp3', image: '/ja/image/ki.png' },
        { char: 'ク', read: 'ku', sound: 'ku.mp3', image: '/ja/image/ku.png' },
        { char: 'ケ', read: 'ke', sound: 'ke.mp3', image: '/ja/image/ke.png' },
        { char: 'コ', read: 'ko', sound: 'ko.mp3', image: '/ja/image/ko.png' },
        // sa-row
        { char: 'サ', read: 'sa', sound: 'sa.mp3', image: '/ja/image/sa.png' },
        { char: 'シ', read: 'shi', sound: 'shi.mp3', image: '/ja/image/shi.png' },
        { char: 'ス', read: 'su', sound: 'su.mp3', image: '/ja/image/su.png' },
        { char: 'セ', read: 'se', sound: 'se.mp3', image: '/ja/image/se.png' },
        { char: 'ソ', read: 'so', sound: 'so.mp3', image: '/ja/image/so.png' },
        // ta-row
        { char: 'タ', read: 'ta', sound: 'ta.mp3', image: '/ja/image/ta.png' },
        { char: 'チ', read: 'chi', sound: 'chi.mp3', image: '/ja/image/chi.png' },
        { char: 'ツ', read: 'tsu', sound: 'tsu.mp3', image: '/ja/image/tsu.png' },
        { char: 'テ', read: 'te', sound: 'te.mp3', image: '/ja/image/te.png' },
        { char: 'ト', read: 'to', sound: 'to.mp3', image: '/ja/image/to.png' },
        // na-row
        { char: 'ナ', read: 'na', sound: 'na.mp3', image: '/ja/image/na.png' },
        { char: 'ニ', read: 'ni', sound: 'ni.mp3', image: '/ja/image/ni.png' },
        { char: 'ヌ', read: 'nu', sound: 'nu.mp3', image: '/ja/image/nu.png' },
        { char: 'ネ', read: 'ne', sound: 'ne.mp3', image: '/ja/image/ne.png' },
        { char: 'ノ', read: 'no', sound: 'no.mp3', image: '/ja/image/no.png' },
        // ha-row
        { char: 'ハ', read: 'ha', sound: 'ha.mp3', image: '/ja/image/ha.png' },
        { char: 'ヒ', read: 'hi', sound: 'hi.mp3', image: '/ja/image/hi.png' },
        { char: 'フ', read: 'fu', sound: 'fu.mp3', image: '/ja/image/fu.png' },
        { char: 'ヘ', read: 'he', sound: 'he.mp3', image: '/ja/image/he.png' },
        { char: 'ホ', read: 'ho', sound: 'ho.mp3', image: '/ja/image/ho.png' },
        // ma-row
        { char: 'マ', read: 'ma', sound: 'ma.mp3', image: '/ja/image/ma.png' },
        { char: 'ミ', read: 'mi', sound: 'mi.mp3', image: '/ja/image/mi.png' },
        { char: 'ム', read: 'mu', sound: 'mu.mp3', image: '/ja/image/mu.png' },
        { char: 'メ', read: 'me', sound: 'me.mp3', image: '/ja/image/me.png' },
        { char: 'モ', read: 'mo', sound: 'mo.mp3', image: '/ja/image/mo.png' },
        // ya-row (yi and ye do not exist)
        { char: 'ヤ', read: 'ya', sound: 'ya.mp3', image: '/ja/image/ya.png' },
        { char: '', read: '', sound: '', image: '' },
        { char: 'ユ', read: 'yu', sound: 'yu.mp3', image: '/ja/image/yu.png' },
        { char: '', read: '', sound: '', image: '' },
        { char: 'ヨ', read: 'yo', sound: 'yo.mp3', image: '/ja/image/yo.png' },
        // ra-row
        { char: 'ラ', read: 'ra', sound: 'ra.mp3', image: '/ja/image/ra.png' },
        { char: 'リ', read: 'ri', sound: 'ri.mp3', image: '/ja/image/ri.png' },
        { char: 'ル', read: 'ru', sound: 'ru.mp3', image: '/ja/image/ru.png' },
        { char: 'レ', read: 're', sound: 're.mp3', image: '/ja/image/re.png' },
        { char: 'ロ', read: 'ro', sound: 'ro.mp3', image: '/ja/image/ro.png' },
        // wa-row + n (wi and we do not exist)
        { char: 'ワ', read: 'wa', sound: 'wa.mp3', image: '/ja/image/wa.png' },
        { char: '', read: '', sound: '', image: '' },
        { char: 'ヲ', read: 'wo', sound: 'wo.mp3', image: '/ja/image/wo.png' },
        { char: '', read: '', sound: '', image: '' },
        { char: 'ン', read: 'n', sound: 'n.mp3', image: '/ja/image/n.png' },
    ],
    voiced: [
        // ga-row
        { char: 'ガ', read: 'ga', sound: 'ga.mp3', image: '/ja/image/ga.png' },
        { char: 'ギ', read: 'gi', sound: 'gi.mp3', image: '/ja/image/gi.png' },
        { char: 'グ', read: 'gu', sound: 'gu.mp3', image: '/ja/image/gu.png' },
        { char: 'ゲ', read: 'ge', sound: 'ge.mp3', image: '/ja/image/ge.png' },
        { char: 'ゴ', read: 'go', sound: 'go.mp3', image: '/ja/image/go.png' },
        // za-row
        { char: 'ザ', read: 'za', sound: 'za.mp3', image: '/ja/image/za.png' },
        { char: 'ジ', read: 'ji', sound: 'ji.mp3', image: '/ja/image/ji.png' },
        { char: 'ズ', read: 'zu', sound: 'zu.mp3', image: '/ja/image/zu.png' },
        { char: 'ゼ', read: 'ze', sound: 'ze.mp3', image: '/ja/image/ze.png' },
        { char: 'ゾ', read: 'zo', sound: 'zo.mp3', image: '/ja/image/zo.png' },
        // da-row
        { char: 'ダ', read: 'da', sound: 'da.mp3', image: '/ja/image/da.png' },
        { char: 'ヂ', read: 'ji', sound: 'ji.mp3', image: '/ja/image/ji.png' },
        { char: 'ヅ', read: 'zu', sound: 'zu.mp3', image: '/ja/image/zu.png' },
        { char: 'デ', read: 'de', sound: 'de.mp3', image: '/ja/image/de.png' },
        { char: 'ド', read: 'do', sound: 'do.mp3', image: '/ja/image/do.png' },
        // ba-row
        { char: 'バ', read: 'ba', sound: 'ba.mp3', image: '/ja/image/ba.png' },
        { char: 'ビ', read: 'bi', sound: 'bi.mp3', image: '/ja/image/bi.png' },
        { char: 'ブ', read: 'bu', sound: 'bu.mp3', image: '/ja/image/bu.png' },
        { char: 'ベ', read: 'be', sound: 'be.mp3', image: '/ja/image/be.png' },
        { char: 'ボ', read: 'bo', sound: 'bo.mp3', image: '/ja/image/bo.png' },
        // pa-row
        { char: 'パ', read: 'pa', sound: 'pa.mp3', image: '/ja/image/pa.png' },
        { char: 'ピ', read: 'pi', sound: 'pi.mp3', image: '/ja/image/pi.png' },
        { char: 'プ', read: 'pu', sound: 'pu.mp3', image: '/ja/image/pu.png' },
        { char: 'ペ', read: 'pe', sound: 'pe.mp3', image: '/ja/image/pe.png' },
        { char: 'ポ', read: 'po', sound: 'po.mp3', image: '/ja/image/po.png' },
    ],
    contracted: [
        // kya-row
        { char: 'キャ', read: 'kya', sound: 'kya.mp3', image: '/ja/image/kya.png' },
        { char: 'キュ', read: 'kyu', sound: 'kyu.mp3', image: '/ja/image/kyu.png' },
        { char: 'キョ', read: 'kyo', sound: 'kyo.mp3', image: '/ja/image/kyo.png' },
        // sha-row
        { char: 'シャ', read: 'sha', sound: 'sha.mp3', image: '/ja/image/sha.png' },
        { char: 'シュ', read: 'shu', sound: 'shu.mp3', image: '/ja/image/shu.png' },
        { char: 'ショ', read: 'sho', sound: 'sho.mp3', image: '/ja/image/sho.png' },
        // cha-row
        { char: 'チャ', read: 'cha', sound: 'cha.mp3', image: '/ja/image/cha.png' },
        { char: 'チュ', read: 'chu', sound: 'chu.mp3', image: '/ja/image/chu.png' },
        { char: 'チョ', read: 'cho', sound: 'cho.mp3', image: '/ja/image/cho.png' },
        // nya-row
        { char: 'ニャ', read: 'nya', sound: 'nya.mp3', image: '/ja/image/nya.png' },
        { char: 'ニュ', read: 'nyu', sound: 'nyu.mp3', image: '/ja/image/nyu.png' },
        { char: 'ニョ', read: 'nyo', sound: 'nyo.mp3', image: '/ja/image/nyo.png' },
        // hya-row
        { char: 'ヒャ', read: 'hya', sound: 'hya.mp3', image: '/ja/image/hya.png' },
        { char: 'ヒュ', read: 'hyu', sound: 'hyu.mp3', image: '/ja/image/hyu.png' },
        { char: 'ヒョ', read: 'hyo', sound: 'hyo.mp3', image: '/ja/image/hyo.png' },
        // mya-row
        { char: 'ミャ', read: 'mya', sound: 'mya.mp3', image: '/ja/image/mya.png' },
        { char: 'ミュ', read: 'myu', sound: 'myu.mp3', image: '/ja/image/myu.png' },
        { char: 'ミョ', read: 'myo', sound: 'myo.mp3', image: '/ja/image/myo.png' },
        // rya-row
        { char: 'リャ', read: 'rya', sound: 'rya.mp3', image: '/ja/image/rya.png' },
        { char: 'リュ', read: 'ryu', sound: 'ryu.mp3', image: '/ja/image/ryu.png' },
        { char: 'リョ', read: 'ryo', sound: 'ryo.mp3', image: '/ja/image/ryo.png' },
        // gya-row
        { char: 'ギャ', read: 'gya', sound: 'gya.mp3', image: '/ja/image/gya.png' },
        { char: 'ギュ', read: 'gyu', sound: 'gyu.mp3', image: '/ja/image/gyu.png' },
        { char: 'ギョ', read: 'gyo', sound: 'gyo.mp3', image: '/ja/image/gyo.png' },
        // ja-row
        { char: 'ジャ', read: 'ja', sound: 'ja.mp3', image: '/ja/image/ja.png' },
        { char: 'ジュ', read: 'ju', sound: 'ju.mp3', image: '/ja/image/ju.png' },
        { char: 'ジョ', read: 'jo', sound: 'jo.mp3', image: '/ja/image/jo.png' },
        // bya-row
        { char: 'ビャ', read: 'bya', sound: 'bya.mp3', image: '/ja/image/bya.png' },
        { char: 'ビュ', read: 'byu', sound: 'byu.mp3', image: '/ja/image/byu.png' },
        { char: 'ビョ', read: 'byo', sound: 'byo.mp3', image: '/ja/image/byo.png' },
        // pya-row
        { char: 'ピャ', read: 'pya', sound: 'pya.mp3', image: '/ja/image/pya.png' },
        { char: 'ピュ', read: 'pyu', sound: 'pyu.mp3', image: '/ja/image/pyu.png' },
        { char: 'ピョ', read: 'pyo', sound: 'pyo.mp3', image: '/ja/image/pyo.png' },
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
