// -Path: 'client/app/pages/home/Home.tsx'
import HomeHero from './HomeHero';
import HomeStats from './HomeStats';
import HomeLanguages from './HomeLanguages';
import HomeLibrary from './HomeLibrary';
import HomeCta from './HomeCta';

/**
 * The Landing page: introduces the app and lets the visitor pick a language.
 * The study destinations live on the study hub (`/:lang/study`), so the Landing
 * has no study navigation of its own.
 */
export default function HomePage() {
    return (
        <>
            <HomeHero />
            <HomeStats />
            <HomeLanguages />
            <HomeLibrary />
            {/* <HomeSpace /> */}
            {/* <HomeHowItWorks /> */}
            <HomeCta />
        </>
    );
}
