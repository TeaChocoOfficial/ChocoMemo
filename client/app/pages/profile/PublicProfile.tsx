// -Path: 'client/app/pages/profile/PublicProfile.tsx'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaAt, FaUser } from 'react-icons/fa6';
import { Link } from '~/i18n/routing';
import Section from '~/components/custom/Section';
import Button from '~/components/custom/Button';
import Badge from '~/components/custom/Badge';
import { useAuthStore } from '~/stores/auth.store';
import { userAPI, type PublicUser } from '~/services/user';
import { getInitials } from '~/components/layout/navbar/utils';
import { getProviderMeta, resolveProviderColor } from '~/constants/identityProviders';

type LoadState = 'loading' | 'ready' | 'missing' | 'failed';

const formatDate = (value?: Date) =>
    value && !Number.isNaN(value.getTime())
        ? new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          }).format(value)
        : null;

/** Header card: avatar, name, handle and join date. Read-only, unlike the
 *  signed-in `ProfileHero`, which owns the editing affordances. */
function PublicHero({ user }: { user: PublicUser }) {
    const { t } = useTranslation();
    const memberSince = formatDate(user.createdAt);
    const name = user.name?.trim();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='flex flex-col items-center gap-5 rounded-sm border border-line bg-surface p-6 text-center sm:flex-row sm:items-center sm:gap-6 sm:p-8 sm:text-left'
        >
            {user.avatar ? (
                <img
                    src={user.avatar}
                    alt={name ?? user.nameTag ?? ''}
                    className='h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-line sm:h-24 sm:w-24'
                />
            ) : (
                <span className='flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xl font-black text-primary sm:h-24 sm:w-24'>
                    {getInitials(name ?? user.nameTag ?? undefined)}
                </span>
            )}

            <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center justify-center gap-2 sm:justify-start'>
                    <h1 className='truncate text-2xl font-black tracking-tight text-surface-foreground sm:text-3xl'>
                        {name || t('profile.anonymousName')}
                    </h1>
                    {user.role && <Badge>{user.role}</Badge>}
                </div>
                {user.nameTag && (
                    <p className='mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary'>
                        <FaAt className='h-3.5 w-3.5' />
                        <span className='truncate'>{user.nameTag}</span>
                    </p>
                )}
                {memberSince && (
                    <p className='mt-1 text-sm text-surface-muted'>
                        {t('profile.memberSince')} {memberSince}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

/** Numbered section header shared with the signed-in profile sections. */
function SectionTitle({ index, label }: { index: string; label: string }) {
    return (
        <div className='mb-5 flex items-center gap-3'>
            <span className='font-mono text-xs font-bold tracking-[0.14em] text-primary'>
                {index}
            </span>
            <span className='h-px w-10 bg-line-strong' />
            <h2 className='text-lg font-bold tracking-tight text-surface-foreground sm:text-xl'>
                {label}
            </h2>
        </div>
    );
}

/**
 * Public profile at `/profile/:nameTag`.
 *
 * Read-only view of another member, backed by the unauthenticated
 * `GET /api/user/tag/:nameTag` lookup. Deliberately shows far less than the
 * signed-in profile: no email, no identities' provider emails, and no learning
 * stats — those come from per-device stores and describe the viewer, not this
 * user.
 */
export default function PublicProfile() {
    const { t } = useTranslation();
    const { nameTag = '' } = useParams();
    const { user: viewer } = useAuthStore();

    const [state, setState] = useState<LoadState>('loading');
    const [profile, setProfile] = useState<PublicUser | null>(null);

    useEffect(() => {
        let active = true;
        setState('loading');
        setProfile(null);

        userAPI
            .findByNameTag(nameTag)
            .then((res) => {
                if (!active) return;
                setProfile(res.data);
                setState('ready');
            })
            .catch((error) => {
                if (!active) return;
                // The lookup 404s for an unknown handle; anything else is a
                // transport or server fault and deserves a different message.
                setState(
                    axios.isAxiosError(error) && error.response?.status === 404
                        ? 'missing'
                        : 'failed',
                );
            });

        return () => {
            active = false;
        };
    }, [nameTag]);

    const isSelf = Boolean(viewer?.nameTag && viewer.nameTag === profile?.nameTag);

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
                <Link
                    to='/'
                    className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition-colors hover:text-primary'
                >
                    <FaArrowLeft className='h-3.5 w-3.5' />
                    {t('profile.back')}
                </Link>

                {state === 'loading' && (
                    <p className='py-16 text-center text-sm text-surface-muted'>
                        {t('common.loading')}
                    </p>
                )}

                {(state === 'missing' || state === 'failed') && (
                    <div className='mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center'>
                        <span className='mb-6 flex h-16 w-16 items-center justify-center rounded-sm bg-primary/12 text-primary'>
                            <FaUser className='h-7 w-7' />
                        </span>
                        <h1 className='text-2xl font-black tracking-tight text-surface-foreground'>
                            {state === 'missing'
                                ? t('profile.public.notFoundTitle')
                                : t('common.error.oops')}
                        </h1>
                        <p className='mt-3 max-w-md text-sm leading-relaxed text-surface-muted'>
                            {state === 'missing'
                                ? t('profile.public.notFoundHint')
                                : t('common.error.unexpected')}
                        </p>
                        <Link to='/'>
                            <Button variant='outline' className='mt-8'>
                                {t('profile.back')}
                            </Button>
                        </Link>
                    </div>
                )}

                {state === 'ready' && profile && (
                    <div className='space-y-12'>
                        <PublicHero user={profile} />

                        {isSelf && (
                            <Link to='/profile'>
                                <Button variant='outline' size='sm'>
                                    {t('profile.public.yourDashboard')}
                                </Button>
                            </Link>
                        )}

                        <motion.section
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                        >
                            <SectionTitle index='01' label={t('profile.details.bio')} />
                            <div className='rounded-sm border border-line bg-surface p-4 sm:p-5'>
                                {profile.bio?.trim() ? (
                                    <p className='text-sm leading-relaxed whitespace-pre-line text-surface-foreground/90'>
                                        {profile.bio}
                                    </p>
                                ) : (
                                    <p className='text-sm text-surface-muted'>
                                        {t('profile.details.bioPlaceholder')}
                                    </p>
                                )}
                            </div>
                        </motion.section>

                        {!!profile.identities?.length && (
                            <motion.section
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <SectionTitle index='02' label={t('profile.identities.label')} />
                                <div className='flex flex-wrap gap-3'>
                                    {profile.identities.map((identity) => {
                                        const meta = getProviderMeta(
                                            identity.provider as Parameters<
                                                typeof getProviderMeta
                                            >[0],
                                        );
                                        if (!meta) return null;
                                        const Icon = meta.icon;
                                        const tint = resolveProviderColor(meta.color);
                                        return (
                                            <span
                                                key={identity.provider}
                                                title={t(meta.labelKey)}
                                                className='flex h-11 w-11 items-center justify-center rounded-full border border-line'
                                                style={
                                                    tint
                                                        ? {
                                                              backgroundColor: `color-mix(in srgb, ${tint} 10%, transparent)`,
                                                              color: tint,
                                                          }
                                                        : undefined
                                                }
                                            >
                                                <Icon className='h-4 w-4' />
                                            </span>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        )}
                    </div>
                )}
            </div>
        </Section>
    );
}
