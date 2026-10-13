// -Path: 'client/app/components/edit/useDeckPreview.ts'
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DeckData } from '~/types/deck';
import { resolveText } from '~/hooks/useLangText';
import { useVocabularyStore } from '~/stores/japanese/vocabulary.store';
import {
    useDeckListLocalStore,
    deckPassages,
    deckQuestions,
} from '~/stores/deck/deckListLocal.store';

/** One row of the deck preview: a content item resolved to display text. */
export interface PreviewItem {
    id: string;
    primary: string;
    secondary?: string;
}

/**
 * Resolves the selected deck's `contentIds` into display rows for the preview
 * panel. Words come from the vocabulary store, passages and questions from the
 * local deck store; an id that no longer resolves is skipped rather than shown
 * raw.
 *
 * @param deck - The deck to preview, or `null`.
 * @returns The resolved rows, in the deck's order.
 */
export function useDeckPreview(deck: DeckData | null): PreviewItem[] {
    const { i18n } = useTranslation();
    const custom = useVocabularyStore((state) => state.custom);
    const passages = useDeckListLocalStore((state) => state.passages);
    const questions = useDeckListLocalStore((state) => state.questions);

    return useMemo(() => {
        if (!deck) return [];
        const lang = i18n.language;

        if (deck.type === 'vocab' || deck.type === 'review') {
            const words = useVocabularyStore.getState().all();
            return deck.contentIds.flatMap((id) => {
                const word = words.find((item) => item.id === id);
                return word ? [{ id, primary: word.word, secondary: word.reading }] : [];
            });
        }

        if (deck.type === 'render') {
            return deckPassages(deck).map((passage) => ({
                id: passage.id,
                primary: passage.title,
                secondary: resolveText(passage.translation, lang),
            }));
        }

        if (deck.type === 'exam') {
            return deckQuestions(deck).map((question) => ({
                id: question.id,
                primary:
                    question.type === 'meaning'
                        ? question.prompt
                        : `${question.sentenceBefore} ＿＿ ${question.sentenceAfter}`,
                secondary: resolveText(question.correctAnswer, lang),
            }));
        }

        return [];
    }, [deck, custom, passages, questions, i18n.language]);
}
