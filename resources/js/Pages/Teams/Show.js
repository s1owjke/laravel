import React, {Fragment} from 'react';

import AppLayout from "@/Layouts/AppLayout";
import SectionBorder from "@/Jetstream/SectionBorder";
import UpdateTeamNameForm from "@/Pages/Teams/UpdateTeamNameForm";
import TeamMemberManager from "@/Pages/Teams/TeamMemberManager";
import DeleteTeamForm from "@/Pages/Teams/DeleteTeamForm";

export default function Show(props) {
    const {team, availableRoles, permissions} = props;

    return (
        <AppLayout header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Team Settings
            </h2>
        }>
            <div>
                <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                    <UpdateTeamNameForm team={team} permissions={permissions} />

                    <TeamMemberManager className="mt-10 sm:mt-0" team={team} availableRoles={availableRoles} userPermissions={permissions}/>

                    {permissions.canDeleteTeam && !team.personal_team && (
                        <Fragment>
                            <SectionBorder />
                            <DeleteTeamForm team={team} className="mt-10 sm:mt-0"/>
                        </Fragment>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
