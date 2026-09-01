// -Path: "vite-react-typescript/src/components/screen/Processing.tsx"
import { useEffect, useState } from 'react';

export default function Processing({
    loading = null,
    importCompoent,
}: {
    loading?: React.ReactNode;
    importCompoent: Promise<{ default: React.ComponentType }>;
}) {
    const [Component, setComponent] = useState<React.ComponentType | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        importCompoent
            .then((module) => setComponent(() => module.default))
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!Component) return loading;
    return <Component />;
}
