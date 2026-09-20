import AccountDetailsForm from './AccountDetailsForm';
import ChangePasswordForm from './ChangePasswordForm';
import DangerZoneSection from './DangerZoneSection';

/** Groups the account-management sections: details form, password, danger zone. */
export default function AccountDetails() {
    return (
        <div className='space-y-12'>
            <AccountDetailsForm />
            <ChangePasswordForm />
            <DangerZoneSection />
        </div>
    );
}
