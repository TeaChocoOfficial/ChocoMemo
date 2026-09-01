// -Path: 'Vite-React-TypeScript\src\pages\threejs\SceneViewer.tsx'
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import FloatingShapes from './FloatingShapes';
import { useTranslation } from 'react-i18next';
import { OrbitControls } from '@react-three/drei';

export default function SceneViewer() {
    const { t } = useTranslation();

    return (
        <Suspense
            fallback={
                <div className='flex items-center justify-center h-full w-full text-surface-muted'>
                    {t('threejs.loading')}
                </div>
            }
        >
            <Canvas
                dpr={[1, 1.5]}
                frameloop='always'
                className='rounded-2xl'
                camera={{ position: [0, 0, 6], fov: 50 }}
                gl={{ powerPreference: 'high-performance', antialias: true }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <directionalLight position={[-5, -5, -5]} intensity={0.3} />
                <pointLight position={[0, 3, 0]} intensity={0.5} color='#646CFF' />
                <FloatingShapes />
                <OrbitControls enablePan={true} enableZoom={true} autoRotate autoRotateSpeed={1} />
            </Canvas>
        </Suspense>
    );
}
