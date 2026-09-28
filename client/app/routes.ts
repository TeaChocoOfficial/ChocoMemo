// -Path: 'Vite-React-Router-TypeScript/app/routes.ts'
import { type RouteConfig, layout, index, route } from '@react-router/dev/routes';

export default [
    route(':lang', 'routes/$lang.tsx', [
        layout('routes/layout.tsx', [
            index('routes/page/home.tsx'),
            route('language-select', 'routes/page/language-select.tsx'),
            route('japanese', 'routes/page/japanese.tsx'),
            route('japanese/kana', 'routes/page/japanese/kana.tsx'),
            route('japanese/drill', 'routes/page/japanese/drill.tsx'),
            route('japanese/vocab', 'routes/page/japanese/vocabulary/vocabulary.tsx'),
            route(
                'japanese/vocab/:deckId',
                'routes/page/japanese/vocabulary/vocabulary.$deckId.tsx',
            ),
            route('japanese/render', 'routes/page/japanese/render/render.tsx'),
            route('japanese/render/:deckId', 'routes/page/japanese/render/render.$deckId.tsx'),
            route('japanese/exam', 'routes/page/japanese/exam/exam.tsx'),
            route('japanese/exam/:examId', 'routes/page/japanese/exam/exam.$examId.tsx'),
            route('japanese/review', 'routes/page/japanese/review/review.tsx'),
            route('japanese/review/:deckId', 'routes/page/japanese/review/review.$deckId.tsx'),
            route('english', 'routes/page/english.tsx'),
            route('english/vocab', 'routes/page/english/vocabulary/vocabulary.tsx'),
            route('english/render', 'routes/page/english/render/render.tsx'),
            route('english/review', 'routes/page/english/review/review.tsx'),
            route('english/exam', 'routes/page/english/exam/exam.tsx'),
            route('settings', 'routes/page/settings.tsx'),
            route('profile', 'routes/page/profile.tsx'),
            route('profile/:nameTag', 'routes/page/profile.$nameTag.tsx'),
            route('auth', 'routes/page/auth.tsx'),
            route('dev/swal', 'routes/page/dev/swal.tsx'),
            route('*', 'routes/not-found.tsx'),
        ]),
    ]),
] satisfies RouteConfig;
