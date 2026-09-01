// -Path: "vite-react-typescript/src/components/custom/ErrorBound.tsx"
import { Component } from 'react';
import toast from 'react-hot-toast';

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
                        } max-w-md w-full bg-red-500 shadow-lg rounded-lg pointer-events-auto flex flex-col`}
                        style={{
                            background: '#ef4444',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div className='p-4'>
                            <div className='flex items-start'>
                                <div className='shrink-0 pt-0.5'>
                                    <span className='text-xl'>⚠️</span>
                                </div>
                                <div className='ml-3 flex-1'>
                                    <p className='text-sm font-medium text-white'>Error Occurred</p>
                                    <p className='mt-1 text-sm text-white/90 wrap-break-word'>
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
                                    className='px-3 py-1.5 text-sm font-medium text-white bg-white/20 rounded-md hover:bg-white/30 transition-colors'
                                >
                                    📋 Copy
                                </button>
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className='px-3 py-1.5 text-sm font-medium text-white bg-white/20 rounded-md hover:bg-white/30 transition-colors'
                                >
                                    ✕ Close
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
                            className='mt-4 px-4 py-2 bg-red-500 text-white rounded-md'
                        >
                            Try Again
                        </button>
                    </div>
                );
            }
            return (
                <div className='p-6 text-center'>
                    <h2 className='text-xl font-bold text-red-600 mb-2'>Something went wrong</h2>
                    <p className='text-gray-600 mb-4'>{this.state.error?.message}</p>
                    <button
                        onClick={this.copyError}
                        className='mr-2 px-4 py-2 bg-gray-500 text-white rounded-md'
                    >
                        Copy Error
                    </button>
                    <button
                        onClick={this.resetError}
                        className='px-4 py-2 bg-red-500 text-white rounded-md'
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
