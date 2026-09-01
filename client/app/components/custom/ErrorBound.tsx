// -Path: "vite-react-typescript/src/components/custom/ErrorBound.tsx"
import { Component } from 'react';
import toast from 'react-hot-toast';
import { FaTriangleExclamation, FaCopy } from 'react-icons/fa6';

interface Props {
    showToast?: boolean;
    onReset?: () => void;
    children?: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    error?: Error;
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    private toastId: string | undefined;

    constructor(props: Props) {
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
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        };

        const onSuccess = () => {
            toast.success('Error message copied!', {
                duration: 2000,
                position: 'top-center',
            });
        };

        const onFail = () => {
            toast.error('Copy failed. Please copy manually.', {
                duration: 3000,
                position: 'top-center',
            });
        };

        if (navigator.clipboard?.writeText) {
            navigator.clipboard
                .writeText(text)
                .then(onSuccess)
                .catch(() => {
                    if (!copyFallback(text)) onFail();
                });
        } else {
            if (!copyFallback(text)) onFail();
            else onSuccess();
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        if (this.props.showToast !== false) {
            // ปิด toast เดิมถ้ามี
            if (this.toastId) toast.dismiss(this.toastId);
            // สร้าง custom toast ที่มีปุ่ม
            this.toastId = toast.custom(
                (t) => (
                    <div
                        className={`${
                            t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full rounded-sm pointer-events-auto flex flex-col`}
                        style={{
                            background: 'var(--color-error)',
                            border: '1px solid var(--color-error-muted)',
                        }}
                    >
                        <div className='p-4'>
                            <div className='flex items-start'>
                                <div className='shrink-0 pt-0.5'>
                                    <FaTriangleExclamation className='w-5 h-5 text-error-foreground' />
                                </div>
                                <div className='ml-3 flex-1'>
                                    <p className='text-sm font-bold text-error-foreground'>Error Occurred</p>
                                    <p className='mt-1 text-sm text-error-foreground/90 wrap-break-word'>
                                        {error.message || 'Something went wrong!'}
                                    </p>
                                </div>
                            </div>
                            <div className='mt-3 flex gap-2 justify-end'>
                                <button
                                    onClick={() => {
                                        this.copyError();
                                        toast.dismiss(t.id);
                                    }}
                                    className='px-3 py-1.5 text-sm font-medium text-error-foreground bg-transparent border border-error-foreground/40 rounded-sm hover:bg-error-foreground/10 transition-colors'
                                >
                                    <FaCopy className='w-3.5 h-3.5 mr-1 inline' />
                                    Copy
                                </button>
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className='px-3 py-1.5 text-sm font-medium text-error-foreground bg-error-foreground/10 rounded-sm hover:bg-error-foreground/20 transition-colors'
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                ),
                {
                    duration: Infinity, // ไม่หายอัตโนมัติ
                    position: 'top-center',
                },
            );
        }

        this.props.onError?.(error, errorInfo);
    }

    resetError(): void {
        if (this.toastId) {
            toast.dismiss(this.toastId);
            this.toastId = undefined;
        }
        this.setState({ hasError: false, error: undefined });
        this.props.onReset?.();
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return (
                    <div>
                        {this.props.fallback}
                        <button
                            onClick={this.resetError}
                            className='mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-sm cursor-pointer'
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
                        className='px-4 py-2 bg-accent text-accent-foreground rounded-sm hover:bg-accent-emphasis cursor-pointer'
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
