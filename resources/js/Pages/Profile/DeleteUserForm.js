import classNames from "classnames";
import {useFormik, FormikProvider} from "formik";
import { Inertia } from '@inertiajs/inertia'
import React, {Fragment, useState, useRef} from 'react';

import ActionSection from "@/Jetstream/ActionSection";
import DangerButton from "@/Jetstream/DangerButton";
import DialogModal from "@/Jetstream/DialogModal";
import Input from "@/Jetstream/Input";
import InputError from "@/Jetstream/InputError";
import SecondaryButton from "@/Jetstream/SecondaryButton";

export default function DeleteUserForm(props) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

    const form = useFormik({
        initialValues: {
            _method: "DELETE",
            password: ""
        },
        onSubmit: async (values, {setErrors}) => {
            await Inertia.post(route('current-user.destroy'), values, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["deleteUser"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    } else {
                        setConfirmingUserDeletion(false);
                    }
                }
            });
        }
    });

    const passwordInput = useRef(null);

    const confirmUserDeletion = () => {
        form.setValues({
            ...form.values,
            password: "",
        });
        setConfirmingUserDeletion(true);

        setTimeout(() => {
            passwordInput.current.focus();
        }, 250)
    };

    return (
        <ActionSection
            title="Delete Account"
            description="Permanently delete your account."
            content={
                <Fragment>
                    <div className="max-w-xl text-sm text-gray-600">
                        Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
                    </div>

                    <div className="mt-5">
                        <DangerButton onClick={confirmUserDeletion}>
                            Delete Account
                        </DangerButton>
                    </div>

                    {/* Delete Account Confirmation Modal */}
                    <FormikProvider value={form}>
                        <DialogModal
                            show={confirmingUserDeletion}
                            onClose={() => {setConfirmingUserDeletion(false)}}
                            title="Delete Account"
                            content={
                                <Fragment>
                                    Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.

                                    <div className="mt-4">
                                        <Input type="password" name="password" className="mt-1 block w-3/4" placeholder="Password" ref={passwordInput} />
                                        <InputError name="password" className="mt-2" />
                                    </div>
                                </Fragment>
                            }
                            footer={
                                <Fragment>
                                    <SecondaryButton onClick={() => {setConfirmingUserDeletion(false)}}>
                                        Nevermind
                                    </SecondaryButton>

                                    <DangerButton onClick={() => {form.submitForm()}} className={classNames("ml-2", {"opacity-25": form.isSubmitting})} disabled={form.isSubmitting}>
                                        Delete Account
                                    </DangerButton>
                                </Fragment>
                            }
                        />
                    </FormikProvider>
                </Fragment>
            }
        />
    );
}
