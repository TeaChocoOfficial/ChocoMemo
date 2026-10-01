import { authAPI } from '~/services/auth';
import { AuthProvider } from '~/types/auth';

/** Connect/Disconnect for each provider, keyed by `AuthProvider`.
 *  Connect runs the OAuth link; Disconnect re-verifies with the provider first,
 *  which is what authorises unlinking it. */
export const PROVIDER_ACTIONS: Record<
    AuthProvider,
    { login: (path: string) => void; disconnect: (path: string) => void }
> = {
    [AuthProvider.LOCAL]: { login: () => {}, disconnect: () => {} },
    [AuthProvider.GOOGLE]: { login: authAPI.googleLogin, disconnect: authAPI.googleDisconnect },
    [AuthProvider.DISCORD]: { login: authAPI.discordLogin, disconnect: authAPI.discordDisconnect },
    [AuthProvider.LINE]: { login: authAPI.lineLogin, disconnect: authAPI.lineDisconnect },
    [AuthProvider.X]: { login: authAPI.xLogin, disconnect: authAPI.xDisconnect },
};
