import classNames from "classnames";
import {useFormik, FormikProvider} from "formik";
import { Inertia } from '@inertiajs/inertia'
import React, {Fragment, useState} from 'react';

import ActionSection from "@/Jetstream/ActionSection";
import ConfirmationModal from "@/Jetstream/ConfirmationModal";
import DangerButton from "@/Jetstream/DangerButton";
import SecondaryButton from "@/Jetstream/SecondaryButton";

export default function DeleteTeamForm(props) {
    const {team} = props;

    const [confirmingTeamDeletion, setConfirmingTeamDeletion] = useState(false);

    const form = useFormik({
        initialValues: {},
        onSubmit: async (values, {setErrors}) => {
            await Inertia.delete(route('teams.destroy', team), {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["deleteTeam"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    }
                }
            });
        }
    });

    const confirmTeamDeletion = () => {
        setConfirmingTeamDeletion(true);
    };

    return (
        <ActionSection
            title="Delete Team"
            description="Permanently delete this team."
            content={
                <Fragment>
                    <div className="max-w-xl text-sm text-gray-600">
                        Once a team is deleted, all of its resources and data will be permanently deleted. Before deleting this team, please download any data or information regarding this team that you wish to retain.
                    </div>

                    <div className="mt-5">
                        <DangerButton onClick={confirmTeamDeletion}>
                            Delete Team
                        </DangerButton>
                    </div>

                    {/* Delete Account Confirmation Modal */}
                    <FormikProvider value={form}>
                        <ConfirmationModal
                            show={confirmingTeamDeletion}
                            onClose={() => {setConfirmingTeamDeletion(false)}}
                            title="Delete Account"
                            content="Are you sure you want to delete this team? Once a team is deleted, all of its resources and data will be permanently deleted."
                            footer={
                                <Fragment>
                                    <SecondaryButton onClick={() => {setConfirmingTeamDeletion(false)}}>
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
