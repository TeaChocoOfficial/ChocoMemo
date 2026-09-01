// -Path: 'Vite-React-TypeScript/src/pages/auth/AuthStatusPanel.tsx'
import {
    FaUser,
    FaPen,
    FaCheck,
    FaXmark,
    FaCopy,
    FaSpinner,
    FaGoogle,
    FaCircleCheck,
    FaCircleXmark,
    FaShieldHalved,
    FaArrowRightFromBracket,
} from 'react-icons/fa6';
import env from '~/secure/env';
import { timeAgo } from '~/utils/time';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import type { Message } from '../../type';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { useAuthStore } from '~/stores/auth.store';
import { authAPI, type UpdateUserPayload } from '~/services/auth';

interface AuthStatusPanelProps {
    loading: boolean;
    onLogout: () => void;
    message: Message | null;
    setMessage: React.Dispatch<React.SetStateAction<Message | null>>;
}

export default function AuthStatusPanel({
    message,
    loading,
    onLogout,
    setMessage,
}: AuthStatusPanelProps) {
    const { t } = useTranslation();
    const { user, setUser } = useAuthStore();
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [editName, setEditName] = useState('');
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const startEditing = () => {
        setEditName(user?.name || '');
        setEditing(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const saveName = async () => {
        if (!user || !editName.trim() || editName.trim() === user.name) {
            setEditing(false);
            return;
        }
        setSaving(true);
        try {
            const payload: UpdateUserPayload = { name: editName.trim() };
            const res = await authAPI.updateUser(payload);
            setUser(res.data);
            setEditing(false);
        } catch (error) {
            setMessage({
                type: 'error',
                text: t('auth.update_error'),
            });
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => setEditing(false);

    const handleCopyId = () => {
        if (!user) return;
        navigator.clipboard.writeText(user.userId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <>
            <div className='flex items-center gap-3 mb-6'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary'>
                    <FaShieldHalved className='w-5 h-5' />
                </div>
                <h2 className='text-xl font-bold text-surface-foreground'>
                    {t('auth.status_title')}
                </h2>
            </div>

            <div className='rounded-xl border border-border bg-surface-overlay/50 p-5 mb-5'>
                <div className='flex items-center justify-between mb-3'>
                    <span className='text-sm font-medium text-surface-muted'>
                        {t('auth.current_status')}
                    </span>
                    {loading ? (
                        <Badge>
                            <FaSpinner className='w-3 h-3 animate-spin' /> {t('auth.checking')}
                        </Badge>
                    ) : user ? (
                        <Badge variant='success'>
                            <FaCircleCheck className='w-3 h-3' /> {t('auth.authenticated')}
                        </Badge>
                    ) : (
                        <Badge variant='error'>
                            <FaCircleXmark className='w-3 h-3' /> {t('auth.not_authenticated')}
                        </Badge>
                    )}
                </div>

                {user && (
                    <motion.div
                        transition={{ duration: 0.3 }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className='space-y-4 pt-3 border-t border-border'
                    >
                        <div className='flex items-center gap-3'>
                            {user.avatar ? (
                                <img
                                    alt={user.name || 'User'}
                                    src={user.avatar || env.BASE + '/favicon.svg'}
                                    className='w-12 h-12 rounded-full border-2 border-primary/30 object-cover shrink-0'
                                />
                            ) : (
                                <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                                    <FaUser className='w-5 h-5 text-primary' />
                                </div>
                            )}
                            <div className='min-w-0 flex-1'>
                                {editing ? (
                                    <div className='flex items-center gap-2'>
                                        <input
                                            ref={inputRef}
                                            value={editName}
                                            onChange={(event) => setEditName(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') saveName();
                                                if (event.key === 'Escape') cancelEdit();
                                            }}
                                            className='flex-1 px-2 py-1 rounded-lg border border-border bg-surface-elevated text-surface-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50'
                                        />
                                        <button
                                            onClick={saveName}
                                            disabled={saving}
                                            className='p-1.5 rounded-lg text-success hover:bg-success/10 transition-colors cursor-pointer'
                                        >
                                            {saving ? (
                                                <FaSpinner className='w-3.5 h-3.5 animate-spin' />
                                            ) : (
                                                <FaCheck className='w-3.5 h-3.5' />
                                            )}
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className='p-1.5 rounded-lg text-surface-muted hover:bg-surface-elevated transition-colors cursor-pointer'
                                        >
                                            <FaXmark className='w-3.5 h-3.5' />
                                        </button>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-2 group'>
                                        <p className='font-semibold text-surface-foreground truncate'>
                                            {user.name || t('auth.unknown_user')}
                                        </p>
                                        <button
                                            onClick={startEditing}
                                            className='p-1 rounded-lg opacity-0 group-hover:opacity-100 text-surface-muted hover:text-primary hover:bg-surface-elevated transition-all cursor-pointer'
                                        >
                                            <FaPen className='w-3 h-3' />
                                        </button>
                                    </div>
                                )}
                                <p className='text-sm text-surface-muted truncate'>
                                    {user.email || t('auth.no_email')}
                                </p>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-2 text-xs'>
                            <div className='rounded-lg bg-surface-elevated p-2'>
                                <span className='text-surface-muted'>{t('auth.user_id')}</span>
                                <p className='font-mono text-surface-foreground truncate flex items-center gap-1'>
                                    {user.userId}
                                    <button
                                        onClick={handleCopyId}
                                        className='shrink-0 p-0.5 rounded text-surface-muted hover:text-primary hover:bg-surface-overlay transition-colors cursor-pointer'
                                    >
                                        {copied ? (
                                            <FaCircleCheck className='w-3 h-3 text-success' />
                                        ) : (
                                            <FaCopy className='w-3 h-3' />
                                        )}
                                    </button>
                                </p>
                            </div>
                            {user.role && (
                                <div className='rounded-lg bg-surface-elevated p-2'>
                                    <span className='text-surface-muted'>{t('auth.role')}</span>
                                    <p className='font-medium text-surface-foreground capitalize'>
                                        {user.role}
                                    </p>
                                </div>
                            )}
                            <div className='rounded-lg bg-surface-elevated p-2'>
                                <span className='text-surface-muted'>{t('auth.joined')}</span>
                                <p className='font-mono text-surface-foreground'>
                                    {user.createdAt ? timeAgo(user.createdAt) : '-'}
                                </p>
                            </div>
                            {user.lastLoginAt && (
                                <div className='rounded-lg bg-surface-elevated p-2'>
                                    <span className='text-surface-muted'>
                                        {t('auth.last_login')}
                                    </span>
                                    <p className='font-mono text-surface-foreground'>
                                        {timeAgo(user.lastLoginAt)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {user.googleId && (
                            <div className='flex items-center gap-2 text-xs text-surface-muted pt-1 border-t border-border'>
                                <FaGoogle className='w-3 h-3' />
                                <span>{t('auth.google_linked')}</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {message && (
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -10 }}
                    className={`rounded-xl p-4 mb-5 border ${
                        message.type === 'success'
                            ? 'bg-success-subtle border-success/20 text-success'
                            : 'bg-error-subtle border-error/20 text-error'
                    }`}
                >
                    <div className='flex items-center gap-2'>
                        {message.type === 'success' ? (
                            <FaCircleCheck className='w-4 h-4 shrink-0' />
                        ) : (
                            <FaCircleXmark className='w-4 h-4 shrink-0' />
                        )}
                        <span className='text-sm font-medium'>{message.text}</span>
                    </div>
                </motion.div>
            )}

            <div className='flex flex-col gap-3'>
                {user && (
                    <Button
                        variant='outline'
                        onClick={onLogout}
                        disabled={loading}
                        className='border-error/50 text-error hover:bg-error/10'
                    >
                        {loading ? (
                            <FaSpinner className='w-4 h-4 animate-spin' />
                        ) : (
                            <FaArrowRightFromBracket className='w-4 h-4' />
                        )}
                        {t('auth.logout_button')}
                    </Button>
                )}
            </div>
        </>
    );
}
