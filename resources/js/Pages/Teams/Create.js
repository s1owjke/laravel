import React, {Fragment} from 'react';

import AppLayout from "@/Layouts/AppLayout";
import CreateTeamForm from "@/Pages/Teams/CreateTeamForm";

export default function Create(props) {
    const {team} = props;

    return (
        <AppLayout header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Create Team
            </h2>
        }>
            <div>
                <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                    <CreateTeamForm />
                </div>
            </div>
        </AppLayout>
    );
}