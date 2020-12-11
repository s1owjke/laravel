import classNames from 'classnames';
import {Inertia} from '@inertiajs/inertia'
import React, {Fragment, useRef, useState} from 'react';
import {FormikProvider, useFormik} from "formik";

import Button from "./Button";
import Input from "./Input";
import DialogModal from "./DialogModal";
import SecondaryButton from "./SecondaryButton";

export default function ConfirmsPassword(props) {
    const {
        onConfirm,
        title = "Confirm Password",
        content = "For your security, please confirm your password to continue.",
        button = "Confirm",
        children
    } = props;

    const passwordInput = useRef(null);

    const form = useFormik({
        initialValues: {
            password: '',
        },
        onSubmit: async (values, {setErrors, resetForm}) => {
            try {
                await axios.post(route('password.confirm').url(), values);

                setConfirmingPassword(false);
                resetForm();

                if (onConfirm) {
                    onConfirm();
                }
            } catch (error) {
                const errors = error.response.data.errors;

                if (errors && Object.keys(errors).length > 0) {
                    setErrors(errors);
                }
            }
        }
    });

    const [confirmingPassword, setConfirmingPassword] = useState(false);

    const startConfirmingPassword = () => {
        axios.get(route('password.confirmation').url()).then(response => {
            if (response.data.confirmed) {
                if (onConfirm) {
                    onConfirm();
                }
            } else {
                form.setValues({
                    ...form.values,
                    password: "",
                });
                setConfirmingPassword(true);

                setTimeout(() => {
                    passwordInput.current.focus();
                }, 250);
            }
        });
    };

    return (
        <Fragment>
            <span onClick={startConfirmingPassword}>{children}</span>

            <FormikProvider value={form}>
                <DialogModal
                    show={confirmingPassword}
                    onClose={() => {setConfirmingPassword(false)}}
                    title={title}
                    content={
                        <Fragment>
                            {content}

                            <div className="mt-4">
                                <Input type="password" name="password" className={classNames("form-input rounded-md shadow-sm", "mt-1 block w-3/4")} placeholder="Password" ref={passwordInput} />
                                {form.errors['password'] && <p className="mt-2 text-sm text-red-600">{form.errors['password']}</p>}
                            </div>
                        </Fragment>
                    }
                    footer={
                        <Fragment>
                            <SecondaryButton onClick={() => {setConfirmingPassword(false)}}>
                                Nevermind
                            </SecondaryButton>

                            <Button onClick={() => {form.submitForm()}} className={classNames("ml-2", {"opacity-25": form.isSubmitting})} disabled={form.isSubmitting}>
                                {button}
                            </Button>
                        </Fragment>
                    }
                />
            </FormikProvider>
        </Fragment>
    );
}