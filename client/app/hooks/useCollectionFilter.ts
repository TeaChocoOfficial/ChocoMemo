// -Path: 'client/app/hooks/useCollectionFilter.ts'
// Generic search-text filtering for collection pages. Knows nothing about
// tabs — it only filters whatever list it's given by a case-insensitive
// substring match against getSearchText(item).
import { useMemo, useState } from 'react';

export function useCollectionFilter<T>(items: T[], getSearchText: (item: T) => string) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return items;
        return items.filter((item) => getSearchText(item).toLowerCase().includes(query));
    }, [items, search, getSearchText]);

    return { search, setSearch, filtered };
}
