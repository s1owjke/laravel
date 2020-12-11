import classNames from "classnames";
import {useFormik, FormikProvider} from "formik";
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import React, {Fragment, useState} from 'react';

import ActionMessage from "@/Jetstream/ActionMessage";
import ActionSection from "@/Jetstream/ActionSection";
import Button from "@/Jetstream/Button";
import ConfirmationModal from "@/Jetstream/ConfirmationModal";
import DangerButton from "@/Jetstream/DangerButton";
import DialogModal from "@/Jetstream/DialogModal";
import FormSection from "@/Jetstream/FormSection";
import Input from "@/Jetstream/Input";
import InputError from "@/Jetstream/InputError";
import Label from "@/Jetstream/Label";
import SecondaryButton from "@/Jetstream/SecondaryButton";
import SectionBorder from "@/Jetstream/SectionBorder";

export default function TeamMemberManager(props) {
    const {team, availableRoles, userPermissions} = props;

    const pageProps = usePage().props;

    const addTeamMemberForm = useFormik({
        initialValues: {
            email: '',
            role: null,
        },
        onSubmit: async (values, {setErrors, resetForm}) => {
            await Inertia.post(route('team-members.store', team), values, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["addTeamMember"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    } else {
                        resetForm();
                    }
                }
            });
        }
    });

    const updateRoleForm = useFormik({
        initialValues: {
            role: null,
        },
        onSubmit: async (values, {setErrors, resetForm}) => {
            await Inertia.put(route('team-members.update', [team, managingRoleFor]), values, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["updateRole"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    }
                }
            });
        }
    });




    const leaveTeamForm = useFormik({
        initialValues: {},
        onSubmit: async (values, {setErrors}) => {
            await Inertia.delete(route('team-members.destroy', [team, pageProps.user]), {
                onSuccess: (page) => {
                    const errors = page.props.errors["leaveTeam"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    }
                }
            });
        }
    });

    const removeTeamMemberForm = useFormik({
        initialValues: {},
        onSubmit: async (values, {setErrors}) => {
            await Inertia.delete(route('team-members.destroy', [team, teamMemberBeingRemoved]), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["removeTeamMember"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    } else {
                        setTeamMemberBeingRemoved(null);
                    }
                }
            });
        }
    });

    const [currentlyManagingRole, setCurrentlyManagingRole] = useState(false);
    const [managingRoleFor, setManagingRoleFor] = useState(null);
    const [confirmingLeavingTeam, setConfirmingLeavingTeam] = useState(false);
    const [teamMemberBeingRemoved, setTeamMemberBeingRemoved] = useState(null);

    const manageRole = (teamMember) => {
        setManagingRoleFor(teamMember);
        updateRoleForm.setFieldValue("role", teamMember.membership.role);
        setCurrentlyManagingRole(true);
    };

    const confirmTeamMemberRemoval = (teamMember) => {
        setTeamMemberBeingRemoved(teamMember);
    };

    const confirmLeavingTeam = () => {
        setConfirmingLeavingTeam(true);
    };

    const displayableRole = (role) => {
        return availableRoles.find(r => r.key === role).name;
    };

    return (
        <div>
            {userPermissions.canAddTeamMembers && (
                <div>
                    <SectionBorder />

                    {/* Add Team Member */}
                    <FormikProvider value={addTeamMemberForm}>
                        <FormSection
                            title="Add Team Member"
                            description="Add a new team member to your team, allowing them to collaborate with you."
                            form={
                                <Fragment>
                                    <div className="col-span-6">
                                        <div className="max-w-xl text-sm text-gray-600">
                                            Please provide the email address of the person you would like to add to this team. The email address must be associated with an existing account.
                                        </div>
                                    </div>

                                    {/* Member Email */}
                                    <div className="col-span-6 sm:col-span-4">
                                        <Label htmlFor="email" value="Email" />
                                        <Input id="email" type="text" name="email" className="mt-1 block w-full" />
                                        <InputError name="email" className="mt-2" />
                                    </div>

                                    {/* Role */}
                                    {availableRoles.length > 0 && (
                                        <div className="col-span-6 lg:col-span-4">
                                            <Label value="Role" />
                                            <InputError name="role" className="mt-2" />

                                            <div className="mt-1 border border-gray-200 rounded-lg cursor-pointer">
                                                {availableRoles.map((role, index) => (
                                                    <div className={classNames("px-4 py-3", {'border-t border-gray-200': index > 0})} onClick={() => addTeamMemberForm.setFieldValue("role", role.key)} key={role.key} >
                                                         <div className={classNames({'opacity-50': addTeamMemberForm.values.role && addTeamMemberForm.values.role != role.key})}>
                                                            {/* Role Name */}
                                                            <div className="flex items-center">
                                                                <div className={classNames("text-sm text-gray-600", {'font-semibold': addTeamMemberForm.values.role == role.key})}>
                                                                    {role.name}
                                                                </div>

                                                                {addTeamMemberForm.values.role == role.key && (
                                                                    <svg className="ml-2 h-5 w-5 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                )}
                                                            </div>

                                                            {/* Role Description */}
                                                             <div className="mt-2 text-xs text-gray-600">
                                                                 {role.description}
                                                             </div>
                                                         </div>
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
                                        Added.
                                    </ActionMessage>

                                    <Button className={classNames({"opacity-25": addTeamMemberForm.isSubmitting})} disabled={addTeamMemberForm.isSubmitting}>Add</Button>
                                </Fragment>
                            }
                        />
                    </FormikProvider>
                </div>
            )}

            {team.users.length > 0 && (
                <Fragment>
                    <SectionBorder />

                    {/* Manage Team Members */}
                    <ActionSection
                        className="mt-10 sm:mt-0"
                        title="Team Members"
                        description="All of the people that are part of this team."
                        content={
                            <div className="space-y-6">
                                {team.users.map((user) => (
                                    <div className="flex items-center justify-between" key={user.id}>
                                        <div className="flex items-center">
                                            <img className="w-8 h-8 rounded-full" src={user.profile_photo_url} alt={user.name} />
                                            <div className="ml-4">{user.name}</div>
                                        </div>

                                        <div className="flex items-center">
                                            {/* Manage Team Member Role */}
                                            {availableRoles.length && (
                                                <Fragment>
                                                    {userPermissions.canAddTeamMembers && (
                                                        <button className="ml-2 text-sm text-gray-400 underline" onClick={() => manageRole(user)}>
                                                            {displayableRole(user.membership.role)}
                                                        </button>
                                                    )}

                                                    {!userPermissions.canAddTeamMembers && (
                                                        <div className="ml-2 text-sm text-gray-400">
                                                            {displayableRole(user.membership.role)}
                                                        </div>
                                                    )}
                                                </Fragment>
                                            )}

                                            {/* Leave Team */}
                                            {pageProps.user.id === user.id && (
                                                <button className="cursor-pointer ml-6 text-sm text-red-500 focus:outline-none" onClick={() => confirmLeavingTeam(user)}>
                                                    Leave
                                                </button>
                                            )}

                                            {/* Remove Team Member */}
                                            {userPermissions.canRemoveTeamMembers && (
                                                <button className="cursor-pointer ml-6 text-sm text-red-500 focus:outline-none" onClick={() => confirmTeamMemberRemoval(user)}>
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    />
                </Fragment>
            )}

            {/* Role Management Modal */}
            <DialogModal
                show={currentlyManagingRole}
                onClose={() => setCurrentlyManagingRole(false)}
                title="Manage Role"
                content={managingRoleFor && (
                    <div>
                        <div className="mt-1 border border-gray-200 rounded-lg cursor-pointer">
                            {availableRoles.map((role, index) => (
                                <div className={classNames("px-4 py-3", {'border-t border-gray-200': index > 0})} onClick={() => updateRoleForm.setFieldValue("role", role.key)} key={role.key} >
                                    <div className={classNames({'opacity-50': updateRoleForm.values.role && updateRoleForm.values.role != role.key})}>
                                        {/* Role Name */}
                                        <div className="flex items-center">
                                            <div className={classNames("text-sm text-gray-600", {'font-semibold': updateRoleForm.values.role == role.key})}>
                                                {role.name}
                                            </div>

                                            {updateRoleForm.values.role == role.key && (
                                                <svg className="ml-2 h-5 w-5 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            )}
                                        </div>

                                        {/* Role Description */}
                                        <div className="mt-2 text-xs text-gray-600">
                                            {role.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                footer={
                    <Fragment>
                        <SecondaryButton onClick={() => {setCurrentlyManagingRole(false)}}>
                            Nevermind
                        </SecondaryButton>

                        <Button onClick={() => {updateRoleForm.submitForm()}} className={classNames("ml-2", {"opacity-25": updateRoleForm.isSubmitting})} disabled={updateRoleForm.isSubmitting}>
                            Save
                        </Button>
                    </Fragment>
                }
            />

            {/* Leave Team Confirmation Modal */}
            <FormikProvider value={leaveTeamForm}>
                <ConfirmationModal
                    show={confirmingLeavingTeam}
                    onClose={() => {setConfirmingLeavingTeam(false)}}
                    title="Leave Team"
                    content="Are you sure you would like to leave this team?"
                    footer={
                        <Fragment>
                            <SecondaryButton onClick={() => {setConfirmingLeavingTeam(false)}}>
                                Nevermind
                            </SecondaryButton>

                            <DangerButton onClick={() => {leaveTeamForm.submitForm()}} className={classNames("ml-2", {"opacity-25": leaveTeamForm.isSubmitting})} disabled={leaveTeamForm.isSubmitting}>
                                Leave
                            </DangerButton>
                        </Fragment>
                    }
                />
            </FormikProvider>

            {/* Remove Team Member Confirmation Modal */}
            <FormikProvider value={removeTeamMemberForm}>
                <ConfirmationModal
                    show={teamMemberBeingRemoved}
                    onClose={() => {setTeamMemberBeingRemoved(null)}}
                    title="Remove Team Member"
                    content="Are you sure you would like to remove this person from the team?"
                    footer={
                        <Fragment>
                            <SecondaryButton onClick={() => {setTeamMemberBeingRemoved(null)}}>
                                Nevermind
                            </SecondaryButton>

                            <DangerButton onClick={() => {removeTeamMemberForm.submitForm()}} className={classNames("ml-2", {"opacity-25": removeTeamMemberForm.isSubmitting})} disabled={removeTeamMemberForm.isSubmitting}>
                                Remove
                            </DangerButton>
                        </Fragment>
                    }
                />
            </FormikProvider>
        </div>
    );
}
