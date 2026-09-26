// -Path: 'client/app/pages/home/Home.tsx'
import HomeHero from './HomeHero';
import HomeStats from './HomeStats';
import HomeLanguages from './HomeLanguages';
import HomeLibrary from './HomeLibrary';
import HomeHowItWorks from './HomeHowItWorks';
import HomeCta from './HomeCta';

export default function HomePage() {
    return (
        <>
            <HomeHero />
            <HomeStats />
            <HomeLanguages />
            <HomeLibrary />
            <HomeHowItWorks />
            <HomeCta />
        </>
    );
}
