import React from 'react'

import AppLayout from "@/Layouts/AppLayout";
import ApiTokenManager from '@/Pages/API/ApiTokenManager';

export default function Index(props) {
    const {tokens, availablePermissions, defaultPermissions} = props;

    return (
        <AppLayout header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                API Tokens
            </h2>
        }>
            <div>
                <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                    <ApiTokenManager tokens={tokens} availablePermissions={availablePermissions} defaultPermissions={defaultPermissions} />
                </div>
            </div>
        </AppLayout>
    );
}