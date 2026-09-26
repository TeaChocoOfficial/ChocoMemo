import axios from 'axios';
import env from '~/secure/env';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useSwal } from '~/hooks/useSwal';
import avatarAPI from '~/services/avatar';
import { AuthProvider } from '~/types/auth';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { useAuthStore } from '~/stores/auth.store';
import { authAPI, nameTagField } from '~/services/auth';
import { getInitials } from '~/components/layout/navbar/utils';
import { FaImage, FaCamera, FaPen, FaAt } from 'react-icons/fa6';
import AvatarSourceSelector, { type AvatarSource } from './AvatarSourceSelector';
import { Modal, ModalBody, ModalHeader, ModalFooter } from '~/components/custom/Modal';

interface ProfileHeroProps {
    memberSince: string | null;
}

/** Pull the avatar-store document id out of a stored avatar URL, if it is one. */
function avatarUrlId(url: string): string | undefined {
    const base = `${env.API_URL}/api/avatar/`;
    const index = url.lastIndexOf(base);
    if (index < 0) return undefined;
    const id = url.slice(index + base.length);
    return id.length === 24 ? id : undefined;
}

/**
 * Top profile card: avatar plus the user's name, email, and member-since
 * date. Avatar changes are made in a modal that stages the choice locally
 * (pending source / pending file / pending removal) and only calls the
 * server once the user presses Confirm — Cancel (or closing the modal)
 * discards whatever was picked and leaves the saved avatar untouched.
 */
