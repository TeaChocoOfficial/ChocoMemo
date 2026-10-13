// -Path: 'client/app/pages/home/Home.tsx'
import HomeHero from './HomeHero';
import HomeStats from './HomeStats';
import HubNav from '~/components/page/HubNav';
import Section from '~/components/custom/Section';
import HomeLanguages from './HomeLanguages';
import HomeLibrary from './HomeLibrary';
import HomeHowItWorks from './HomeHowItWorks';
import HomeCta from './HomeCta';

/**
 * The landing page, which also acts as the hub: the destination rows follow the
 * active target language, so `/:lang` is both the marketing entry and the place
 * a learner picks what to study.
 */
export default function HomePage() {
    return (
        <>
            <HomeHero />
            <HomeStats />
            <HomeLanguages />
            <Section className='items-center'>
                <div className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
                    <HubNav />
                </div>
            </Section>
            <HomeLibrary />
            <HomeHowItWorks />
            <HomeCta />
        </>
    );
}
