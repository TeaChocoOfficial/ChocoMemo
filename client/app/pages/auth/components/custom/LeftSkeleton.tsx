// -Path: 'Vite-React-TypeScript/src/pages/auth/LeftSketon.tsx'
import Skeleton from '~/components/custom/Skeleton';

export default function LeftSkeleton() {
    return (
        <>
            <div className='flex items-center gap-3 mb-6'>
                <Skeleton className='h-10 w-10 rounded-xl' />
                <Skeleton className='h-6 w-32' />
            </div>
            <div className='space-y-5'>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-12 w-full rounded-xl' />
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-12 w-full rounded-xl' />
                </div>
                <Skeleton className='h-12 w-full rounded-xl' />
                <div className='relative py-2'>
                    <div className='w-full border-t border-border' />
                </div>
                <Skeleton className='h-12 w-full rounded-xl' />
            </div>
        </>
    );
}
