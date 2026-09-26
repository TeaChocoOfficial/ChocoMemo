// -Path: 'client/app/components/custom/WordPicker.tsx'
// Searchable multi-select list of vocabulary words, used by the custom
// exam-set and custom-deck creation forms.
import { useMemo, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useLangText } from '~/hooks/useLangText';
import type { VocabWord } from '~/types/vocabulary';

interface WordPickerProps {
    words: VocabWord[];
    selected: string[];
    onToggle: (id: string) => void;
    placeholder: string;
}

export default function WordPicker({ words, selected, onToggle, placeholder }: WordPickerProps) {
    const locale = useLangText();
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return words;
        return words.filter(
            (w) =>
                w.word.toLowerCase().includes(q) ||
                w.reading.toLowerCase().includes(q) ||
                locale(w.meaning).toLowerCase().includes(q),
        );
    }, [words, query, locale]);

    return (
        <div>
            <div className='relative'>
                <FaMagnifyingGlass className='pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-muted' />
                <input
                    type='search'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className='w-full border-b border-line-strong bg-transparent py-2 pl-5 pr-2 font-mono text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-primary'
                />
            </div>

            <div className='mt-2 max-h-56 overflow-y-auto rounded-sm border border-line bg-surface/40 scrollbar-thin'>
                {filtered.length === 0 ? (
                    <p className='px-3 py-6 text-center text-xs text-surface-muted'>
                        {placeholder}
                    </p>
                ) : (
                    filtered.map((w) => {
                        const isSelected = selected.includes(w.id);
                        return (
                            <label
                                key={w.id}
                                className='flex cursor-pointer items-center gap-3 border-b border-line/60 px-3 py-2 last:border-b-0 transition-colors hover:bg-surface-overlay'
                            >
                                <input
                                    type='checkbox'
                                    checked={isSelected}
                                    onChange={() => onToggle(w.id)}
                                    className='h-4 w-4 shrink-0 accent-primary'
                                />
                                <span className='min-w-0 flex-1'>
                                    <span className='block text-sm font-semibold text-surface-foreground'>
                                        {w.word}
                                        <span className='ml-1.5 font-normal text-surface-muted'>
                                            {w.reading}
                                        </span>
                                    </span>
                                    <span className='block truncate text-xs text-surface-subtle'>
                                        {locale(w.meaning)}
                                    </span>
                                </span>
                            </label>
                        );
                    })
                )}
            </div>
        </div>
    );
}