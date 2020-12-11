import React, {Fragment} from 'react';
import {usePage} from "@inertiajs/inertia-react";

import AppLayout from "@/Layouts/AppLayout";
import SectionBorder from "@/Jetstream/SectionBorder";
import UpdateProfileInformationForm from "@/Pages/Profile/UpdateProfileInformationForm";
import UpdatePasswordForm from "@/Pages/Profile/UpdatePasswordForm";
import TwoFactorAuthenticationForm from "@/Pages/Profile/TwoFactorAuthenticationForm";
import LogoutOtherBrowserSessionForm from "@/Pages/Profile/LogoutOtherBrowserSessionsForm";
import DeleteUserForm from "@/Pages/Profile/DeleteUserForm";

export default function Show(props) {
    const {sessions} = props;

    const pageProps = usePage().props;

    return (
        <AppLayout header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Profile
            </h2>
        }>
            <div>
                <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                    {pageProps.jetstream.canUpdateProfileInformation && (
                        <Fragment>
                            <UpdateProfileInformationForm user={pageProps.user} />
                            <SectionBorder />
                        </Fragment>
                    )}

                    {pageProps.jetstream.canUpdatePassword && (
                        <Fragment>
                            <UpdatePasswordForm className="mt-10 sm:mt-0" />
                            <SectionBorder />
                        </Fragment>
                    )}

                    {pageProps.jetstream.canManageTwoFactorAuthentication && (
                        <Fragment>
                            <TwoFactorAuthenticationForm className="mt-10 sm:mt-0" />
                            <SectionBorder />
                        </Fragment>
                    )}

                    <LogoutOtherBrowserSessionForm sessions={sessions} className="mt-10 sm:mt-0" />
                    <SectionBorder />

                    <DeleteUserForm className="mt-10 sm:mt-0" />
                </div>
            </div>
        </AppLayout>
    );
}
