import classNames from 'classnames';
import { useFormik, FormikProvider } from "formik";
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react';
import React, { Fragment, useState } from 'react';

import ActionMessage from "@/Jetstream/ActionMessage";
import ActionSection from "@/Jetstream/ActionSection"
import Button from "@/Jetstream/Button";
import ConfirmationModal from '@/Jetstream/ConfirmationModal';
import DangerButton from '@/Jetstream/DangerButton';
import DialogModal from "@/Jetstream/DialogModal";
import FormSection from "@/Jetstream/FormSection";
import Input from "@/Jetstream/Input";
import InputError from "@/Jetstream/InputError";
import Label from "@/Jetstream/Label";
import SecondaryButton from '@/Jetstream/SecondaryButton';
import SectionBorder from '@/Jetstream/SectionBorder';

export default function ApiTokenManager(props) {
    const {tokens, availablePermissions, defaultPermissions} = props;

    const pageProps = usePage().props;

    const createApiTokenForm = useFormik({
        initialValues: {
            name: "",
            permissions: defaultPermissions
        },
        onSubmit: async (values, {setErrors, resetForm}) => {
            await Inertia.post(route('api-tokens.store'), values, {
                preserveScroll: false,
                onSuccess: (page) => {
                    const errors = page.props.errors["createApiToken"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    } else {
                        resetForm();
                        setDisplayingToken(true);
                    }
                }
            });
        }
    });

    const updateApiTokenForm = useFormik({
        initialValues: {
            permissions: []
        },
        onSubmit: async (values, {setErrors}) => {
            await Inertia.put(route('api-tokens.update', managingPermissionsFor), values, {
                preserveScroll: false,
                preserveState: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["updateApiToken"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    } else {
                        setManagingPermissionsFor(null);
                    }
                }
            });
        }
    });

    const deleteApiTokenForm = useFormik({
        initialValues: {},
        onSubmit: async () => {
            await Inertia.delete(route('api-tokens.destroy', apiTokenBeingDeleted), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    setApiTokenBeingDeleted(null);
                }
            });
        }
    });

    const [displayingToken, setDisplayingToken] = useState(false);

    const [managingPermissionsFor, setManagingPermissionsFor] = useState(null);
    const [apiTokenBeingDeleted, setApiTokenBeingDeleted] = useState(null);

    const manageApiTokenPermissions = (token) => {
        updateApiTokenForm.setValues({
            permissions: token.abilities
        });

        setManagingPermissionsFor(token);
    };

    const confirmApiTokenDeletion = (token) => {
        setApiTokenBeingDeleted(token);
    };

    return (
        <div>
            {/* Token Name */}
            <FormikProvider value={createApiTokenForm}>
                <FormSection
                    title="Create API Token"
                    description="API tokens allow third-party services to authenticate with our application on your behalf."
                    form={
                        <Fragment>
                            {/* Generate API Token */}
                            <div className="col-span-6 sm:col-span-4">
                                <Label htmlFor="name" value="Name" />
                                <Input id="name" type="text" name="name" className="mt-1 block w-full" autoFocus />
                                <InputError name="name" className="mt-2" />
                            </div>

                            {/* Token Permissions */}
                            {availablePermissions.length > 0 && (
                                <div className="col-span-6">
                                    <Label htmlFor="permissions" value="Permissions" />

                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {availablePermissions.map(permission => (
                                            <div key={permission}>
                                                <label className="flex items-center">
                                                    <Input type="checkbox" name="permissions" className="form-checkbox" value={permission} />
                                                    <span className="ml-2 text-sm text-gray-600">{permission}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    }
                    actions={
                        <Fragment>
                            <ActionMessage on={true} className="mr-3">
                                Created.
                            </ActionMessage>

                            <Button className={classNames({"opacity-25": createApiTokenForm.isSubmitting})} disabled={createApiTokenForm.isSubmitting}>Create</Button>
                        </Fragment>
                    }
                />
            </FormikProvider>

            {tokens.length > 0 && <div>
                <SectionBorder />

                <div className="mt-10 sm:mt-0">
                    <ActionSection
                        title="Manage API Tokens"
                        description="You may delete any of your existing tokens if they are no longer needed."
                        content={
                            <div className="space-y-6">
                                {tokens.map(token => (
                                    <div className="flex items-center justify-between" key={token.id}>
                                        <div>{ token.name }</div>

                                        <div className="flex items-center">
                                            {token.last_used_at && <div className="text-sm text-gray-400">
                                                Last used { moment(token.last_used_at).local().fromNow() }
                                            </div>}

                                            {availablePermissions.length > 0 && <button className="cursor-pointer ml-6 text-sm text-gray-400 underline focus:outline-none" onClick={() => manageApiTokenPermissions(token)}>
                                                Permissions
                                            </button>}

                                            <button className="cursor-pointer ml-6 text-sm text-red-500 focus:outline-none" onClick={() => confirmApiTokenDeletion(token)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    />
                </div>
            </div>}

            {/* Token Value Modal */}
            <DialogModal
                show={displayingToken}
                onClose={() => setDisplayingToken(false)}
                title="Delete API Token"
                content={
                    <Fragment>
                        <div>
                            Please copy your new API token. For your security, it won't be shown again.
                        </div>
                        {pageProps.jetstream.flash.token && (
                            <div className="mt-4 bg-gray-100 px-4 py-2 rounded font-mono text-sm text-gray-500">
                                {pageProps.jetstream.flash.token}
                            </div>
                        )}
                    </Fragment>
                }
                footer={
                    <SecondaryButton onClick={() => setDisplayingToken(false)}>
                        Close
                    </SecondaryButton>
                }
            />

            {/* API Token Permissions Modal */}
            <FormikProvider value={updateApiTokenForm}>
                <DialogModal
                    show={managingPermissionsFor}
                    onClose={() => setManagingPermissionsFor(null)}
                    title="API Token Permissions"
                    content={
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availablePermissions.map(permission => (
                                <div key={permission}>
                                    <label className="flex items-center">
                                        <Input type="checkbox" name="permissions" className="form-checkbox" value={permission} />
                                        <span className="ml-2 text-sm text-gray-600">{permission}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    }
                    footer={
                        <Fragment>
                            <SecondaryButton onClick={() => {setManagingPermissionsFor(null)}}>
                                Nevermind
                            </SecondaryButton>

                            <Button onClick={() => {updateApiTokenForm.submitForm()}} className={classNames("ml-2", {"opacity-25": updateApiTokenForm.isSubmitting})} disabled={updateApiTokenForm.isSubmitting}>
                                Save
                            </Button>
                        </Fragment>
                    }
                />
            </FormikProvider>

            {/* Delete Token Confirmation Modal */}
            <FormikProvider value={deleteApiTokenForm}>
                <ConfirmationModal
                    show={apiTokenBeingDeleted}
                    onClose={() => setApiTokenBeingDeleted(null)}
                    title="Delete API Token"
                    content="Are you sure you would like to delete this API token?"
                    footer={
                        <Fragment>
                            <SecondaryButton onClick={() => {setApiTokenBeingDeleted(null)}}>
                                Nevermind
                            </SecondaryButton>

                            <DangerButton onClick={() => {deleteApiTokenForm.submitForm()}} className={classNames("ml-2", {"opacity-25": deleteApiTokenForm.isSubmitting})} disabled={deleteApiTokenForm.isSubmitting}>
                                Delete
                            </DangerButton>
                        </Fragment>
                    }
                />
            </FormikProvider>
        </div>
    );
}
