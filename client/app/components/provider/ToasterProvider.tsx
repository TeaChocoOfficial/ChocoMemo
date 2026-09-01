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
                background: '#363636',
                color: '#fff',
            },
            success: {
                duration: 3000,
                iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                },
            },
            error: {
                duration: 8000, // error toast นานขึ้น
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            },
        }}
    />
);
