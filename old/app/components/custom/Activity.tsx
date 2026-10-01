// -Path: 'Vite-React-Router-TypeScript/app/components/custom/Activity.tsx'
import { Activity as ReactActivity } from 'react';

interface ActivityProps {
    visible?: boolean;
    mode?: 'visible' | 'hidden';
    children: React.ReactNode;
}

export default function Activity({ children, visible, mode }: ActivityProps) {
    return (
        <ReactActivity mode={mode ? mode : visible ? 'visible' : 'hidden'}>
            {children}
        </ReactActivity>
    );
}
