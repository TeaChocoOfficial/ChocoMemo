// -Path: 'client/app/components/edit/PanelMessage.tsx'
import type { ReactNode } from 'react';

/** Centered placeholder shown inside a dock panel that has no content yet. */
export default function PanelMessage({ children }: { children: ReactNode }) {
    return (
        <div className='flex h-full items-center justify-center p-6 text-center text-sm text-surface-muted'>
            {children}
        </div>
    );
}
