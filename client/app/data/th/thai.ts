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
    { char: 'ก', read: 'กอ ไก่', sound: 'ko-kai.mp3' },
    { char: 'ข', read: 'ขอ ไข่', sound: 'kho-khai.mp3' },
    { char: 'ฃ', read: 'ขอ ขวด', sound: 'kho-khuat.mp3' },
    { char: 'ค', read: 'คอ ควาย', sound: 'kho-khwai.mp3' },
    { char: 'ฅ', read: 'คอ คน', sound: 'kho-khon.mp3' },
    { char: 'ฆ', read: 'คอ ระฆัง', sound: 'kho-rakhang.mp3' },
    { char: 'ง', read: 'งอ งู', sound: 'ngo-ngu.mp3' },
    { char: 'จ', read: 'จอ จาน', sound: 'cho-chan.mp3' },
    { char: 'ฉ', read: 'ฉอ ฉิ่ง', sound: 'cho-ching.mp3' },
    { char: 'ช', read: 'ชอ ช้าง', sound: 'cho-chang.mp3' },
    { char: 'ซ', read: 'ซอ โซ่', sound: 'so-so.mp3' },
    { char: 'ฌ', read: 'ชอ เฌอ', sound: 'cho-choe.mp3' },
    { char: 'ญ', read: 'ยอ หญิง', sound: 'yo-ying.mp3' },
    { char: 'ฎ', read: 'ดอ ชฎา', sound: 'do-chada.mp3' },
    { char: 'ฏ', read: 'ตอ ปฏัก', sound: 'to-patak.mp3' },
    { char: 'ฐ', read: 'ถอ ฐาน', sound: 'tho-than.mp3' },
    { char: 'ฑ', read: 'ทอ มณโฑ', sound: 'tho-montho.mp3' },
    { char: 'ฒ', read: 'ทอ ผู้เฒ่า', sound: 'tho-phu-thao.mp3' },
    { char: 'ณ', read: 'นอ เณร', sound: 'no-nen.mp3' },
    { char: 'ด', read: 'ดอ เด็ก', sound: 'do-dek.mp3' },
    { char: 'ต', read: 'ตอ เต่า', sound: 'to-tao.mp3' },
    { char: 'ถ', read: 'ถอ ถุง', sound: 'tho-thung.mp3' },
    { char: 'ท', read: 'ทอ ทหาร', sound: 'tho-thahan.mp3' },
    { char: 'ธ', read: 'ธอ ธง', sound: 'tho-thong.mp3' },
    { char: 'น', read: 'นอ หนู', sound: 'no-nu.mp3' },
    { char: 'บ', read: 'บอ ใบไม้', sound: 'bo-baimai.mp3' },
    { char: 'ป', read: 'ปอ ปลา', sound: 'po-pla.mp3' },
    { char: 'ผ', read: 'ผอ ผึ้ง', sound: 'pho-phueng.mp3' },
    { char: 'พ', read: 'พอ พาน', sound: 'pho-phan.mp3' },
    { char: 'ฝ', read: 'ฝอ ฝา', sound: 'fo-fa.mp3' },
    { char: 'ฟ', read: 'ฟอ ฟัน', sound: 'fo-fan.mp3' },
    { char: 'ภ', read: 'พอ สำเภา', sound: 'pho-samphao.mp3' },
    { char: 'ม', read: 'มอ ม้า', sound: 'mo-ma.mp3' },
    { char: 'ย', read: 'ยอ ยักษ์', sound: 'yo-yak.mp3' },
    { char: 'ร', read: 'รอ เรือ', sound: 'ro-ruea.mp3' },
    { char: 'ฤ', read: 'รอ ฤๅ', sound: 'ro-rue.mp3' },
    { char: 'ล', read: 'ลอ ลิง', sound: 'lo-ling.mp3' },
    { char: 'ฦ', read: 'ลอ ฦๅ', sound: 'lo-lu.mp3' },
    { char: 'ว', read: 'วอ แหวน', sound: 'wo-waen.mp3' },
    { char: 'ศ', read: 'ศอ ศาลา', sound: 'so-sala.mp3' },
    { char: 'ษ', read: 'ษอ ฤๅษี', sound: 'so-ruesi.mp3' },
    { char: 'ส', read: 'สอ เสือ', sound: 'so-suea.mp3' },
    { char: 'ห', read: 'หอ หีบ', sound: 'ho-hip.mp3' },
    { char: 'ฬ', read: 'ลอ จุฬา', sound: 'lo-chula.mp3' },
    { char: 'อ', read: 'ออ อ่าง', sound: 'o-ang.mp3' },
    { char: 'ฮ', read: 'ฮอ นกฮูก', sound: 'ho-nok-huk.mp3' },
];

