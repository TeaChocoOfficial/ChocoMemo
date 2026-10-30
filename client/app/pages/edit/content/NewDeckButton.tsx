// -Path: 'client/app/pages/edit/content/NewDeckButton.tsx'
import { useTranslation } from 'react-i18next';
import { useEditor } from '~/hooks/editor/useEditor';
import { FaPlus } from 'react-icons/fa6';
import { useOpenDeckEdit } from '~/hooks/editor/useOpenDeckEdit';

const ADD =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-line-strong text-primary transition-colors hover:border-primary hover:bg-primary-subtle focus-visible:outline-2 focus-visible:outline-primary';

/**
 * Explorer header button for authoring a deck. It puts the editor into its
 * create mode and brings the form panel forward — opening it when the user
 * closed it — so the empty form is what they land on, not just a blank pane.
 *
 * @returns The new-deck icon button.
 */
export default function NewDeckButton() {
    const { t } = useTranslation();
    const { startCreate } = useEditor();
    const openDeckEdit = useOpenDeckEdit();

    const add = () => {
        startCreate();
        openDeckEdit();
    };

    return (
        <button
            type='button'
            onClick={add}
            title={t('deck.edit.newDeck')}
            aria-label={t('deck.edit.newDeck')}
            className={ADD}
        >
            <FaPlus className='h-4 w-4' />
        </button>
    );
}
