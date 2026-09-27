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
            route('japanese/exams', 'routes/page/japanese/exams/exams.tsx'),
            route('japanese/exams/:examId', 'routes/page/japanese/exams/exams.$examId.tsx'),
            route('japanese/review', 'routes/page/japanese/review.tsx'),
            route('japanese/review/:deckId', 'routes/page/japanese/review.$deckId.tsx'),
            route('settings', 'routes/page/settings.tsx'),
            route('profile', 'routes/page/profile.tsx'),
            route('profile/:nameTag', 'routes/page/profile.$nameTag.tsx'),
            route('auth', 'routes/page/auth.tsx'),
            route('dev/swal', 'routes/page/dev/swal.tsx'),
            route('*', 'routes/not-found.tsx'),
        ]),
    ]),
] satisfies RouteConfig;
