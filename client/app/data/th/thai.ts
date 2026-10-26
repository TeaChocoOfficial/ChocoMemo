// -Path: 'client/app/data/th/thai.ts'
import type { OptionsItem, ReadableChar } from '~/types/characters';

/** The Thai chart has three sets: consonants, vowels, and tone marks. */
export type ThaiSetId = 'consonants' | 'vowels' | 'tones';

/**
 * The group tabs split by writing FORM: looped (มีหัว, a closed head loop)
 * and loopless (ไม่มีหัว). Only consonants carry the distinction — vowels
 * and tone marks have no head, so both groups show the same full list and
 * the tab never yields an empty grid under those sets.
 */
export type ThaiGroupId = 'headed' | 'headless';

/**
 * The consonants in traditional order (ก–ฮ), including the two obsolete
 * letters ฃ and ฅ. `read` is the conventional Thai school letter name
 * (sound prefix + mnemonic word, e.g. กอ ไก่), without tone marks.
 */
const CONSONANTS: ReadableChar[] = [
    { char: 'ก', read: 'กอ ไก่', sound: 'ko-kai.mp3', image: '/th/image/ko-kai.png' },
    { char: 'ข', read: 'ขอ ไข่', sound: 'kho-khai.mp3', image: '/th/image/kho-khai.png' },
    { char: 'ฃ', read: 'ขอ ขวด', sound: 'kho-khuat.mp3', image: '/th/image/kho-khuat.png' },
    { char: 'ค', read: 'คอ ควาย', sound: 'kho-khwai.mp3', image: '/th/image/kho-khwai.png' },
    { char: 'ฅ', read: 'คอ คน', sound: 'kho-khon.mp3', image: '/th/image/kho-khon.png' },
    { char: 'ฆ', read: 'คอ ระฆัง', sound: 'kho-rakhang.mp3', image: '/th/image/kho-rakhang.png' },
    { char: 'ง', read: 'งอ งู', sound: 'ngo-ngu.mp3', image: '/th/image/ngo-ngu.png' },
    { char: 'จ', read: 'จอ จาน', sound: 'cho-chan.mp3', image: '/th/image/cho-chan.png' },
    { char: 'ฉ', read: 'ฉอ ฉิ่ง', sound: 'cho-ching.mp3', image: '/th/image/cho-ching.png' },
    { char: 'ช', read: 'ชอ ช้าง', sound: 'cho-chang.mp3', image: '/th/image/cho-chang.png' },
    { char: 'ซ', read: 'ซอ โซ่', sound: 'so-so.mp3', image: '/th/image/so-so.png' },
    { char: 'ฌ', read: 'ชอ เฌอ', sound: 'cho-choe.mp3', image: '/th/image/cho-choe.png' },
    { char: 'ญ', read: 'ยอ หญิง', sound: 'yo-ying.mp3', image: '/th/image/yo-ying.png' },
    { char: 'ฎ', read: 'ดอ ชฎา', sound: 'do-chada.mp3', image: '/th/image/do-chada.png' },
    { char: 'ฏ', read: 'ตอ ปฏัก', sound: 'to-patak.mp3', image: '/th/image/to-patak.png' },
    { char: 'ฐ', read: 'ถอ ฐาน', sound: 'tho-than.mp3', image: '/th/image/tho-than.png' },
    { char: 'ฑ', read: 'ทอ มณโฑ', sound: 'tho-montho.mp3', image: '/th/image/tho-montho.png' },
    { char: 'ฒ', read: 'ทอ ผู้เฒ่า', sound: 'tho-phu-thao.mp3', image: '/th/image/tho-phu-thao.png' },
    { char: 'ณ', read: 'นอ เณร', sound: 'no-nen.mp3', image: '/th/image/no-nen.png' },
    { char: 'ด', read: 'ดอ เด็ก', sound: 'do-dek.mp3', image: '/th/image/do-dek.png' },
    { char: 'ต', read: 'ตอ เต่า', sound: 'to-tao.mp3', image: '/th/image/to-tao.png' },
    { char: 'ถ', read: 'ถอ ถุง', sound: 'tho-thung.mp3', image: '/th/image/tho-thung.png' },
    { char: 'ท', read: 'ทอ ทหาร', sound: 'tho-thahan.mp3', image: '/th/image/tho-thahan.png' },
    { char: 'ธ', read: 'ธอ ธง', sound: 'tho-thong.mp3', image: '/th/image/tho-thong.png' },
    { char: 'น', read: 'นอ หนู', sound: 'no-nu.mp3', image: '/th/image/no-nu.png' },
    { char: 'บ', read: 'บอ ใบไม้', sound: 'bo-baimai.mp3', image: '/th/image/bo-baimai.png' },
    { char: 'ป', read: 'ปอ ปลา', sound: 'po-pla.mp3', image: '/th/image/po-pla.png' },
    { char: 'ผ', read: 'ผอ ผึ้ง', sound: 'pho-phueng.mp3', image: '/th/image/pho-phueng.png' },
    { char: 'พ', read: 'พอ พาน', sound: 'pho-phan.mp3', image: '/th/image/pho-phan.png' },
    { char: 'ฝ', read: 'ฝอ ฝา', sound: 'fo-fa.mp3', image: '/th/image/fo-fa.png' },
    { char: 'ฟ', read: 'ฟอ ฟัน', sound: 'fo-fan.mp3', image: '/th/image/fo-fan.png' },
    { char: 'ภ', read: 'พอ สำเภา', sound: 'pho-samphao.mp3', image: '/th/image/pho-samphao.png' },
    { char: 'ม', read: 'มอ ม้า', sound: 'mo-ma.mp3', image: '/th/image/mo-ma.png' },
    { char: 'ย', read: 'ยอ ยักษ์', sound: 'yo-yak.mp3', image: '/th/image/yo-yak.png' },
    { char: 'ร', read: 'รอ เรือ', sound: 'ro-ruea.mp3', image: '/th/image/ro-ruea.png' },
    { char: 'ล', read: 'ลอ ลิง', sound: 'lo-ling.mp3', image: '/th/image/lo-ling.png' },
    { char: 'ว', read: 'วอ แหวน', sound: 'wo-waen.mp3', image: '/th/image/wo-waen.png' },
    { char: 'ศ', read: 'ศอ ศาลา', sound: 'so-sala.mp3', image: '/th/image/so-sala.png' },
    { char: 'ษ', read: 'ษอ ฤๅษี', sound: 'so-ruesi.mp3', image: '/th/image/so-ruesi.png' },
    { char: 'ส', read: 'สอ เสือ', sound: 'so-suea.mp3', image: '/th/image/so-suea.png' },
    { char: 'ห', read: 'หอ หีบ', sound: 'ho-hip.mp3', image: '/th/image/ho-hip.png' },
    { char: 'ฬ', read: 'ลอ จุฬา', sound: 'lo-chula.mp3', image: '/th/image/lo-chula.png' },
    { char: 'อ', read: 'ออ อ่าง', sound: 'o-ang.mp3', image: '/th/image/o-ang.png' },
    { char: 'ฮ', read: 'ฮอ นกฮูก', sound: 'ho-nok-huk.mp3', image: '/th/image/ho-nok-huk.png' },
];

