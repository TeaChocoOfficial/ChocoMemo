import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { getAssetUrl } from '~/utils/url';

export default function NavbarLogo() {
    return (
        <Link to='/' className='flex shrink-0 items-center gap-2.5 group'>
            <motion.img
                alt='ChocoMemo'
                src={getAssetUrl('/icon.png')}
                whileHover={{ rotate: -6, scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className='h-12 shrink-0'
            />
        </Link>
    );
}
