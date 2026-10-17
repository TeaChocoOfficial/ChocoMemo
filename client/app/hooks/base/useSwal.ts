//-Path: "TeaChoco-Hospital/client/src/hooks/useSwal.ts"
import Swal, { type SweetAlertOptions } from 'sweetalert2';

/**
 * useSwal hook to provide a consistent SweetAlert2 configuration across the
 * application.
 *
 * Styling lives in `app.css` (the "SWEETALERT2 → PROJECT THEME" block), which
 * maps SweetAlert2's `--swal2-*` custom properties onto the app's design
 * tokens. That means every dialog and toast automatically follows the active
 * theme — all 13 of them — with no colour plumbing here, and no re-render
 * needed when the user switches themes.
 *
 * `buttonsStyling` is deliberately left at its default so the buttons keep
 * SweetAlert2's `swal2-styled` behaviour (focus ring, disabled state); the
 * theme block styles them.
 */
export function useSwal() {
    const fire = (options: SweetAlertOptions) => {
        return Swal.fire({
            ...options,
            // Caller-supplied customClass wins over the defaults.
            customClass: { ...(options.customClass as object) },
        });
    };

    const success = (title: string, text?: string) =>
        fire({
            text,
            title,
            toast: true,
            timer: 3000,
            icon: 'success',
            position: 'top',
            showConfirmButton: false,
        });

    const errors = (options: SweetAlertOptions & { error?: unknown }) => {
        const err = options.error;
        const text = err instanceof Error ? err.message : err ? `${err}` : undefined;
        fire({ ...options, text, icon: 'error' });
    };

    const error = (title: string, options?: SweetAlertOptions & { error?: unknown }) =>
        errors({ title, ...options });

    return { fire, error, errors, success, swal: Swal };
}
