import classNames from "classnames";
import {useFormik, FormikProvider} from "formik";
import { Inertia } from '@inertiajs/inertia'
import React, {Fragment, useState, useRef} from 'react';

import ActionMessage from "@/Jetstream/ActionMessage";
import ActionSection from "@/Jetstream/ActionSection";
import Button from "@/Jetstream/Button";
import DialogModal from "@/Jetstream/DialogModal";
import Input from "@/Jetstream/Input";
import InputError from "@/Jetstream/InputError";
import SecondaryButton from "@/Jetstream/SecondaryButton";

export default function LogoutOtherBrowserSessionForm(props) {
    const {sessions} = props;

    const [confirmingLogout, setConfirmingLogout] = useState(false);

    const form = useFormik({
        initialValues: {
            _method: "DELETE",
            password: ""
        },
        onSubmit: async (values, {setErrors}) => {
            await Inertia.post(route('other-browser-sessions.destroy'), values, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["logoutOtherBrowserSessions"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    } else {
                        setConfirmingLogout(false);
                    }
                }
            });
        }
    });

    const passwordInput = useRef(null);

    const confirmLogout = () => {
        form.setValues({
            ...form.values,
            password: "",
        });
        setConfirmingLogout(true);

        setTimeout(() => {
            passwordInput.current.focus();
        }, 250)
    };

    return (
        <ActionSection
            title="Browser Sessions"
            description="Manage and logout your active sessions on other browsers and devices."
            content={
                <Fragment>
                    <div className="max-w-xl text-sm text-gray-600">
                        If necessary, you may logout of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.
                    </div>

                    {/* Other Browser Sessions */}
                    {sessions.length > 0 && (
                        <div className="mt-5 space-y-6">
                            {sessions.map((session, index) => (
                                <div className="flex items-center" key={index}>
                                    <div>
                                        {session.agent.is_desktop && (
                                            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-gray-500">
                                                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                        )}

                                        {!session.agent.is_desktop && (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gray-500">
                                                <path d="M0 0h24v24H0z" stroke="none"></path><rect x="7" y="4" width="10" height="16" rx="1"></rect><path d="M11 5h2M12 17v.01"></path>
                                            </svg>
                                        )}
                                    </div>

                                    <div className="ml-3">
                                        <div className="text-sm text-gray-600">
                                            {session.agent.platform} - {session.agent.browser}
                                        </div>

                                        <div>
                                            <div className="text-xs text-gray-500">
                                                {session.ip_address},{" "}

                                                {session.is_current_device && (
                                                    <span className="text-green-500 font-semibold">This device</span>
                                                )}
                                                {!session.is_current_device && (
                                                    <span>Last active {session.last_active}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center mt-5">
                        <Button onClick={confirmLogout}>
                            Logout Other Browser Sessions
                        </Button>

                        <ActionMessage on={true} className="ml-3">
                            Done.
                        </ActionMessage>
                    </div>

                    {/* Logout Other Devices Confirmation Modal */}
                    <FormikProvider value={form}>
                        <DialogModal
                            show={confirmingLogout}
                            onClose={() => {setConfirmingLogout(false)}}
                            title="Logout Other Browser Sessions"
                            content={
                                <Fragment>
                                    Please enter your password to confirm you would like to logout of your other browser sessions across all of your devices.

                                    <div className="mt-4">
                                        <Input type="password" name="password" className="mt-1 block w-3/4" placeholder="Password" ref={passwordInput} />
                                        <InputError name="password" className="mt-2" />
                                    </div>
                                </Fragment>
                            }
                            footer={
                                <Fragment>
                                    <SecondaryButton onClick={() => {setConfirmingLogout(false)}}>
                                        Nevermind
                                    </SecondaryButton>

                                    <Button onClick={() => {form.submitForm()}} className={classNames("ml-2", {"opacity-25": form.isSubmitting})} disabled={form.isSubmitting}>
                                        Logout Other Browser Sessions
                                    </Button>
                                </Fragment>
                            }
                        />
                    </FormikProvider>
                </Fragment>
            }
        />
    );
}
