// -Path: 'Vite-React-Router-TypeScript/app/data/portfolioData.ts'
import type { IconType } from 'react-icons';
import { TbTemplate } from 'react-icons/tb';
import { FaCode, FaList, FaGlobe, FaRobot, FaServer, FaDatabase, FaCubesStacked } from 'react-icons/fa6';
import { SiCss, SiVite, SiReact, SiHtml5, SiRender, SiGithub, SiDocker, SiPython, SiNestjs, SiVercel, SiDiscord, SiExpress, SiMongodb, SiNodedotjs, SiNextdotjs, SiThreedotjs, SiJavascript, SiTypescript, SiTailwindcss, SiSocketdotio } from 'react-icons/si';

export interface Skill {
    id: string;
    name: string;
    level: number;
    category: 'frontend' | 'backend' | 'devops' | 'database' | 'language';
    icon: IconType;
    color: string;
}

export interface Project {
    id: string;
    titleKey: string;
    descKey: string;
    tags: string[];
    categorys: ('web' | 'bot' | 'server' | 'template' | 'public')[];
    github?: string;
    live?: string;
}

export const categories = ['all', 'web', 'bot', 'server', 'template', 'public'] as const;

export type CategoryKeys = (typeof categories)[number];

export const categoryIcons: Record<CategoryKeys, IconType> = {
    all: FaList,
    web: FaGlobe,
    bot: FaRobot,
    server: FaServer,
    public: FaGlobe,
    template: TbTemplate,
};

export const projects: Project[] = [
    {
        id: 'portfolio',
        titleKey: 'portfolio.projects.portfolio.title',
        descKey: 'portfolio.projects.portfolio.desc',
        tags: ['TypeScript', 'Vite', 'React', 'Threejs'],
        categorys: ['public', 'web'],
        github: 'https://github.com/TeaChoco/TeaChoco',
        live: '/',
    },
    {
        id: 'poke-rotom',
        titleKey: 'portfolio.projects.pokeRotom.title',
        descKey: 'portfolio.projects.pokeRotom.desc',
        tags: ['TypeScript', 'Vite', 'React', 'Nodejs', 'Threejs', 'SocketIO'],
        categorys: ['public', 'web'],
        github: 'https://github.com/TeaChocoOfficial/PokeRotom',
        live: 'https://pokerotom.vercel.app',
    },
    {
        id: 'vite-extra-react-ssr-typescript-template',
        titleKey: 'portfolio.projects.viteExtraReactSsr.title',
        descKey: 'portfolio.projects.viteExtraReactSsr.desc',
        tags: ['TypeScript', 'Vite', 'React', 'SSR', 'TailwindCSS'],
        categorys: ['web', 'template'],
        github: 'https://github.com/TeaChoco/Vite-Extra-React-SSR-TypeScript',
    },
    {
        id: 'vite-react-typescript-template',
        titleKey: 'portfolio.projects.viteReact.title',
        descKey: 'portfolio.projects.viteReact.desc',
        tags: ['TypeScript', 'Vite', 'React', 'TailwindCSS', 'SocketIO'],
        categorys: ['web', 'template'],
        github: 'https://github.com/TeaChoco/Vite-React-TypeScript',
    },
    {
        id: 'express-typescript-template',
        titleKey: 'portfolio.projects.express.title',
        descKey: 'portfolio.projects.express.desc',
        tags: ['TypeScript', 'Nodejs', 'Expressjs', 'SocketIO'],
        categorys: ['server', 'template'],
        github: 'https://github.com/TeaChoco/Express-TypeScript',
    },
    {
        id: 'choco-developer-bot',
        titleKey: 'portfolio.projects.chocoDeveloperBot.title',
        descKey: 'portfolio.projects.chocoDeveloperBot.desc',
        tags: ['TypeScript', 'Nodejs', 'Discordjs', 'MongoDB'],
        categorys: ['bot'],
        github: 'https://github.com/TeaChocoOfficial/Choco-Developer-Bot',
    },
];

export const skills: Skill[] = [
    {
        id: 'Nodejs',
        name: 'Node.js',
        level: 98,
        category: 'backend',
        icon: SiNodedotjs,
        color: '#339933',
    },
    {
        id: 'React',
        name: 'React.js',
        level: 92,
        category: 'frontend',
        icon: SiReact,
        color: '#61DAFB',
    },
    {
        id: 'TypeScript',
        name: 'TypeScript',
        level: 90,
        category: 'language',
        icon: SiTypescript,
        color: '#3178C6',
    },
    {
        id: 'TailwindCSS',
        name: 'Tailwind CSS',
        level: 88,
        category: 'frontend',
        icon: SiTailwindcss,
        color: '#06B6D4',
    },
    {
        id: 'JavaScript',
        name: 'JavaScript',
        level: 85,
        category: 'language',
        icon: SiJavascript,
        color: '#F7DF1E',
    },
    {
        id: 'GitGitHub',
        name: 'Git & GitHub',
        level: 80,
        category: 'devops',
        icon: SiGithub,
        color: '#181717',
    },
    {
        id: 'Nextjs',
        name: 'Next.js',
        level: 78,
        category: 'frontend',
        icon: SiNextdotjs,
        color: '#000000',
    },
    {
        id: 'Expressjs',
        name: 'Express.js',
        level: 75,
        category: 'backend',
        icon: SiExpress,
        color: '#7F7F7F',
    },
    {
        id: 'SocketIO',
        name: 'Socket.io',
        level: 74,
        category: 'backend',
        icon: SiSocketdotio,
        color: '#010101',
    },
    {
        id: 'Threejs',
        name: 'Three.js',
        level: 72,
        category: 'frontend',
        icon: SiThreedotjs,
        color: '#000000',
    },
    {
        id: 'MongoDB',
        name: 'MongoDB',
        level: 70,
        category: 'database',
        icon: SiMongodb,
        color: '#47A248',
    },
    {
        id: 'Nestjs',
        name: 'Nest.js',
        level: 64,
        category: 'backend',
        icon: SiNestjs,
        color: '#EA2845',
    },
    {
        id: 'Discordjs',
        name: 'Discord.js',
        level: 60,
        category: 'backend',
        icon: SiDiscord,
        color: '#5865F2',
    },
    {
        id: 'Vercel',
        name: 'Vercel',
        level: 52,
        category: 'devops',
        icon: SiVercel,
        color: '#000000',
    },
    {
        id: 'Rendercom',
        name: 'Render.com',
        level: 50,
        category: 'devops',
        icon: SiRender,
        color: '#46A3FF',
    },
    {
        id: 'Docker',
        name: 'Docker',
        level: 30,
        category: 'devops',
        icon: SiDocker,
        color: '#2496ED',
    },
    {
        id: 'Python',
        name: 'Python',
        level: 20,
        category: 'language',
        icon: SiPython,
        color: '#3776ab',
    },
];
