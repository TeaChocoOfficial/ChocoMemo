// -Path: 'Vite-React-TypeScript/src/pages/auth/RightSketon.tsx'
import Skeleton from '~/components/custom/Skeleton';

export default function RightSkeleton() {
    return (
        <>
            <div className='flex items-center gap-3 mb-6'>
                <Skeleton className='h-10 w-10 rounded-xl' />
                <Skeleton className='h-6 w-40' />
            </div>
            <div className='space-y-5'>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-12 w-full rounded-xl' />
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-12 w-full rounded-xl' />
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-12 w-full rounded-xl' />
                </div>
                <Skeleton className='h-12 w-full rounded-xl' />
            </div>
        </>
    );
}
