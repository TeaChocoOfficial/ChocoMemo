// -Path: 'client/app/stores/examSets.store.ts'
// Local-first store for user exam sets.
// Default sets are built-in constants; user sets live in localStorage and
// come from custom-built or imported files. Cloud-synced sets are a future
// server feature — the schema already reserves 'imported' as the source.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ExamSet } from '~/types/exam';
import { importedExamSetSchema } from '~/utils/exam';

interface ExamSetsState {
    customSets: ExamSet[];
    importedSets: ExamSet[];
    addCustomSet: (examSet: ExamSet) => void;
    removeCustomSet: (id: string) => void;
    removeImportedSet: (id: string) => void;
    /** Parses + validates a raw JSON payload (already JSON.parse'd) and adds
     *  it as an imported set. Returns an error message on failure instead of
     *  throwing, so the UI can show it inline. */
    importSet: (raw: unknown) => { success: true } | { success: false; error: string };
}

const storage =
    typeof window !== 'undefined'
        ? createJSONStorage(() => localStorage)
        : undefined;

function newId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useExamSetsStore = create<ExamSetsState>()(
    persist(
        (set) => ({
            customSets: [],
            importedSets: [],

            addCustomSet: (examSet) =>
                set((state) => ({ customSets: [...state.customSets, examSet] })),

            removeCustomSet: (id) =>
                set((state) => ({ customSets: state.customSets.filter((s) => s.id !== id) })),

            removeImportedSet: (id) =>
                set((state) => ({ importedSets: state.importedSets.filter((s) => s.id !== id) })),

            importSet: (raw) => {
                const result = importedExamSetSchema.safeParse(raw);
                if (!result.success) {
                    return { success: false, error: 'This file is not a valid exam set.' };
                }

                const examSet: ExamSet = {
                    id: newId(),
                    source: 'imported',
                    createdAt: Date.now(),
                    ...result.data,
                };
                set((state) => ({ importedSets: [...state.importedSets, examSet] }));
                return { success: true };
            },
        }),
        {
            name: 'choco-exam-sets',
            storage,
            version: 2,
            migrate: (persistedState) => {
                if (!persistedState) return { customSets: [], importedSets: [] };
                const prev = persistedState as Partial<ExamSetsState>;
                return {
                    customSets: (prev.customSets ?? []).filter(isNewShapeSet),
                    importedSets: (prev.importedSets ?? []).filter(isNewShapeSet),
                };
            },
            partialize: (state) => ({
                customSets: state.customSets,
                importedSets: state.importedSets,
            }),
        },
    ),
);

// v1-v2 migration: pre-discriminated-union sets (flat questions with no
// `type` field) are dropped rather than migrated — they were generated from
// vocabulary so they're trivially re-creatable, and keeping half-valid data
// would render a broken session view.
function isNewShapeSet(set: ExamSet): boolean {
    return set.questions.every(
        (q) => q.type === 'meaning' || q.type === 'fillBlank',
    );
}

/** Combines default + custom + imported sets — the single place every page
 *  should read the full list from, so adding another source later (e.g.
 *  cloud-synced sets) only means editing this one function. */
export function useAllExamSets(defaultSets: ExamSet[]): ExamSet[] {
    const { customSets, importedSets } = useExamSetsStore();
    return [...defaultSets, ...customSets, ...importedSets];
}