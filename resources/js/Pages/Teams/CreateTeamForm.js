import classNames from 'classnames';
import { useFormik, FormikProvider } from "formik";
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import React, {Fragment} from 'react';

import ActionMessage from "@/Jetstream/ActionMessage";
import Button from "@/Jetstream/Button";
import FormSection from "@/Jetstream/FormSection";
import Input from "@/Jetstream/Input";
import InputError from "@/Jetstream/InputError";
import Label from "@/Jetstream/Label";

export default function CreateTeamForm(props) {
    const pageProps = usePage().props;

    const form = useFormik({
        initialValues: {
            name: "",
        },
        onSubmit: async (values, {setErrors, resetForm}) => {
            await Inertia.post(route('teams.store'), values, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["createTeam"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    }
                }
            });
        }
    });

    return (
        <FormikProvider value={form}>
            <FormSection
                title="Team Details"
                description="Create a new team to collaborate with others on projects."
                form={
                    <Fragment>
                        <div className="col-span-6">
                            <Label value="Team Owner" />

                            <div className="flex items-center mt-2">
                                <img className="w-12 h-12 rounded-full object-cover" src={pageProps.user.profile_photo_url} alt={pageProps.user.name} />

                                <div className="ml-4 leading-tight">
                                    <div>{pageProps.user.name}</div>
                                    <div className="text-gray-700 text-sm">{pageProps.user.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <Label htmlFor="name" value="Team Name"/>
                            <Input id="name" type="text" name="name" className="mt-1 block w-full" autoFocus />
                            <InputError name="name" className="mt-2" />
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
