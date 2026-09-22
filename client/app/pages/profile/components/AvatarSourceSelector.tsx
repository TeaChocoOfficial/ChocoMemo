import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCamera, FaCheck, FaUpload } from 'react-icons/fa6';
import { AuthProvider, type AuthIdentity } from '~/types/auth';
import { getProviderMeta } from '~/constants/identityProviders';
import { getInitials } from '~/components/layout/navbar/utils';
import { useAuthStore } from '~/stores/auth.store';

export type AvatarSource = AuthProvider | 'default';

interface AvatarSourceSelectorProps {
    identities: AuthIdentity[];
    source: AvatarSource;
    localAvatarUrl?: string;
    busy: boolean;
    onSelect: (source: AvatarSource) => void;
    onUploadClick: () => void;
    onRemoveLocal: () => void;
}

/** One selectable card: circular preview, optional provider badge, name label. */
function SourceCard({
    active,
    label,
    preview,
    badge,
    busy,
    onChange,
}: {
    active: boolean;
    label: string;
    preview: ReactNode;
    badge?: ReactNode;
    busy: boolean;
    value: AvatarSource;
    onChange: () => void;
}) {
    return (
        <label
            className={`inline-flex w-[76px] cursor-pointer flex-col items-center gap-1.5 rounded-sm border px-2 pb-2 pt-2.5 transition-all duration-150 ${
                active
                    ? 'border-accent bg-accent/5'
                    : 'border-line bg-transparent hover:border-line-strong hover:bg-surface-overlay'
            }`}
        >
            <input
                type='radio'
                name='avatar-source'
                className='sr-only'
                checked={active}
                disabled={busy}
                onChange={onChange}
            />
            <span className='relative block'>
                <span
                    className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-secondary-muted ${
                        active ? 'ring-2 ring-accent/70' : 'ring-1 ring-line'
                    }`}
                >
                    {preview}
                </span>
                {badge}
                <span
                    className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface transition-colors ${
                        active
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-surface-overlay text-transparent'
                    }`}
                >
                    <FaCheck className='h-2.5 w-2.5' />
                </span>
            </span>
            <span className='max-w-full truncate text-[11px] font-semibold text-surface-foreground'>
                {label}
            </span>
        </label>
    );
}

/**
 * Radio-style selector for which avatar image to use: the default
 * placeholder, the avatar from any connected identity that has one (e.g.
 * Google), or a locally uploaded image. New providers automatically show up
 * here once they appear in `user.identities` — no changes needed.
 *
 * The local card behaves differently depending on whether a photo has been
 * uploaded yet: with no photo, clicking the card opens the file picker;
 * once a photo exists, clicking the card just *selects* it (like any other
 * card) and a small camera button lets the user upload a replacement
 * without that click also re-triggering the file picker.
 */
export default function AvatarSourceSelector({
    busy,
    source,
    onSelect,
    identities,
    onUploadClick,
    onRemoveLocal,
    localAvatarUrl,
}: AvatarSourceSelectorProps) {
    const { t } = useTranslation();
    const { user } = useAuthStore();

    const pickableIdentities = identities.filter(
        (identity) => identity.provider !== AuthProvider.LOCAL && identity.avatar,
    );

    const handleLocalCardChange = () => {
        if (localAvatarUrl) {
            onSelect(AuthProvider.LOCAL);
        } else {
            onUploadClick();
        }
    };

    /** Stop the click from also toggling the radio via the wrapping <label>. */
    const handleChangePhotoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onUploadClick();
    };

    return (
        <div className='rounded-sm border border-line bg-surface p-4'>
            <div className='mb-3 flex items-center justify-between gap-2'>
                <span className='font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-surface-muted'>
                    {t('profile.avatar.source')}
                </span>
                {source === AuthProvider.LOCAL && localAvatarUrl && (
                    <button
                        type='button'
                        disabled={busy}
                        onClick={onRemoveLocal}
                        className='cursor-pointer text-xs font-medium text-error transition-colors hover:text-error/80 disabled:pointer-events-none disabled:opacity-50'
                    >
                        {t('profile.avatar.remove')}
                    </button>
                )}
            </div>

            <div
                className='flex flex-wrap gap-2.5'
                role='radiogroup'
                aria-label={t('profile.avatar.source')}
            >
                <SourceCard
                    busy={busy}
                    value='default'
                    active={source === 'default'}
                    label={t('profile.avatar.default')}
                    onChange={() => onSelect('default')}
                    preview={
                        <span className='flex h-full w-full items-center justify-center rounded-sm bg-accent/15 text-lg font-bold text-accent'>
                            {getInitials(user?.name)}
                        </span>
                    }
                />

                <SourceCard
                    busy={busy}
                    value={AuthProvider.LOCAL}
                    label={t('profile.avatar.local')}
                    active={source === AuthProvider.LOCAL}
                    onChange={handleLocalCardChange}
                    preview={
                        localAvatarUrl ? (
                            <img
                                src={localAvatarUrl}
                                alt=''
                                className='h-full w-full object-cover'
                            />
                        ) : (
                            <span className='flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-accent/60 bg-accent/10 text-accent'>
                                <FaUpload className='h-4 w-4' />
                            </span>
                        )
                    }
                    badge={
                        localAvatarUrl ? (
                            <button
                                type='button'
                                disabled={busy}
                                onClick={handleChangePhotoClick}
                                title={t('profile.avatar.change')}
                                className='absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white ring-2 ring-surface transition-colors hover:bg-accent/80 disabled:pointer-events-none disabled:opacity-50'
                            >
                                <FaCamera className='h-2.5 w-2.5' />
                            </button>
                        ) : undefined
                    }
                />

                {pickableIdentities.map((identity) => {
                    const meta = getProviderMeta(identity.provider);
                    if (!meta) return null;
                    const Icon = meta.icon;
                    return (
                        <SourceCard
                            key={identity.provider}
                            value={identity.provider}
                            active={source === identity.provider}
                            label={t(meta.labelKey)}
                            busy={busy}
                            onChange={() => onSelect(identity.provider)}
                            preview={
                                <img
                                    src={identity.avatar!}
                                    alt=''
                                    className='h-full w-full object-cover'
                                />
                            }
                            badge={
                                <span
                                    className='absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-surface'
                                    style={{ backgroundColor: meta.color }}
                                >
                                    <Icon className='h-2 w-2 text-white' />
                                </span>
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}