/**
 * The vowel symbols in school-chart order: short a, the above/below marks,
 * aa, am, then the front vowels. The short mark ็ (mai han akat) is left
 * out — it renders poorly with no base consonant under it.
 */
const VOWELS: ReadableChar[] = [
    { char: 'ะ', read: 'อะ', sound: 'a.mp3' },
    { char: 'า', read: 'อา', sound: 'aa.mp3' },
    { char: 'ิ', read: 'อิ', sound: 'i.mp3' },
    { char: 'ี', read: 'อี', sound: 'ii.mp3' },
    { char: 'ึ', read: 'อึ', sound: 'ue.mp3' },
    { char: 'ื', read: 'อือ', sound: 'uue.mp3' },
    { char: 'ุ', read: 'อุ', sound: 'u.mp3' },
    { char: 'ู', read: 'อู', sound: 'uu.mp3' },
    { char: 'เ ะ', read: 'เอะ', sound: 'e-ae.mp3' },
    { char: 'เ', read: 'เอ', sound: 'e.mp3' },
    { char: 'แ ะ', read: 'แอะ', sound: 'ae-ae.mp3' },
    { char: 'แ', read: 'แอ', sound: 'ae.mp3' },
    { char: 'โ ะ', read: 'โอะ', sound: 'o-ae.mp3' },
    { char: 'โ', read: 'โอ', sound: 'o.mp3' },
    { char: 'เ าะ', read: 'เอาะ', sound: 'e-aa.mp3' },
    { char: 'อ', read: 'ออ', sound: 'ao.mp3' },
    { char: 'เ  ิะ', read: 'เออะ', sound: 'e-o-ae.mp3' },
    { char: 'เ อ', read: 'เออ', sound: 'e-o.mp3' },
    { char: 'เ  ียะ', read: 'เอียะ', sound: 'e-ii-ya.mp3' },
    { char: 'เ  ีย', read: 'เอีย', sound: 'e-ii.mp3' },
    { char: 'เ  ือะ', read: 'เอือะ', sound: 'e-uu-o.mp3' },
    { char: 'เ  ือ', read: 'เอือ', sound: 'e-uu.mp3' },
    { char: 'ัวะ', read: 'อัวะ', sound: 'a-u-a.mp3' },
    { char: 'ัว', read: 'อัว', sound: 'a-u.mp3' },
    { char: 'ำ', read: 'อำ', sound: 'am.mp3' },
    { char: 'ใ', read: 'ใอ', sound: 'ai.mp3' },
    { char: 'ไ', read: 'ไอ', sound: 'aii.mp3' },
    { char: 'เ า', read: 'เอา', sound: 'e-a.mp3' },
    { char: 'ฤ', read: 'ฤๅ', sound: 'rue.mp3' },
    { char: 'ฤๅ', read: 'ฤๅ', sound: 'rue-lue.mp3' },
    { char: 'ฦ', read: 'ฦๅ', sound: 'lu.mp3' },
    { char: 'ฦๅ', read: 'ฦๅ', sound: 'lu-lue.mp3' },
    { char: 'ั', read: 'ไม้หันอากาศ', sound: 'mai-han-akat.mp3' },
    { char: '็', read: 'ไม้ไต่คู้', sound: 'mai-tai-khu.mp3' },
    { char: '์', read: 'ทัณฑฆาต', sound: 'thanthakhat.mp3' },
];

/** The four tone marks, in the order they are taught. */
const TONES: ReadableChar[] = [
    { char: '่', read: 'ไม้เอก', sound: 'mai-ek.mp3' },
    { char: '้', read: 'ไม้โท', sound: 'mai-tho.mp3' },
    { char: '๊', read: 'ไม้ตรี', sound: 'mai-tri.mp3' },
    { char: '๋', read: 'ไม้จัตวา', sound: 'mai-chattawa.mp3' },
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
