import { useSwal } from '~/hooks/useSwal';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    showToast?: boolean;
    onReset?: () => void;
    children?: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    error?: Error;
    hasError: boolean;
}

interface InnerProps extends Props {
    showError: (error: Error) => void;
    notifySuccess: (message: string) => void;
    notifyError: (message: string) => void;
    closeAlert: () => void;
}

class ErrorBoundaryInner extends Component<InnerProps, State> {
    constructor(props: InnerProps) {
        super(props);
        this.state = { hasError: false };
        this.copyError = this.copyError.bind(this);
        this.resetError = this.resetError.bind(this);
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    copyError() {
        if (!this.state.error) return;

        const text = this.state.error.message;

        const copyFallback = (str: string): boolean => {
            const textarea = document.createElement('textarea');
            textarea.value = str;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            const copied = document.execCommand('copy');
            document.body.removeChild(textarea);
            return copied;
        };

        const onSuccess = () => {
            this.props.closeAlert();
            this.props.notifySuccess('Error message copied!');
        };

        const onFail = () => {
            this.props.closeAlert();
            this.props.notifyError('Copy failed. Please copy manually.');
        };

        if (navigator.clipboard?.writeText) {
            navigator.clipboard
                .writeText(text)
                .then(onSuccess)
                .catch(() => {
                    if (!copyFallback(text)) onFail();
                });
        } else if (!copyFallback(text)) {
            onFail();
        } else {
            onSuccess();
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        if (this.props.showToast !== false) {
            this.props.showError(error);
        }

        this.props.onError?.(error, errorInfo);
    }

    resetError(): void {
        this.props.closeAlert();
        this.setState({ hasError: false, error: undefined });
        this.props.onReset?.();
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return (
                    <div>
                        {this.props.fallback}
                        <button
                            onClick={this.resetError}
                            className='mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-sm cursor-pointer'
                        >
                            Try Again
                        </button>
                    </div>
                );
            }
            return (
                <div className='p-6 text-center border border-line rounded-sm bg-surface'>
                    <h2 className='text-xl font-bold text-error mb-2'>Something went wrong</h2>
                    <p className='text-surface-muted mb-4'>{this.state.error?.message}</p>
                    <button
                        onClick={this.copyError}
                        className='mr-2 px-4 py-2 bg-surface border border-line text-surface-foreground rounded-sm hover:bg-surface-overlay cursor-pointer'
                    >
                        Copy Error
                    </button>
                    <button
                        onClick={this.resetError}
                        className='px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary-emphasis cursor-pointer'
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default function ErrorBoundary(props: Props) {
    const swal = useSwal();

    const showError = (error: Error) => {
        void swal.fire({
            icon: 'error',
            title: 'Error Occurred',
            showConfirmButton: true,
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            text: error.message || 'Something went wrong!',
        });
    };

    return (
        <ErrorBoundaryInner
            {...props}
            showError={showError}
            notifyError={swal.error}
            closeAlert={swal.swal.close}
            notifySuccess={swal.success}
        />
    );
}
