// -Path: 'client/app/data/japanese/renderPassages.ts'
import type { RenderPassage } from '~/types/render';

/**
 * Sample reading material for the Render page.
 *
 * Mock content: short graded passages with per-kanji furigana and translations,
 * so the reader view has something real to exercise. Passages are stored
 * separately from their decks so several decks can share one passage, mirroring
 * how vocabulary decks reference words by id.
 */
export const DEFAULT_PASSAGES: RenderPassage[] = [
    {
        id: 'p-station',
        title: 'At the Station',
        note: {
            'en': 'Station announcements and a simple notice.',
            'ja': '駅のアナウンスとお知らせ。',
            'th': 'ประกาศที่สถานีและข้อความแจ้งเตือนง่าย ๆ',
            'zh': '车站广播与简单通知。',
            'ko': '역내 안내와 간단한 안내문.',
            'vi': 'Thông báo nhà ga và một thông báo đơn giản.',
        },
        lines: [
            {
                segments: [
                    { ch: '次', rt: 'つぎ' },
                    { ch: 'の' },
                    { ch: '電車', rt: 'でんしゃ' },
                    { ch: 'は' },
                    { ch: '三', rt: 'さん' },
                    { ch: '番線', rt: 'ばんせん' },
                    { ch: 'から' },
                    { ch: '出', rt: 'で' },
                    { ch: 'ます' },
                    { ch: '。' },
                ],
            },
            {
                segments: [
                    { ch: '忘', rt: 'わす' },
                    { ch: 'れ' },
                    { ch: '物', rt: 'もの' },
                    { ch: 'に' },
                    { ch: 'ご' },
                    { ch: '注', rt: 'ちゅう' },
                    { ch: '意', rt: 'い' },
                    { ch: 'して' },
                    { ch: 'ください' },
                    { ch: '。' },
                ],
            },
        ],
        translation: {
            'en': 'The next train leaves from platform 3. Please mind your belongings.',
            'ja': '次の電車は三番線から出ます。',
            'th': 'รถไฟขบวนถัดไปออกจากชานชาลาหมายเลข 3',
            'zh': '下一班列车从3号站台发车。',
            'ko': '다음 열차는 3번 승강장에서 출발합니다.',
            'vi': 'Tàu tiếp theo khởi hành từ sân 3.',
        },
    },
    {
        id: 'p-shop',
        title: 'At the Shop',
        note: {
            'en': 'Counting items and asking the price.',
            'ja': '品物を数え、値段を聞く。',
            'th': 'นับสินค้าและถามราคา',
            'zh': '数商品并询价。',
            'ko': '상품을 세고 가격을 묻기.',
            'vi': 'Đếm món hàng và hỏi giá.',
        },
        lines: [
            {
                segments: [
                    { ch: 'これ', rt: 'これ' },
                    { ch: 'は' },
                    { ch: '三', rt: 'さん' },
                    { ch: '百', rt: 'ひゃく' },
                    { ch: '円', rt: 'えん' },
                    { ch: 'です' },
                    { ch: '。' },
                ],
            },
            {
                segments: [
                    { ch: '安', rt: 'やす' },
                    { ch: 'い' },
                    { ch: 'もの', rt: 'もの' },
                    { ch: 'は' },
                    { ch: '何', rt: 'なに' },
                    { ch: 'です' },
                    { ch: 'か' },
                    { ch: '。' },
                ],
            },
        ],
        translation: {
            'en': 'This is 300 yen. What is the cheap thing?',
            'ja': 'これは三百円です。安いものは何ですか。',
            'th': 'อันนี้สามร้อยเยน ของที่ถูกคืออะไร',
            'zh': '这个是300日元。便宜的东西是什么？',
            'ko': '이건 300엔이에요. 싼 건 뭐예요?',
            'vi': 'Cái này ba trăm yên. Món rẻ là món gì?',
        },
    },
    {
        id: 'p-weather',
        title: "This Week's Weather",
        note: {
            'en': 'Days of the week and weather words.',
            'ja': '曜日と天気の言葉。',
            'th': 'วันในสัปดาห์และคำเกี่ยวกับสภาพอากาศ',
            'zh': '星期与天气词。',
            'ko': '요일과 날씨 표현.',
            'vi': 'Các ngày trong tuần và từ vựng thời tiết.',
        },
        lines: [
            {
                segments: [
                    { ch: '今日', rt: 'きょう' },
                    { ch: 'は' },
                    { ch: '雨', rt: 'あめ' },
                    { ch: 'です' },
                    { ch: '。' },
                ],
            },
            {
                segments: [
                    { ch: '来週', rt: 'らいしゅう' },
                    { ch: 'の' },
                    { ch: '火', rt: 'か' },
                    { ch: '曜日', rt: 'ようび' },
                    { ch: 'は' },
                    { ch: '晴', rt: 'は' },
                    { ch: 'れ' },
                    { ch: 'です' },
                    { ch: '。' },
                ],
            },
        ],
        translation: {
            'en': 'It is rainy today. Tuesday next week will be sunny.',
            'ja': '今日は雨です。来週の火曜日は晴れです。',
            'th': 'วันนี้ฝนตก วันอังคารสัปดาห์หน้าจะอากาศแจ่ม',
            'zh': '今天下雨。下周二是晴天。',
            'ko': '오늘은 비예요. 다음 주 화요일은 맑아요.',
            'vi': 'Hôm nay trời mưa. Thứ Ba tuần sau trời nắng.',
        },
    },
];
