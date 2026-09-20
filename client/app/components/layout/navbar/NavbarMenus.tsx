import ProfileMenu from './ProfileMenu';
import GuestMenus from './GuestMenus';
import { useAuthStore } from '~/stores/auth.store';

type NavbarMenusProps = {
    onSignIn: () => void;
};

export default function NavbarMenus({ onSignIn }: NavbarMenusProps) {
    const { user } = useAuthStore();

    const isAuthenticated = user !== null && user !== undefined;

    return isAuthenticated ? <ProfileMenu /> : <GuestMenus onSignIn={onSignIn} />;
}