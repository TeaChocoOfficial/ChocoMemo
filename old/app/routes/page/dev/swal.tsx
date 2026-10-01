// -Path: 'client/app/routes/page/dev/swal.tsx'
import SwalLab from '~/pages/dev/SwalLab';

export function meta() {
    return [
        { title: 'ChocoMemo - Swal Lab' },
        { name: 'robots', content: 'noindex' },
    ];
}

export default function Swal() {
    return <SwalLab />;
}
