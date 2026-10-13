// -Path: 'client/app/components/page/EditPage.tsx'
import EditWorkspace from '../edit/dockview/EditWorkspace';
import { useTargetLang } from '~/hooks/useTargetLang';
import { useChromeStore } from '~/stores/config/chrome.store';

/**
 * Full-screen host for the deck manager: the workspace fills the whole viewport
 * instead of sitting inside the centred `PageShell`. The target language comes
 * from the URL/store, so one route serves every language; the site chrome is
 * left untouched.
 */
export default function EditPage() {
    const { showChrome } = useChromeStore();
    const targetLang = useTargetLang();

    return (
        <div className={`w-full overflow-hidden ${showChrome ? 'mt-14 h-[calc(100dvh-56px)]' : 'mt-0 h-dvh'}`}>
            <EditWorkspace language={targetLang} />
        </div>
    );
}
