// -Path: 'client/app/pages/dev/SwalLab.tsx'
// Dev-only playground for the SweetAlert2 theme layer in app.css.
// Every button fires a dialog variant so the styling can be checked against
// all 13 themes without hunting through real app flows.
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useSwal } from '~/hooks/useSwal';
import { THEMES, useThemeStore } from '~/stores/config/theme.store';
import Section from '~/components/custom/Section';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link } from '~/i18n/routing';

/** Design tokens worth eyeballing next to a dialog. */
const WATCHED_TOKENS = [
    '--color-surface',
    '--color-surface-elevated',
    '--color-surface-foreground',
    '--color-surface-subtle',
    '--color-border-strong',
    '--color-primary',
    '--color-primary-foreground',
    '--color-primary-emphasis',
    '--color-success',
    '--color-error',
] as const;

function readToken(name: string): string {
    if (typeof window === 'undefined') return '';
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className='rounded-sm border border-line bg-surface p-5'>
            <p className='mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary'>
                {title}
            </p>
            <div className='flex flex-wrap gap-2'>{children}</div>
        </section>
    );
}

function Btn({
    onClick,
    children,
    variant = 'surface',
}: {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'outline' | 'surface';
}) {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`cursor-pointer rounded-sm px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                variant === 'primary'
                    ? 'bg-primary text-primary-foreground hover:bg-primary-emphasis'
                    : variant === 'outline'
                      ? 'border border-line-strong text-primary hover:border-primary hover:bg-primary-subtle'
                      : 'border border-line bg-surface text-surface-foreground hover:bg-surface-overlay'
            }`}
        >
            {children}
        </button>
    );
}

