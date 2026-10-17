// -Path: 'client/app/components/page/EditPage.tsx'
import EditWorkspace from './dockview/EditWorkspace';
import { useTargetLang } from '~/hooks/base/useTargetLang';

/**
 * Full-screen host for the deck manager: the workspace fills the whole viewport
 * instead of sitting inside the centred `PageShell`. The target language comes
 * from the URL/store, so one route serves every language. The route opts out of
 * the site chrome (`handle.hideChrome`), so there is no navbar or footer to
 * offset against.
 */
export default function EditPage() {
    const targetLang = useTargetLang();

    return (
        <div className='h-dvh w-full overflow-hidden'>
            <EditWorkspace language={targetLang} />
        </div>
    );
}
