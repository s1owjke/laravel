import classNames from 'classnames';
import { useFormik, FormikProvider } from "formik";
import { Inertia } from '@inertiajs/inertia';
import React, {Fragment} from 'react';

import ActionMessage from "@/Jetstream/ActionMessage";
import Button from "@/Jetstream/Button";
import FormSection from "@/Jetstream/FormSection";
import Input from "@/Jetstream/Input";
import InputError from "@/Jetstream/InputError";
import Label from "@/Jetstream/Label";

export default function UpdateTeamNameForm(props) {
    const {team, permissions} = props;

    const form = useFormik({
        initialValues: {
            name: team.name,
        },
        onSubmit: async (values, {setErrors, resetForm}) => {
            await Inertia.put(route('teams.update'), values, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["updateTeamName"];
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
                title="Team Name"
                description="The team's name and owner information."
                form={
                    <Fragment>
                        <div className="col-span-6">
                            <Label value="Team Owner" />

                            <div className="flex items-center mt-2">
                                <img className="w-12 h-12 rounded-full object-cover" src={team.owner.profile_photo_url} alt={team.owner.name} />

                                <div className="ml-4 leading-tight">
                                    <div>{team.owner.name}</div>
                                    <div className="text-gray-700 text-sm">{team.owner.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <Label htmlFor="name" value="Team Name" />
                            <Input id="name" type="text" name="name" className="mt-1 block w-full" disabled={!permissions.canUpdateTeam} />
                            <InputError name="name" className="mt-2" />
                        </div>
                    </Fragment>
                }
                actions={permissions.canUpdateTeam && (
                    <Fragment>
                        <ActionMessage on={true} className="mr-3">
                            Saved.
                        </ActionMessage>

                        <Button className={classNames({"opacity-25": form.isSubmitting})} disabled={form.isSubmitting}>Save</Button>
                    </Fragment>
                )}
            />
        </FormikProvider>
    );
}
