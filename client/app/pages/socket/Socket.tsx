// -Path: 'Vite-React-TypeScript/src/pages/socket/Socket.tsx'
import SocketHero from './SocketHero';
import SocketInfo from './SocketInfo';
import { motion } from 'framer-motion';
import PlayerCount from './PlayerCount';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { FaBolt, FaPlug } from 'react-icons/fa6';
import ConnectionStatus from './ConnectionStatus';
import { useSocketStore } from '~/stores/socket.store';

export default function SocketPage() {
    const { t } = useTranslation();
    const { socket, connect, disconnect, isConnected, playerCount } = useSocketStore();

    return (
        <section className='relative overflow-hidden py-16 sm:py-24'>
            <div className='absolute inset-0 -z-10'>
                <div className='absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-3xl' />
                <div className='absolute bottom-0 left-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl' />
            </div>

            <div className='mx-auto max-w-6xl px-4 sm:px-6'>
                <SocketHero isConnected={isConnected} />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto'>
                    <ConnectionStatus socket={socket} isConnected={isConnected} />
                    <PlayerCount count={playerCount} />
                </div>

                <motion.div
                    transition={{ duration: 0.6 }}
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    className='flex items-center justify-center gap-4 mb-20'
                >
                    {isConnected ? (
                        <Button size='lg' variant='outline' onClick={disconnect}>
                            <FaBolt className='w-4 h-4' />
                            {t('socket.disconnect')}
                        </Button>
                    ) : (
                        <Button size='lg' variant='primary' onClick={connect}>
                            <FaPlug className='w-4 h-4' />
                            {t('socket.connect')}
                        </Button>
                    )}
                </motion.div>

                <SocketInfo />
            </div>
        </section>
    );
}
