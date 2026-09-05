// -Path: 'Vite-React-Router-TypeScript/app/routes.ts'
import { type RouteConfig, layout, index, route } from '@react-router/dev/routes';

export default [
    route(':lang', 'routes/$lang.tsx', [
        layout('routes/layout.tsx', [
            index('routes/page/home.tsx'),
            route('language-select', 'routes/page/language-select.tsx'),
            route('japanese', 'routes/page/japanese.tsx'),
            route('japanese/kana', 'routes/page/japanese/kana.tsx'),
            route('japanese/kana-drill', 'routes/page/japanese/kana-drill.tsx'),
            route('japanese/vocabulary', 'routes/page/japanese/vocabulary.tsx'),
            route('japanese/vocabulary-review', 'routes/page/japanese/vocabulary-review.tsx'),
            route('japanese/vocabulary-review/:dexId', 'routes/page/japanese/vocabulary-review.$dexId.tsx'),
            route('*', 'routes/not-found.tsx'),
        ]),
    ]),
] satisfies RouteConfig;