export default function ProfileHero({ memberSince }: ProfileHeroProps) {
    const swal = useSwal();
    const { t } = useTranslation();
    const { user, setUser } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Editable name, edited inline in the hero card.
    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [savingName, setSavingName] = useState(false);

    // nameTag + bio, edited in a small modal.
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [nameTagDraft, setNameTagDraft] = useState('');
    const [bioDraft, setBioDraft] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Staged (not-yet-saved) choice made inside the modal.
    const [pendingSource, setPendingSource] = useState<AvatarSource>('default');
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);
    const [pendingRemoveLocal, setPendingRemoveLocal] = useState(false);

    const identities = user?.identities ?? [];
    const localIdentity = identities.find((identity) => identity.provider === AuthProvider.LOCAL);
    const currentSource: AvatarSource =
        identities.find((identity) => identity.avatar && identity.avatar === user?.avatar)
            ?.provider ?? 'default';

    const hasPendingChange =
        pendingRemoveLocal || Boolean(pendingFile) || pendingSource !== currentSource;

    /** What the selector should show for the local card: a newly picked file, the saved photo, or nothing if it's marked for removal. */
    const selectorLocalAvatarUrl = pendingRemoveLocal
        ? undefined
        : (pendingPreviewUrl ?? localIdentity?.avatar ?? undefined);

    const discardPending = () => {
        if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
        setPendingFile(null);
        setPendingPreviewUrl(null);
        setPendingRemoveLocal(false);
    };

    const openAvatarModal = () => {
        setPendingSource(currentSource);
        discardPending();
        setAvatarModalOpen(true);
    };

    const closeAvatarModal = () => {
        discardPending();
        setAvatarModalOpen(false);
    };

    /** Stage a source (default, or an existing identity's avatar) without saving it yet. */
    const handlePendingSelect = (source: AvatarSource) => {
        if (source !== AuthProvider.LOCAL) discardPending();
        setPendingSource(source);
    };

    /** Stage a newly picked file as the local avatar, without uploading it yet. */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        if (!file.type.startsWith('image/')) return swal.error(t('profile.avatar.invalidType'));
        if (file.size > 5 * 1024 * 1024) return swal.error(t('profile.avatar.tooLarge'));

        if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
        setPendingFile(file);
        setPendingPreviewUrl(URL.createObjectURL(file));
        setPendingRemoveLocal(false);
        setPendingSource(AuthProvider.LOCAL);
    };

    /** Stage "remove the local avatar", falling back to the default source. */
    const handlePendingRemoveLocal = () => {
        discardPending();
        setPendingRemoveLocal(true);
        setPendingSource('default');
    };

    const startNameEdit = () => {
        setNameDraft(user?.name ?? '');
        setEditingName(true);
    };

    /** Persist the edited name, then collapse back to the read-only display. */
    const handleNameSave = async () => {
        if (!user) return;
        setSavingName(true);
        try {
            const updated = await authAPI.updateUser({ name: nameDraft.trim() || undefined });
            setUser(updated.data);
            swal.success(t('profile.details.saved'));
            setEditingName(false);
        } catch (error) {
            swal.error(t('profile.details.updateError'), { error });
        } finally {
            setSavingName(false);
        }
    };

    /** Open the nameTag/bio editor, seeded from the current profile. */
    const openProfileModal = () => {
        setNameTagDraft(user?.nameTag ?? '');
        setBioDraft(user?.bio ?? '');
        setProfileError(null);
        setProfileModalOpen(true);
    };

    /** Persist the nameTag + bio, keeping the modal open on validation errors. */
    const handleProfileSave = async () => {
        if (!user) return;
        if (!nameTagField.safeParse(nameTagDraft).success) {
            setProfileError(t('profile.details.nameTagInvalid'));
            return;
        }
        setSavingProfile(true);
        setProfileError(null);
        try {
            const updated = await authAPI.updateUser({
                nameTag: nameTagDraft,
                bio: bioDraft.trim(),
            });
            setUser(updated.data);
            swal.success(t('profile.details.saved'));
            setProfileModalOpen(false);
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? (err.response?.data as { message?: string } | undefined)?.message
                : undefined;
            if (message === 'NAME_TAG_TAKEN') {
                setProfileError(t('profile.details.nameTagTaken'));
            } else {
                setProfileError(t('profile.details.updateError'));
            }
        } finally {
            setSavingProfile(false);
        }
    };

    /** Commit the staged choice: upload if needed, then save it as the account avatar. */
    const handleConfirm = async () => {
        if (!user || !hasPendingChange) {
            closeAvatarModal();
            return;
        }

        setUploading(true);
        try {
            if (pendingRemoveLocal) {
                // Best-effort delete of the stored picture from the avatar store.
                const avatarId = localIdentity?.avatar
                    ? avatarUrlId(localIdentity.avatar)
                    : undefined;
                if (avatarId) void avatarAPI.remove(avatarId).catch(() => {});
                // `updateAvatarPayloadSchema` requires `url` to be a non-empty string
                // when present, so it's omitted entirely here (clears the local avatar).
                const updated = await authAPI.updateAvatar({ provider: AuthProvider.LOCAL });
                setUser(updated.data);
            } else if (pendingFile) {
                // The avatar endpoint returns the stored document plus a relative
                // `url` (e.g. `/api/avatar/<id>`); resolve it against the API
                // origin so the stored avatar is an absolute, loadable URL.
                const { data } = await avatarAPI.upload(pendingFile);
                const uploadedUrl =
                    typeof data?.url === 'string'
                        ? new URL(data.url, env.API_URL).toString()
                        : typeof data?._id === 'string'
                          ? `${env.API_URL}/api/avatar/${data._id}`
                          : undefined;
                if (!uploadedUrl) throw new Error('Upload response missing url');

                const updated = await authAPI.updateAvatar({
                    provider: AuthProvider.LOCAL,
                    url: uploadedUrl,
                });
                setUser(updated.data);
            } else {
                const identity =
                    pendingSource === 'default'
                        ? undefined
                        : identities.find((i) => i.provider === pendingSource);
                // `updateAvatarPayloadSchema` requires `url` to be a non-empty string when
                // present, so we simply omit it when there's nothing to pass (e.g. "default").
                const updated = await authAPI.updateAvatar({
                    provider: pendingSource,
                    ...(identity?.avatar ? { url: identity.avatar } : {}),
                });
                setUser(updated.data);
            }
            swal.success(t('profile.avatar.updated'));
            closeAvatarModal();
        } catch (error) {
            swal.error(t('profile.avatar.updateError'), { error });
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='mb-10 overflow-hidden rounded-sm border border-line bg-surface'
            >
                <div className='h-20 bg-linear-to-r from-primary/20 via-primary/5 to-transparent sm:h-24' />

                <div className='flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:gap-6 sm:px-8 sm:pb-8'>
                    <div className='relative -mt-12 h-24 w-24 shrink-0 sm:-mt-14 sm:h-28 sm:w-28'>
                        <div className='flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-secondary-muted text-3xl font-black text-secondary-foreground'>
                            {user?.avatar ? (
                                <img
                                    alt={user?.name ?? ''}
                                    src={user.avatar}
                                    className='h-full w-full object-cover'
                                />
                            ) : (
                                <span className='flex h-full w-full items-center justify-center rounded-sm bg-primary/15 text-4xl font-bold text-primary'>
                                    {getInitials(user?.name)}
                                </span>
                            )}
                            {uploading && (
                                <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50'>
                                    <div className='h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent' />
                                </div>
                            )}
                        </div>
                        <button
                            type='button'
                            disabled={uploading}
                            onClick={openAvatarModal}
                            title={t('profile.avatar.source')}
                            aria-label={t('profile.avatar.source')}
                            className='absolute bottom-0.5 right-0.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-surface bg-primary text-white transition-colors hover:bg-primary/80 disabled:opacity-60'
                        >
                            <FaCamera className='h-3.5 w-3.5' />
                        </button>
                    </div>

                    <div className='min-w-0 flex-1 pb-1'>
                        <div className='flex flex-wrap items-center gap-3'>
                            {editingName ? (
                                <div className='flex w-full flex-wrap items-center gap-2'>
                                    <input
                                        type='text'
                                        autoFocus
                                        value={nameDraft}
                                        onChange={(e) => setNameDraft(e.target.value)}
                                        placeholder={t('profile.details.namePlaceholder')}
                                        disabled={savingName}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') void handleNameSave();
                                            if (e.key === 'Escape') setEditingName(false);
                                        }}
                                        className='w-48 rounded-sm border border-line bg-surface px-3 py-2 text-lg font-black tracking-tight text-surface-foreground placeholder:text-surface-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors sm:w-64'
                                    />
                                    <Button
                                        size='sm'
                                        variant='primary'
                                        onClick={handleNameSave}
                                        disabled={savingName || !nameDraft.trim()}
                                    >
                                        {savingName
                                            ? t('profile.details.saving')
                                            : t('profile.avatar.confirm')}
                                    </Button>
                                    <Button
                                        size='sm'
                                        variant='ghost'
                                        onClick={() => setEditingName(false)}
                                        disabled={savingName}
                                    >
                                        {t('profile.avatar.cancel')}
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <h1 className='truncate text-2xl font-black tracking-tight text-surface-foreground sm:text-3xl'>
                                        {user?.name || t('profile.anonymousName')}
                                    </h1>
                                    {user?.role && <Badge>{user.role}</Badge>}
                                    <button
                                        type='button'
                                        onClick={startNameEdit}
                                        disabled={savingName}
                                        title={t('profile.details.name')}
                                        aria-label={t('profile.details.name')}
                                        className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-surface-muted transition-colors hover:bg-secondary-muted hover:text-surface-foreground disabled:opacity-60'
                                    >
                                        <FaPen className='h-3 w-3' />
                                    </button>
                                </>
                            )}
                        </div>
                        {memberSince && (
                            <p className='mt-1 truncate text-sm text-surface-muted'>
                                {t('profile.memberSince')} {memberSince}
                            </p>
                        )}
                        <div className='mt-2 space-y-1'>
                            <p className='inline-flex items-center gap-1.5 text-sm font-semibold text-primary'>
                                {user?.nameTag ? (
                                    <>
                                        <FaAt className='h-3.5 w-3.5' />
                                        <span className='truncate'>{user.nameTag}</span>
                                    </>
                                ) : (
                                    <span className='italic text-surface-muted'>
                                        {t('profile.details.noNameTag')}
                                    </span>
                                )}
                            </p>
                            {!!user?.bio && (
                                <p className='max-w-md text-sm text-surface-foreground/90'>
                                    {user.bio}
                                </p>
                            )}
                            <Button size='sm' variant='ghost' onClick={openProfileModal}>
                                {t('profile.details.editProfile')}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <Modal isOpen={avatarModalOpen} onClose={closeAvatarModal} size='sm'>
                <ModalHeader
                    title={t('profile.avatar.source')}
                    icon={<FaImage className='h-4 w-4' />}
                    onClose={closeAvatarModal}
                />
                <ModalBody>
                    <AvatarSourceSelector
                        busy={uploading}
                        source={pendingSource}
                        identities={identities}
                        onSelect={handlePendingSelect}
                        onRemoveLocal={handlePendingRemoveLocal}
                        onUploadClick={() => fileInputRef.current?.click()}
                        localAvatarUrl={selectorLocalAvatarUrl}
                    />
                    <input
                        ref={fileInputRef}
                        id='avatar-upload'
                        type='file'
                        accept='image/*'
                        className='sr-only'
                        disabled={uploading}
                        onChange={handleFileChange}
                    />
                </ModalBody>
                {/* NOTE: assumes `Modal` exports a `ModalFooter` alongside
                    `ModalHeader`/`ModalBody`. If it doesn't, swap this for a
                    plain `<div className='flex justify-end gap-2 p-4 pt-0'>`. */}
                <ModalFooter>
                    <Button variant='ghost' onClick={closeAvatarModal} disabled={uploading}>
                        {t('profile.avatar.cancel')}
                    </Button>
                    <Button
                        variant='primary'
                        onClick={handleConfirm}
                        disabled={uploading || !hasPendingChange}
                    >
                        {uploading ? t('profile.avatar.saving') : t('profile.avatar.confirm')}
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} size='sm'>
                <ModalHeader
                    title={t('profile.details.editProfile')}
                    icon={<FaPen className='h-4 w-4' />}
                    onClose={() => setProfileModalOpen(false)}
                />
                <ModalBody>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                {t('profile.details.nameTag')}
                            </label>
                            <div className='relative'>
                                <FaAt className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted' />
                                <input
                                    type='text'
                                    autoFocus
                                    value={nameTagDraft}
                                    disabled={savingProfile}
                                    onChange={(e) =>
                                        setNameTagDraft(
                                            e.target.value
                                                .replace(/[^A-Za-z0-9_-]/g, '')
                                                .slice(0, 30)
                                                .toLowerCase(),
                                        )
                                    }
                                    className='w-full rounded-sm border border-line bg-surface py-2.5 pl-10 pr-3 text-sm text-surface-foreground placeholder:text-surface-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                                    placeholder={t('profile.details.nameTag')}
                                />
                            </div>
                            <p className='mt-1 text-xs text-surface-muted'>
                                {t('profile.details.nameTagHint')}
                            </p>
                        </div>
                        <div>
                            <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                {t('profile.details.bio')}
                            </label>
                            <textarea
                                rows={3}
                                value={bioDraft}
                                disabled={savingProfile}
                                maxLength={160}
                                onChange={(e) => setBioDraft(e.target.value)}
                                className='w-full resize-none rounded-sm border border-line bg-surface px-3 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                                placeholder={t('profile.details.bioPlaceholder')}
                            />
                            <p className='mt-1 text-right text-xs text-surface-muted'>
                                {bioDraft.length}/160
                            </p>
                        </div>
                        {profileError && (
                            <p className='text-sm text-red-500' role='alert'>
                                {profileError}
                            </p>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant='ghost'
                        onClick={() => setProfileModalOpen(false)}
                        disabled={savingProfile}
                    >
                        {t('profile.avatar.cancel')}
                    </Button>
                    <Button variant='primary' onClick={handleProfileSave} disabled={savingProfile}>
                        {savingProfile ? t('profile.details.saving') : t('profile.avatar.confirm')}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
