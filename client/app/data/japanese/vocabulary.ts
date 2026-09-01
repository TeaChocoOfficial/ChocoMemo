// Default Japanese vocabulary words.

export interface VocabularyWord {
    id: string;
    japanese: string;
    reading: string;
    meaning: string;
}

export const DEFAULT_VOCABULARY: VocabularyWord[] = [
    { id: 'v1', japanese: '水', reading: 'みず', meaning: 'water' },
    { id: 'v2', japanese: '火', reading: 'ひ', meaning: 'fire' },
    { id: 'v3', japanese: '山', reading: 'やま', meaning: 'mountain' },
    { id: 'v4', japanese: '川', reading: 'かわ', meaning: 'river' },
    { id: 'v5', japanese: '空', reading: 'そら', meaning: 'sky' },
    { id: 'v6', japanese: '海', reading: 'うみ', meaning: 'sea' },
    { id: 'v7', japanese: '花', reading: 'はな', meaning: 'flower' },
    { id: 'v8', japanese: '木', reading: 'き', meaning: 'tree' },
    { id: 'v9', japanese: '犬', reading: 'いぬ', meaning: 'dog' },
    { id: 'v10', japanese: '猫', reading: 'ねこ', meaning: 'cat' },
    { id: 'v11', japanese: '鳥', reading: 'とり', meaning: 'bird' },
    { id: 'v12', japanese: '魚', reading: 'さかな', meaning: 'fish' },
    { id: 'v13', japanese: '本', reading: 'ほん', meaning: 'book' },
    { id: 'v14', japanese: '車', reading: 'くるま', meaning: 'car' },
    { id: 'v15', japanese: '電車', reading: 'でんしゃ', meaning: 'train' },
    { id: 'v16', japanese: '学校', reading: 'がっこう', meaning: 'school' },
    { id: 'v17', japanese: '友達', reading: 'ともだち', meaning: 'friend' },
    { id: 'v18', japanese: '食べる', reading: 'たべる', meaning: 'to eat' },
    { id: 'v19', japanese: '飲む', reading: 'のむ', meaning: 'to drink' },
    { id: 'v20', japanese: '行く', reading: 'いく', meaning: 'to go' },
];
