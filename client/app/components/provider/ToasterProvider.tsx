// -Path: 'app/components/provider/ToasterProvider.tsx'
import { Toaster } from 'react-hot-toast';

export const ToasterProvider = () => (
    <Toaster
        gutter={8}
        containerStyle={{}}
        reverseOrder={false}
        position='top-center'
        containerClassName=''
        toastOptions={{
            duration: 5000, // default duration สำหรับ toast ปกติ
            style: {
                background: 'var(--color-surface-elevated)',
                color: 'var(--color-surface-foreground)',
                border: '1px solid var(--color-line)',
                borderRadius: '2px',
            },
            success: {
                duration: 3000,
                iconTheme: {
                    primary: 'var(--color-success)',
                    secondary: 'var(--color-success-foreground)',
                },
            },
            error: {
                duration: 8000, // error toast นานขึ้น
                iconTheme: {
                    primary: 'var(--color-error)',
                    secondary: 'var(--color-error-foreground)',
                },
            },
        }}
    />
);
