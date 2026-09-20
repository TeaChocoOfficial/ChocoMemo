import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Badge from '~/components/custom/Badge';
import { FaUser, FaImage } from 'react-icons/fa6';
import { authAPI } from '~/services/auth';
import imgAPI from '~/services/img';
import { useAuthStore } from '~/stores/auth.store';
import { AuthProvider } from '~/types/auth';
import AvatarSourceSelector, { type AvatarSource } from './AvatarSourceSelector';

interface ProfileHeroProps {
    memberSince: string | null;
}

/**
 * Top profile card: avatar (with upload + source selection) plus the
 * user's name, email, and member-since date.
 */
export default function ProfileHero({ memberSince }: ProfileHeroProps) {
    const { t } = useTranslation();
    const { user, setUser } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const identities = user?.identities ?? [];
    const localIdentity = identities.find((identity) => identity.provider === AuthProvider.LOCAL);
    const currentSource: AvatarSource =
        identities.find((identity) => identity.avatar && identity.avatar === user?.avatar)?.provider ??
        'default';

    /** Switch the active avatar to a given source (default / an identity's avatar). */
    const handleSelectSource = async (source: AvatarSource) => {
        if (!user) return;
        setUploading(true);
        try {
            const identity =
                source === 'default' ? undefined : identities.find((i) => i.provider === source);
            // `updateAvatarPayloadSchema` requires `url` to be a non-empty string when
            // present, so we simply omit it when there's nothing to pass (e.g. "default").
            const updated = await authAPI.updateAvatar({
                provider: source,
                ...(identity?.avatar ? { url: identity.avatar } : {}),
            });
            setUser(updated.data);
            toast.success(t('profile.avatar.updated'));
        } catch {
            toast.error(t('profile.avatar.updateError'));
        } finally {
            setUploading(false);
        }
    };

    /** Read a chosen file, preview it instantly, upload it, then save the resulting URL as the local avatar. */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error(t('profile.avatar.invalidType'));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('profile.avatar.tooLarge'));
            return;
        }

        // Instant local preview while the upload is in flight — cheaper than
        // FileReader's base64 data URL, and never sent over the network.
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploading(true);

        void (async () => {
            try {
                // NOTE: `imgAPI.upload` has no zod response schema, so the
                // shape below (`data.url`) is assumed — confirm the actual
                // field name against the `/api/img` response.
                const { data } = await imgAPI.upload(file);
                const uploadedUrl = data?.url as string | undefined;
                if (!uploadedUrl) throw new Error('Upload response missing url');

                const updated = await authAPI.updateAvatar({
                    provider: AuthProvider.LOCAL,
                    url: uploadedUrl,
                });
                setUser(updated.data);
                toast.success(t('profile.avatar.updated'));
            } catch {
                toast.error(t('profile.avatar.updateError'));
            } finally {
                setUploading(false);
                setPreview(null);
                URL.revokeObjectURL(objectUrl);
            }
        })();
    };

    const handleRemoveLocal = async () => {
        if (!localIdentity?.avatar) return;
        setUploading(true);
        try {
            // NOTE: `updateAvatarPayloadSchema` rejects an empty-string `url`
            // (min length 1), so it's omitted entirely here. Confirm with the
            // backend that `{ provider: 'local' }` with no `url` is read as
            // "clear the local avatar" — if not, this endpoint needs a small
            // tweak (e.g. accepting `url: null` or a dedicated remove flag).
            const updated = await authAPI.updateAvatar({ provider: AuthProvider.LOCAL });
            setUser(updated.data);
            toast.success(t('profile.avatar.removed'));
        } catch {
            toast.error(t('profile.avatar.removeError'));
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='mb-10 overflow-hidden rounded-sm border border-line bg-surface'
        >
            <div className='h-20 bg-linear-to-r from-accent/20 via-accent/5 to-transparent sm:h-24' />

            <div className='flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:gap-6 sm:px-8 sm:pb-8'>
                <div className='relative -mt-12 h-24 w-24 shrink-0 sm:-mt-14 sm:h-28 sm:w-28'>
                    <div className='flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-secondary-muted text-3xl font-black text-secondary-foreground'>
                        {preview || user?.avatar ? (
                            <img
                                src={preview || user?.avatar!}
                                alt={user?.name ?? ''}
                                className='h-full w-full object-cover'
                            />
                        ) : (
                            <FaUser className='h-9 w-9' />
                        )}
                        {uploading && (
                            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50'>
                                <div className='h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent' />
                            </div>
                        )}
                    </div>
                    <label
                        className='absolute bottom-0.5 right-0.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-surface bg-accent text-white transition-colors hover:bg-accent/80'
                        htmlFor='avatar-upload'
                    >
                        <FaImage className='h-3.5 w-3.5' />
                        <input
                            ref={fileInputRef}
                            id='avatar-upload'
                            type='file'
                            accept='image/*'
                            className='sr-only'
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                </div>

                <div className='min-w-0 flex-1 pb-1'>
                    <div className='flex flex-wrap items-center gap-3'>
                        <h1 className='truncate text-2xl font-black tracking-tight text-surface-foreground sm:text-3xl'>
                            {user?.name || t('profile.anonymousName')}
                        </h1>
                        {user?.role && <Badge>{user.role}</Badge>}
                    </div>
                    <p className='mt-1 truncate text-sm text-surface-muted'>
                        {user?.email}
                        {user?.email && memberSince && ' · '}
                        {memberSince && `${t('profile.memberSince')} ${memberSince}`}
                    </p>

                    <AvatarSourceSelector
                        identities={identities}
                        source={currentSource}
                        localAvatarSet={Boolean(localIdentity?.avatar)}
                        busy={uploading}
                        onSelect={handleSelectSource}
                        onUploadClick={() => fileInputRef.current?.click()}
                        onRemoveLocal={handleRemoveLocal}
                    />
                </div>
            </div>
        </motion.div>
    );
}