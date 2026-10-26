// -Path: 'client/app/hooks/characters/useCharacterToolbar.ts'
import type {
    CharLang,
    ActiveSet,
    OptionItem,
    OptionsItem,
    ActiveGroups,
} from '~/types/characters';
import {
    characterClipUrl,
    hasCharacterClips,
    playCharacterClip,
    stopCharacterClip,
    CHARACTER_CLIP_VOICES,
    type CharacterClipVoice,
} from '~/utils/characters/characterClip';
import useTargetLang from './useTargetLang';
import { useCallback, useEffect, useState } from 'react';
import { useReadProgressStore } from '~/stores/characters/readProgress.store';
import { useCharacterReaderStore } from '~/stores/characters/characterReader.store';
import { characterToolOptions, type CharacterToolOptions } from '~/data/characters';
import { useCharacterToolbarStore } from '~/stores/characters/characterToolbar.store';

/** The chart instance answering the Space shortcut: the last one mounted wins. */
let spaceToggle: (() => void) | null = null;

/**
 * The walk that is sounding, shared by every instance of the hook: a component
 * other than the one that started it must still be able to stop it.
 */
const walkRef = { current: false };


/** Whether the single window listener for the Space shortcut is bound. */
let spaceBound = false;

/** Binds the Space shortcut once, however many components mount the hook. */
function bindSpaceShortcut() {
    if (spaceBound || typeof window === 'undefined') return;
    spaceBound = true;
    window.addEventListener('keydown', (event) => {
        if (event.code !== 'Space' || !spaceToggle) return;
        const tag = (event.target as HTMLElement | null)?.tagName;
        if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        event.preventDefault();
        spaceToggle();
    });
}

/**
 * Everything a character chart needs, from one hook: the language, the active
 * set and group, the derived progress, and the reading walk. Sound is MP3 only
 * — the clips shipped in `public/<lang>/sound` — so a chart without clips stays
 * silent instead of falling back to a synthesized voice (English, Japanese and
 * Thai ship clips).
 *
 * Mount it in every chart component: the walk state lives in stores, so the
 * toolbar, the grid and the stats always agree.
 *
 * @returns The chart state, the sounding voice, and the reading controls.
 */
