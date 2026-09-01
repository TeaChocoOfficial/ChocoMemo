// -Path: 'Vite-React-Router-TypeScript/app/pages/about/About.tsx'
import TechStack from './TechStack';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import ArchitectureCard from './ArchitectureCard';

export default function AboutPage() {
    return (
        <motion.section
            transition={{ duration: 0.8 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            className='py-16 sm:py-24'
        >
            <div className='mx-auto max-w-4xl px-4 sm:px-6'>
                <HeroSection />
                <TechStack />
                <ArchitectureCard />
            </div>
        </motion.section>
    );
}
