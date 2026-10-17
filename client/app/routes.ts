// -Path: 'client/app/routes.ts'
import { type RouteConfig, layout, index, route } from '@react-router/dev/routes';

/**
 * Every route is nested under `:lang` (the UI locale). The study language is a
 * filter, not a path segment: deck lists read `?target=ja`, and the character
 * routes carry the target in `:target`. Account routes are unchanged.
 */
export default [
    route(':lang', 'routes/$lang.tsx', [
        route('edit', 'routes/page/edit.tsx'),
        layout('routes/layout.tsx', [
            index('routes/page/home.tsx'),
            route('study', 'routes/page/study.tsx'),
            route('decks/:deckId', 'routes/page/decks/$deckId.tsx'),
            route('vocab', 'routes/page/vocab/vocab.tsx'),
            route('vocab/:deckId', 'routes/page/vocab/vocab.$deckId.tsx'),
            route('render', 'routes/page/render/render.tsx'),
            route('render/:deckId', 'routes/page/render/render.$deckId.tsx'),
            route('exam', 'routes/page/exam/exam.tsx'),
            route('exam/:deckId', 'routes/page/exam/exam.$deckId.tsx'),
            route('review', 'routes/page/review/review.tsx'),
            route('review/:deckId', 'routes/page/review/review.$deckId.tsx'),
            route('characters/:target', 'routes/page/characters/$target.tsx'),
            route('drill/:target', 'routes/page/drill/$target.tsx'),
            route('settings', 'routes/page/settings.tsx'),
            route('profile', 'routes/page/profile/profile.tsx'),
            route('profile/:nameTag', 'routes/page/profile/profile.$nameTag.tsx'),
            route('auth', 'routes/page/auth.tsx'),
            route('dev/swal', 'routes/page/dev/swal.tsx'),
            route('*', 'routes/not-found.tsx'),
        ]),
    ]),
] satisfies RouteConfig;
