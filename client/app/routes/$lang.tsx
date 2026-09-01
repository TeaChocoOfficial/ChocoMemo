// -Path: 'Vite-React-Router-TypeScript/app/routes/$lang.tsx'
import i18n from '~/i18n';
import { redirect } from 'react-router';
import { isValidLang } from '~/i18n/locales';
import { Outlet, useParams } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ params }: LoaderFunctionArgs) {
    const lang = params.lang;

    if (!lang || !isValidLang(lang)) return redirect(`/${i18n.language}`);

    return { lang };
}

export default function LangLayout() {
    const { lang } = useParams();

    if (lang && i18n.language !== lang) i18n.changeLanguage(lang);

    return <Outlet />;
}
