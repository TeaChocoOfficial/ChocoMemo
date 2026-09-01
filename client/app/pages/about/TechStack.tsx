// -Path: 'Vite-React-Router-TypeScript/app/pages/about/TechStack.tsx'
import {
    SiVite,
    SiReact,
    SiFramer,
    SiI18Next,
    SiTypescript,
    SiThreedotjs,
    SiTailwindcss,
    SiSocketdotio,
    SiReactrouter,
} from 'react-icons/si';
import { FaCubesStacked } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

const techStack = [
    { name: 'TypeScript 6', color: 'text-[#3178C6]', icon: <SiTypescript /> },
    { name: 'React Router 7', color: 'text-[#CA4245]', icon: <SiReactrouter /> },
    { name: 'Vite 8', color: 'text-[#646CFF]', icon: <SiVite /> },
    { name: 'React 19', color: 'text-[#61DAFB]', icon: <SiReact /> },
    { name: 'i18next 26', color: 'text-[#26A69A]', icon: <SiI18Next /> },
    { name: 'Tailwind CSS 4', color: 'text-[#06B6D4]', icon: <SiTailwindcss /> },
    { name: 'Three.js', color: 'text-[#010101] dark:text-white', icon: <SiThreedotjs /> },
    { name: 'Socket.io 4', color: 'text-[#010101] dark:text-white', icon: <SiSocketdotio /> },
    { name: 'Zustand 5', color: 'text-[#433929] dark:text-warning', icon: <FaCubesStacked /> },
    { name: 'Framer Motion 12', color: 'text-[#E10098]', icon: <SiFramer /> },
];

export default function TechStack() {
    const { t } = useTranslation();

    return (
        <div className='mb-12'>
            <h2 className='text-2xl font-bold text-surface-foreground mb-6'>
                {t('about.tech_stack')}
            </h2>
            <div className='flex flex-wrap gap-3'>
                {techStack.map((tech) => (
                    <span
                        key={tech.name}
                        className='inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-surface-overlay text-sm font-semibold transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5'
                    >
                        <span className={tech.color}>{tech.icon}</span>
                        <span className='text-surface-foreground'>{tech.name}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
