// -Path: 'Vite-React-TypeScript/src/pages/threejs/Threejs.tsx'
import { motion } from 'framer-motion';
import SceneViewer from './SceneViewer';
import ThreejsHero from './ThreejsHero';
import ThreejsInfo from './ThreejsInfo';

export default function ThreejsPage() {
    return (
        <motion.section
            transition={{ duration: 0.8 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            className='py-16 sm:py-24'
        >
            <div className='mx-auto max-w-6xl px-4 sm:px-6'>
                <ThreejsHero />

                <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='mb-20 w-full h-125 sm:h-150 rounded-2xl overflow-hidden border border-border bg-surface-overlay/30'
                >
                    <SceneViewer />
                </motion.div>

                <ThreejsInfo />
            </div>
        </motion.section>
    );
}