/**
 * The vowel symbols in school-chart order: short a, the above/below marks,
 * aa, am, then the front vowels. The short mark ็ (mai han akat) is left
 * out — it renders poorly with no base consonant under it.
 */
const VOWELS: ReadableChar[] = [
    { char: 'ะ', read: 'อะ', sound: 'a.mp3', image: '/th/image/a.png' },
    { char: 'า', read: 'อา', sound: 'aa.mp3', image: '/th/image/aa.png' },
    { char: 'ิ', read: 'อิ', sound: 'i.mp3', image: '/th/image/i.png' },
    { char: 'ี', read: 'อี', sound: 'ii.mp3', image: '/th/image/ii.png' },
    { char: 'ึ', read: 'อึ', sound: 'ue.mp3', image: '/th/image/ue.png' },
    { char: 'ื', read: 'อือ', sound: 'uue.mp3', image: '/th/image/uue.png' },
    { char: 'ุ', read: 'อุ', sound: 'u.mp3', image: '/th/image/u.png' },
    { char: 'ู', read: 'อู', sound: 'uu.mp3', image: '/th/image/uu.png' },
    { char: 'เ ะ', read: 'เอะ', sound: 'e-ae.mp3', image: '/th/image/e-ae.png' },
    { char: 'เ', read: 'เอ', sound: 'e.mp3', image: '/th/image/e.png' },
    { char: 'แ ะ', read: 'แอะ', sound: 'ae-ae.mp3', image: '/th/image/ae-ae.png' },
    { char: 'แ', read: 'แอ', sound: 'ae.mp3', image: '/th/image/ae.png' },
    { char: 'โ ะ', read: 'โอะ', sound: 'o-ae.mp3', image: '/th/image/o-ae.png' },
    { char: 'โ', read: 'โอ', sound: 'o.mp3', image: '/th/image/o.png' },
    { char: 'เ าะ', read: 'เอาะ', sound: 'e-aa.mp3', image: '/th/image/e-aa.png' },
    { char: 'อ', read: 'ออ', sound: 'ao.mp3', image: '/th/image/ao.png' },
    { char: 'เ  ิะ', read: 'เออะ', sound: 'e-o-ae.mp3', image: '/th/image/e-o-ae.png' },
    { char: 'เ อ', read: 'เออ', sound: 'e-o.mp3', image: '/th/image/e-o.png' },
    { char: 'เ  ียะ', read: 'เอียะ', sound: 'e-ii-ya.mp3', image: '/th/image/e-ii-ya.png' },
    { char: 'เ  ีย', read: 'เอีย', sound: 'e-ii.mp3', image: '/th/image/e-ii.png' },
    { char: 'เ  ือะ', read: 'เอือะ', sound: 'e-uu-o.mp3', image: '/th/image/e-uu-o.png' },
    { char: 'เ  ือ', read: 'เอือ', sound: 'e-uu.mp3', image: '/th/image/e-uu.png' },
    { char: 'ัวะ', read: 'อัวะ', sound: 'a-u-a.mp3', image: '/th/image/a-u-a.png' },
    { char: 'ัว', read: 'อัว', sound: 'a-u.mp3', image: '/th/image/a-u.png' },
    { char: 'ำ', read: 'อำ', sound: 'am.mp3', image: '/th/image/am.png' },
    { char: 'ใ', read: 'ใอ', sound: 'ai.mp3', image: '/th/image/ai.png' },
    { char: 'ไ', read: 'ไอ', sound: 'aii.mp3', image: '/th/image/aii.png' },
    { char: 'เ า', read: 'เอา', sound: 'e-a.mp3', image: '/th/image/e-a.png' },
    { char: 'ฤ', read: 'ฤๅ', sound: 'rue.mp3', image: '/th/image/rue.png' },
    { char: 'ฤๅ', read: 'ฤๅ', sound: 'rue-lue.mp3', image: '/th/image/rue-lue.png' },
    { char: 'ฦ', read: 'ฦๅ', sound: 'lu.mp3', image: '/th/image/lu.png' },
    { char: 'ฦๅ', read: 'ฦๅ', sound: 'lu-lue.mp3', image: '/th/image/lu-lue.png' },
    { char: 'ั', read: 'ไม้หันอากาศ', sound: 'mai-han-akat.mp3', image: '/th/image/mai-han-akat.png' },
    { char: '็', read: 'ไม้ไต่คู้', sound: 'mai-tai-khu.mp3', image: '/th/image/mai-tai-khu.png' },
    { char: '์', read: 'ทัณฑฆาต', sound: 'thanthakhat.mp3', image: '/th/image/thanthakhat.png' },
];

/** The four tone marks, in the order they are taught. */
const TONES: ReadableChar[] = [
    { char: '่', read: 'ไม้เอก', sound: 'mai-ek.mp3', image: '/th/image/mai-ek.png' },
    { char: '้', read: 'ไม้โท', sound: 'mai-tho.mp3', image: '/th/image/mai-tho.png' },
    { char: '๊', read: 'ไม้ตรี', sound: 'mai-tri.mp3', image: '/th/image/mai-tri.png' },
    { char: '๋', read: 'ไม้จัตวา', sound: 'mai-chattawa.mp3', image: '/th/image/mai-chattawa.png' },
];

/**
 * The Thai character sets per set id. The headed/headless split only
 * filters consonants; vowels and tone marks appear under both groups (they
 * have no head) so the toolbar never shows an empty grid.
 */
export const THAI_CHARS: OptionsItem<'th'> = {
    consonants: { headed: CONSONANTS, headless: CONSONANTS },
    vowels: { headed: VOWELS, headless: VOWELS },
    tones: { headed: TONES, headless: TONES },
};
