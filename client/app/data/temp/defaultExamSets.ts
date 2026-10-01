// -Path: 'client/app/data/japanese/defaultExamSets.ts'
import { DEFAULT_VOCABULARY } from '../japanese/vocabulary';
import { buildExamSetFromVocabulary } from '~/utils/exam';

/** Default exam sets are derived from DEFAULT_VOCABULARY automatically, so
 *  no questions need to be written by hand. Options are re-shuffled on
 *  every page load. */
export const defaultExamSets = [
    buildExamSetFromVocabulary(DEFAULT_VOCABULARY, {
        id: 'default-basic-nouns',
        title: 'Basic Nouns',
        description: 'Everyday nouns — nature, animals, objects.',
    }),
];