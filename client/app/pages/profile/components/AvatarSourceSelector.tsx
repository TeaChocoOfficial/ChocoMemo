import { useTranslation } from 'react-i18next';
import { FaImage, FaUpload } from 'react-icons/fa6';
import { AuthProvider, type AuthIdentity } from '~/types/auth';
import { getProviderMeta } from '~/constants/identityProviders';

export type AvatarSource = AuthProvider | 'default';

interface AvatarSourceSelectorProps {
    identities: AuthIdentity[];
    source: AvatarSource;
    localAvatarSet: boolean;
    busy: boolean;
    onSelect: (source: AvatarSource) => void;
    onUploadClick: () => void;
    onRemoveLocal: () => void;
}

/**
 * Radio-style selector for which avatar image to use: the default
 * placeholder, the avatar from any connected identity that has one (e.g.
 * Google), or a locally uploaded image. New providers automatically show up
 * here once they appear in `user.identities` — no changes needed.
 */
export default function AvatarSourceSelector({
    identities,
    source,
    localAvatarSet,
    busy,
    onSelect,
    onUploadClick,
    onRemoveLocal,
}: AvatarSourceSelectorProps) {
    const { t } = useTranslation();

    const pickableIdentities = identities.filter(
        (identity) => identity.provider !== AuthProvider.LOCAL && identity.avatar,
    );

    const optionClass = (active: boolean) =>
        `inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            active
                ? 'bg-accent text-accent-foreground'
                : 'bg-surface-foreground/5 hover:bg-surface-foreground/10 text-surface-foreground'
        }`;

    return (
        <div className='mt-4 flex flex-wrap items-center gap-3'>
            <span className='text-xs font-medium text-surface-muted'>
                {t('profile.avatar.source')}
            </span>

            <div
                className='flex flex-wrap gap-2'
                role='radiogroup'
                aria-label={t('profile.avatar.source')}
            >
                <label className={optionClass(source === 'default')}>
                    <input
                        type='radio'
                        name='avatar-source'
                        className='sr-only'
                        checked={source === 'default'}
                        disabled={busy}
                        onChange={() => onSelect('default')}
                    />
                    <FaImage className='h-3.5 w-3.5' />
                    <span>{t('profile.avatar.default')}</span>
                </label>

                {pickableIdentities.map((identity) => {
                    const meta = getProviderMeta(identity.provider);
                    if (!meta) return null;
                    const Icon = meta.icon;
                    return (
                        <label
                            key={identity.provider}
                            className={optionClass(source === identity.provider)}
                        >
                            <input
                                type='radio'
                                name='avatar-source'
                                className='sr-only'
                                checked={source === identity.provider}
                                disabled={busy}
                                onChange={() => onSelect(identity.provider)}
                            />
                            <Icon className='h-3.5 w-3.5' />
                            <span>{t(meta.labelKey)}</span>
                        </label>
                    );
                })}

                <label className={optionClass(source === AuthProvider.LOCAL)}>
                    <input
                        type='radio'
                        name='avatar-source'
                        className='sr-only'
                        checked={source === AuthProvider.LOCAL}
                        disabled={busy}
                        onChange={() =>
                            localAvatarSet ? onSelect(AuthProvider.LOCAL) : onUploadClick()
                        }
                    />
                    <FaUpload className='h-3.5 w-3.5' />
                    <span>{t('profile.avatar.local')}</span>
                </label>
            </div>

            {source === AuthProvider.LOCAL && localAvatarSet && (
                <button
                    type='button'
                    onClick={onRemoveLocal}
                    disabled={busy}
                    className='cursor-pointer text-xs text-error hover:underline'
                >
                    {t('profile.avatar.remove')}
                </button>
            )}
        </div>
    );
}
