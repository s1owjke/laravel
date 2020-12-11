import classNames from "classnames";
import {Inertia} from "@inertiajs/inertia";
import {usePage} from "@inertiajs/inertia-react";
import React, {Fragment, useState, useMemo} from 'react';

import ActionSection from "@/Jetstream/ActionSection";
import Button from "@/Jetstream/Button";
import ConfirmsPassword from "@/Jetstream/ConfirmsPassword";
import SecondaryButton from "@/Jetstream/SecondaryButton";
import DangerButton from "@/Jetstream/DangerButton";

const baseUrl = route().ziggy.baseUrl;

export default function TwoFactorAuthenticationForm(props) {
    const pageProps = usePage().props;

    const [enabling, setEnabling] = useState(false);
    const [disabling, setDisabling] = useState(false);

    const [qrCode, setQrCode] = useState(null);
    const [recoveryCodes, setRecoveryCodes] = useState([]);

    const enableTwoFactorAuthentication = () => {
        setEnabling(true);

        Inertia.post(baseUrl + 'user/two-factor-authentication', {}, {
            preserveScroll: true,
        }).then(() => {
            return Promise.all([
                showQrCode(),
                showRecoveryCodes()
            ]);
        }).then(() => {
            setEnabling(false);
        });
    };

    const showQrCode = () => {
        return axios.get(baseUrl + 'user/two-factor-qr-code')
            .then(response => {
                setQrCode(response.data.svg);
            });
    };

    const showRecoveryCodes = () => {
        return axios.get(baseUrl + 'user/two-factor-recovery-codes')
            .then(response => {
                setRecoveryCodes(response.data);
            });
    };

    const regenerateRecoveryCodes = () => {
        axios.post(baseUrl + 'user/two-factor-recovery-codes')
            .then(response => {
                showRecoveryCodes();
            })
    };

    const disableTwoFactorAuthentication = () => {
        setDisabling(true);

        Inertia.delete(baseUrl + 'user/two-factor-authentication', {
            preserveScroll: true,
        }).then(() => {
            setDisabling(false);
        });
    };

    const twoFactorEnabled = useMemo(() => {
        return !enabling && pageProps.user.two_factor_enabled
    });

    return (
        <ActionSection
            title="Two Factor Authentication"
            description="Add additional security to your account using two factor authentication."
            content={
                <Fragment>
                    {twoFactorEnabled && (
                        <h3 className="text-lg font-medium text-gray-900">
                            You have enabled two factor authentication.
                        </h3>
                    )}

                    {!twoFactorEnabled && (
                        <h3 className="text-lg font-medium text-gray-900">
                            You have not enabled two factor authentication.
                        </h3>
                    )}

                    <div className="mt-3 max-w-xl text-sm text-gray-600">
                        <p>
                            When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application.
                        </p>
                    </div>

                    {twoFactorEnabled && (
                        <Fragment>
                            {qrCode && (
                                <div>
                                    <div className="mt-4 max-w-xl text-sm text-gray-600">
                                        <p className="font-semibold">
                                            Two factor authentication is now enabled. Scan the following QR code using your phone's authenticator application.
                                        </p>
                                    </div>

                                    <div className="mt-4 dark:p-4 dark:w-56 dark:bg-white" dangerouslySetInnerHTML={{__html: qrCode}}></div>
                                </div>
                            )}

                            {recoveryCodes.length > 0 && (
                                <div>
                                    <div className="mt-4 max-w-xl text-sm text-gray-600">
                                        <p className="font-semibold">
                                            Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.
                                        </p>
                                    </div>

                                    <div className="grid gap-1 max-w-xl mt-4 px-4 py-4 font-mono text-sm bg-gray-100 rounded-lg">
                                        {recoveryCodes.map(code => (
                                            <div key={code}>{code}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    )}

                    <div className="mt-5">
                        {!twoFactorEnabled && (
                            <ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
                                <Button className={classNames({"opacity-25": enabling})} disabled={enabling}>
                                    Enable
                                </Button>
                            </ConfirmsPassword>
                        )}

                        {twoFactorEnabled && (
                            <Fragment>
                                {recoveryCodes.length > 0 && (
                                    <ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                                        <SecondaryButton className="mr-3">
                                            Regenerate Recovery Codes
                                        </SecondaryButton>
                                    </ConfirmsPassword>
                                )}

                                {recoveryCodes.length === 0 && (
                                    <ConfirmsPassword onConfirm={showRecoveryCodes}>
                                        <SecondaryButton className="mr-3">
                                            Show Recovery Codes
                                        </SecondaryButton>
                                    </ConfirmsPassword>
                                )}

                                <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                                    <DangerButton className={classNames({"opacity-25": disabling})} disabled={disabling}>
                                        Disable
                                    </DangerButton>
                                </ConfirmsPassword>
                            </Fragment>
                        )}
                    </div>
                </Fragment>
            }
        />
    );
}