export default function SwalLab() {
    const swal = useSwal();
    const { t } = useTranslation();
    const { theme, setTheme } = useThemeStore();
    const [lastResult, setLastResult] = useState<string>('—');

    const record = (label: string) => (result: unknown) => {
        const value =
            typeof result === 'object' && result !== null && 'value' in result
                ? JSON.stringify((result as { value: unknown }).value)
                : String(result);
        setLastResult(`${label} → ${value}`);
    };

    return (
        <Section className='items-start'>
            <div className='mx-auto w-full max-w-4xl px-4 py-10 sm:px-6'>
                <Link
                    to='/'
                    className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition-colors hover:text-primary'
                >
                    <FaArrowLeft className='h-3.5 w-3.5' />
                    {t('languageSelect.back_home')}
                </Link>

                <p className='font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary'>
                    Dev only
                </p>
                <h1 className='mt-2 text-3xl font-black tracking-tight text-surface-foreground'>
                    SweetAlert2 lab
                </h1>
                <p className='mt-2 text-sm leading-relaxed text-surface-subtle'>
                    Switch themes below, then fire dialogs. Styling comes from the{' '}
                    <code className='font-mono text-xs'>app.css</code> token map, so everything
                    should follow the active theme with no reload.
                </p>

                <div className='mt-8 space-y-4'>
                    <Row title='Theme'>
                        {THEMES.map((item) => (
                            <button
                                key={item.id}
                                type='button'
                                onClick={() => setTheme(item.id)}
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    theme === item.id
                                        ? 'border-primary text-primary'
                                        : 'border-line text-surface-muted hover:border-primary hover:text-primary'
                                }`}
                            >
                                <span
                                    aria-hidden
                                    className='h-3.5 w-3.5 rounded-full border border-border-strong'
                                    style={{ background: item.swatch }}
                                />
                                {item.id}
                            </button>
                        ))}
                    </Row>

                    <Row title='Toasts'>
                        <Btn onClick={() => swal.success('Saved', 'Your changes are on the shelf.')}>
                            success
                        </Btn>
                        <Btn
                            onClick={() =>
                                swal.error('Upload failed', { error: new Error('413 too large') })
                            }
                        >
                            error
                        </Btn>
                        <Btn
                            onClick={() =>
                                swal.fire({
                                    title: 'Heads up',
                                    text: 'This deck has no author credit.',
                                    toast: true,
                                    timer: 3000,
                                    icon: 'warning',
                                    position: 'top',
                                    showConfirmButton: false,
                                })
                            }
                        >
                            warning
                        </Btn>
                        <Btn
                            onClick={() =>
                                swal.fire({
                                    title: 'Heads up',
                                    text: 'A new version is available.',
                                    toast: true,
                                    timer: 3000,
                                    icon: 'info',
                                    position: 'top',
                                    showConfirmButton: false,
                                })
                            }
                        >
                            info
                        </Btn>
                        <Btn
                            onClick={() =>
                                swal.fire({
                                    title: 'Are you sure?',
                                    toast: true,
                                    timer: 3000,
                                    icon: 'question',
                                    position: 'top',
                                    showConfirmButton: false,
                                })
                            }
                        >
                            question
                        </Btn>
                        <Btn
                            onClick={() =>
                                swal.fire({
                                    title: 'Long toast',
                                    text: 'A deliberately long toast body so you can check wrapping, padding and the timer progress bar against this theme.',
                                    toast: true,
                                    timer: 5000,
                                    icon: 'info',
                                    position: 'top',
                                    showConfirmButton: false,
                                })
                            }
                        >
                            long toast
                        </Btn>
                    </Row>

                    <Row title='Dialogs'>
                        <Btn
                            variant='primary'
                            onClick={() =>
                                void swal
                                    .fire({
                                        title: 'Publish this deck?',
                                        text: 'It becomes visible to everyone browsing the shelf.',
                                        showCancelButton: true,
                                        confirmButtonText: 'Publish',
                                        cancelButtonText: 'Not yet',
                                    })
                                    .then(record('publish'))
                            }
                        >
                            confirm + cancel
                        </Btn>
                        <Btn
                            onClick={() =>
                                void swal
                                    .fire({
                                        title: 'Delete deck?',
                                        text: 'This cannot be undone.',
                                        showCancelButton: true,
                                        showDenyButton: true,
                                        confirmButtonText: 'Delete',
                                        denyButtonText: 'Duplicate',
                                        cancelButtonText: 'Keep',
                                    })
                                    .then(record('delete'))
                            }
                        >
                            three buttons
                        </Btn>
                        <Btn
                            onClick={() =>
                                void swal.fire({
                                    title: 'Destructive action',
                                    text: 'Confirm uses the error token via a btn-error custom class.',
                                    showCancelButton: true,
                                    confirmButtonText: 'Delete forever',
                                    customClass: { confirmButton: 'btn-error' },
                                })
                            }
                        >
                            danger confirm
                        </Btn>
                        <Btn
                            onClick={() =>
                                void swal.fire({
                                    title: 'Long form copy',
                                    html: `<p style="text-align:left;margin:0 0 .75rem">A longer body to check the html container, line height and vertical rhythm:</p><ul style="text-align:left;margin:0;padding-left:1.1rem;line-height:1.7"><li>Hairline borders must stay visible.</li><li>Accent hover should read as emphasis, not a glow.</li><li>Buttons align left, like every other surface in the app.</li><li>Backdrop should dim without going pure black.</li></ul>`,
                                    showCancelButton: true,
                                    confirmButtonText: 'Looks right',
                                })
                            }
                        >
                            long body
                        </Btn>
                        <Btn
                            onClick={() =>
                                void swal.fire({
                                    title: 'Name your deck',
                                    input: 'text',
                                    inputPlaceholder: 'Everyday Things',
                                    inputLabel: 'Deck name',
                                    showCancelButton: true,
                                    confirmButtonText: 'Save',
                                    inputValidator: (value: string) =>
                                        value.trim() ? null : 'A name is required',
                                })
                            }
                        >
                            text input
                        </Btn>
                        <Btn
                            onClick={() =>
                                void swal.fire({
                                    title: 'Pick a source',
                                    input: 'select',
                                    inputOptions: {
                                        'Default shelf': 'default',
                                        'My own words': 'local',
                                        'Downloaded': 'imported',
                                    },
                                    showCancelButton: true,
                                    confirmButtonText: 'Choose',
                                })
                            }
                        >
                            select
                        </Btn>
                        <Btn
                            onClick={() =>
                                void swal.fire({
                                    title: 'Add a note',
                                    input: 'textarea',
                                    inputPlaceholder: 'Why this deck is useful…',
                                    showCancelButton: true,
                                    confirmButtonText: 'Add',
                                })
                            }
                        >
                            textarea
                        </Btn>
                        <Btn
                            onClick={() => {
                                void swal.fire({
                                    title: 'Brewing…',
                                    didOpen: () => {
                                        Swal.showLoading();
                                        setTimeout(
                                            () =>
                                                void Swal.fire({
                                                    icon: 'success',
                                                    title: 'Done',
                                                    text: 'The loading state resolved.',
                                                    showConfirmButton: false,
                                                    timer: 2000,
                                                }),
                                            1200,
                                        );
                                    },
                                });
                            }}
                        >
                            loading → success
                        </Btn>
                    </Row>

                    <Row title='Result'>
                        <span className='font-mono text-xs text-surface-muted'>{lastResult}</span>
                    </Row>

                    <section className='rounded-sm border border-line bg-surface p-5'>
                        <p className='mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary'>
                            Active tokens
                        </p>
                        <dl className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                            {WATCHED_TOKENS.map((token) => {
                                const value = readToken(token);
                                return (
                                    <div
                                        key={token}
                                        className='flex items-center gap-2 font-mono text-[11px]'
                                    >
                                        <span
                                            aria-hidden
                                            className='h-4 w-4 shrink-0 rounded-sm border border-line-strong'
                                            style={{ background: value }}
                                        />
                                        <span className='text-surface-muted'>{token}</span>
                                        <span className='truncate text-surface-foreground'>
                                            {value}
                                        </span>
                                    </div>
                                );
                            })}
                        </dl>
                    </section>
                </div>
            </div>
        </Section>
    );
}