export function useCharacterToolbar<Lang extends CharLang, Items extends OptionItem<Lang>>(): {
    lang: Lang;
    items: Items;
    voice: string;
    volume: number;
    groupList: Items;
    readSoFar: number;
    isResume: boolean;
    isReading: boolean;
    groupTotal: number;
    percentRead: number;
    displayChar: string;
    stickyEnabled: boolean;
    activeSet: ActiveSet[Lang];
    activeGroup: ActiveGroups[Lang];
    readingChar: string | null;
    options: CharacterToolOptions[Lang];
    stopReading: () => void;
    startReading: () => void;
    setVoice: (voice: string) => void;
    setVolume: (volume: number) => void;
    speak: (sound: string) => void;
    setStickyEnabled: (enabled: boolean) => void;
    setActiveSet: (value: ActiveSet[Lang]) => void;
    setActiveGroup: (value: ActiveGroups[Lang]) => void;
    handleCardRead: (item: OptionItem<Lang>[number], index: number) => void;
} {
    const {
        stickyEnabled,
        getActiveSet,
        setActiveSet,
        getActiveGroup,
        setActiveGroup,
        setStickyEnabled,
    } = useCharacterToolbarStore();

    const { code } = useTargetLang();
    if ([undefined, 'other'].includes(code)) throw Error('code is undefined');
    const lang = code as Lang;

    const options = characterToolOptions[lang];
    const activeSet = getActiveSet(lang);
    const activeGroup = getActiveGroup(lang);
    const [hydrated, setHydrated] = useState(false);
    const items = (options.items as OptionsItem<Lang>)[activeSet][activeGroup] as Items;
    const { isReading, readingChar, setReading, setReadingChar, resetReading } =
        useCharacterReaderStore();
    const { voice, volume, setVoice, setVolume, progress, recordRead } = useReadProgressStore();

    // The clip voice the learner picked, sanitized: an old persisted value
    // (e.g. a Google voice name) would point at a folder that does not exist
    // and every tap would be silent.
    const clipVoice: CharacterClipVoice = CHARACTER_CLIP_VOICES.includes(
        voice as CharacterClipVoice,
    )
        ? (voice as CharacterClipVoice)
        : 'female';

    const progressKey = `${activeSet}:${activeGroup}`;
    const groupList = items.filter((item) => item.char) as Items;
    const groupTotal = groupList.length;
    const lastReadIndex = progress[progressKey] ?? 0;
    const displayChar = readingChar ?? items[lastReadIndex]?.char ?? null;
    const readSoFar = displayChar
        ? groupList.findIndex((item) => item.char === displayChar) + 1
        : 0;
    const isResume = readSoFar > 0;
    const percentRead = groupTotal ? Math.round((readSoFar / groupTotal) * 100) : 0;

    const stopReading = useCallback(() => {
        walkRef.current = false;
        stopCharacterClip();
        resetReading();
    }, [resetReading]);

    /**
     * One character, out loud: the shipped MP3 clip, and nothing else. A tap or
     * a preview during a walk ends the walk first, so the two never share the
     * speaker and a walk can never be left half-sounding.
     */
    const speak = useCallback(
        (sound: string) => {
            if (walkRef.current) stopReading();
            const clip = characterClipUrl(lang, sound, clipVoice);
            if (clip) playCharacterClip(clip, volume);
        },
        [lang, clipVoice, volume, stopReading],
    );

    const startReading = useCallback(() => {
        if (typeof window === 'undefined' || !hasCharacterClips(lang) || items.length === 0) return;
        let index = progress[progressKey] ?? 0;
        if (index >= items.length) index = 0;
        stopCharacterClip();
        walkRef.current = true;
        setReading(true);

        const step = (position: number) => {
            if (!walkRef.current) return;
            const item = items[position];

            if (!item) {
                recordRead(progressKey, 0);
                walkRef.current = false;
                resetReading();
                return;
            }

            if (!item.char) return step(position + 1);

            setReadingChar(item.char);

            // Advance only after the sound really finished, so the walk keeps
            // the chart's pace instead of racing through the set. One step can
            // only advance once: a late `ended` must not skip a character.
            let advanced = false;
            const next = () => {
                if (advanced || !walkRef.current) return;
                advanced = true;
                recordRead(progressKey, position);
                step(position + 1);
            };

            const clip = characterClipUrl(lang, item.sound, clipVoice);
            if (!clip) return next();
            // A clip that cannot play (blocked audio, missing file) ends the
            // walk instead of racing through the rest with no sound.
            playCharacterClip(clip, volume, next, stopReading);
        };

        step(index);
    }, [
        items,
        progress,
        progressKey,
        recordRead,
        lang,
        volume,
        clipVoice,
        setReading,
        setReadingChar,
        resetReading,
        stopReading,
    ]);

    /** A tap on a card: stop a running walk and make that card the resume point. */
    const handleCardRead = useCallback(
        (item: OptionItem<Lang>[number], index: number) => {
            if (walkRef.current) stopReading();
            recordRead(progressKey, index);
            setReadingChar(item.char);
        },
        [progressKey, recordRead, stopReading, setReadingChar],
    );

    const toggleReading = useCallback(() => {
        if (walkRef.current) stopReading();
        else startReading();
    }, [startReading, stopReading]);

    useEffect(() => setHydrated(true), []);

    useEffect(() => {
        spaceToggle = toggleReading;
        bindSpaceShortcut();
        return () => {
            if (spaceToggle === toggleReading) spaceToggle = null;
        };
    }, [toggleReading]);

    // A walk holds the item list it started with, so a set or group change
    // must end it instead of reading the old list under the new heading.
    useEffect(() => {
        if (walkRef.current) stopReading();
    }, [progressKey, stopReading]);

    // Leaving the chart stops its sound too: a clip must never outlive the
    // page that started it.
    useEffect(() => {
        return () => {
            if (walkRef.current) stopReading();
        };
    }, [stopReading]);

    return {
        lang,
        items,
        voice: clipVoice,
        volume,
        groupList,
        readSoFar,
        isResume,
        isReading,
        groupTotal,
        percentRead,
        displayChar,
        activeSet,
        activeGroup,
        readingChar,
        options,
        stopReading,
        startReading,
        setVoice,
        setVolume,
        speak,
        setStickyEnabled,
        setActiveSet: (value: ActiveSet[Lang]) => setActiveSet(lang, value),
        setActiveGroup: (value: ActiveGroups[Lang]) => setActiveGroup(lang, value),
        handleCardRead,
        stickyEnabled: hydrated ? stickyEnabled : false,
    };
}
