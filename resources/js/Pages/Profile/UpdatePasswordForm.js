import classNames from 'classnames';
import { useFormik, FormikProvider } from "formik";
import { Inertia } from '@inertiajs/inertia'
import React, {Fragment, useRef} from 'react';

import ActionMessage from "@/Jetstream/ActionMessage";
import Button from "@/Jetstream/Button";
import FormSection from "@/Jetstream/FormSection";
import Input from "@/Jetstream/Input";
import InputError from "@/Jetstream/InputError";
import Label from "@/Jetstream/Label";

export default function UpdatePasswordForm(props) {
    const form = useFormik({
        initialValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
        onSubmit: async (values, {setErrors, resetForm}) => {
            await Inertia.put(route('user-password.update'), values, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["updatePassword"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    } else {
                        currrentPasswordInput.current.focus()
                    }
                }
            });
        }
    });

    const currrentPasswordInput = useRef(null);

    return (
        <FormikProvider value={form}>
            <FormSection
                title="Update Password"
                description="Ensure your account is using a long, random password to stay secure."
                form={
                    <Fragment>
                        <div className="col-span-6 sm:col-span-4">
                            <Label htmlFor="current_password" value="Current Password" />
                            <Input id="current_password" type="password" name="current_password" className="mt-1 block w-full" ref={currrentPasswordInput} />
                            <InputError name="current_password" className="mt-2" />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <Label htmlFor="password" value="New Password" />
                            <Input id="password" type="password" name="password" className="mt-1 block w-full" />
                            <InputError name="password" className="mt-2" />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <Label htmlFor="password_confirmation" value="Confirm Password" />
                            <Input id="password_confirmation" type="password" name="password_confirmation" className="mt-1 block w-full" autoComplete="new-password" />
                            <InputError name="password_confirmation" className="mt-2" />
                        </div>
                    </Fragment>
                }
                actions={
                    <Fragment>
                        <ActionMessage on={true} className="mr-3">
                            Saved.
                        </ActionMessage>

                        <Button className={classNames({"opacity-25": form.isSubmitting})} disabled={form.isSubmitting}>Save</Button>
                    </Fragment>
                }
            />
        </FormikProvider>
    );
}
