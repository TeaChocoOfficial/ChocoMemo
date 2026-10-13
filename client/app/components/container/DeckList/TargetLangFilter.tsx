// -Path: 'client/app/components/container/DeckList/TargetLangFilter.tsx'
import TargetLangSelect from '~/components/container/TargetLangSelect';

/**
 * The deck list's target-language control: the shared select, held at a fixed
 * width so it sits beside the search box. Switching it filters the list and
 * travels in the URL.
 */
export default function TargetLangFilter() {
    return (
        <div className='w-full shrink-0 sm:w-44'>
            <TargetLangSelect className='!py-2.5' />
        </div>
    );
}
