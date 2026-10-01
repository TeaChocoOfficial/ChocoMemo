//-Path: "vite-extra-react-ssr-ts/src/components/layout/Providers.tsx"
import Setup from './Setup';

export default function Providers({ children }: { children: React.ReactNode }) {
    return <Setup>{children}</Setup>;
}
