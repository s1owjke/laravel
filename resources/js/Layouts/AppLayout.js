import axios from "axios";
import classNames from 'classnames';
import { Inertia } from '@inertiajs/inertia'
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import React, {Fragment, useState, useMemo} from 'react';

import ApplicationMark from "@/Jetstream/ApplicationMark";
import Dropdown from "@/Jetstream/Dropdown";
import DropdownLink from "@/Jetstream/DropdownLink";
import NavLink from "@/Jetstream/NavLink";
import ResponsiveNavLink from "@/Jetstream/ResponsiveNavLink";

export default function AppLayout(props) {
    const {header, children} = props;

    const pageProps = usePage().props;

    const [showingNavigationDropdown, setShowNavigationDropdown] = useState(false);

    const handleSwitchToTeam = (team) => (event) => {
        event.preventDefault();

        const values = {
            'team_id': team.id
        };

        Inertia.put(route('current-team.update'), values, {
            preserveState: false
        });
    };

    const handleLogout = (event) => {
        event.preventDefault();

        axios.post(route('logout').url()).then(response => {
            window.location = '/';
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                {/* Primary Navigation Menu */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <InertiaLink href={route("dashboard")}>
                                    <ApplicationMark />
                                </InertiaLink>
                            </div>
    
                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route("dashboard")} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        {/* Settings Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown
                                    align="right"
                                    width="48"
                                    trigger={
                                        <Fragment>
                                            {pageProps.jetstream.managesProfilePhotos && <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out">
                                                <img className="h-8 w-8 rounded-full object-cover" src={pageProps.user.profile_photo_url} alt={pageProps.user.name} />
                                            </button>}

                                            {!pageProps.jetstream.managesProfilePhotos && <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
                                                <div>{ pageProps.user.name }</div>

                                                <div className="ml-1">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </button>}
                                        </Fragment>
                                    }
                                    content={
                                        <Fragment>
                                            {/* Account Management */}
                                            <div className="block px-4 py-2 text-xs text-gray-400">
                                                Manage Account
                                            </div>

                                            <DropdownLink href={route('profile.show')}>
                                                Profile
                                            </DropdownLink>

                                            {pageProps.jetstream.hasApiFeatures && <DropdownLink href={route('api-tokens.index')}>
                                                API Tokens
                                            </DropdownLink>}

                                            <div className="border-t border-gray-100"></div>

                                            {/* Team Management */}
                                            {pageProps.jetstream.hasTeamFeatures && <Fragment>
                                                <div className="block px-4 py-2 text-xs text-gray-400">
                                                    Manage Team
                                                </div>

                                                {/* Team Settings */}
                                                <DropdownLink href={route('teams.show', pageProps.user.current_team)}>
                                                    Team Settings
                                                </DropdownLink>

                                                {pageProps.jetstream.canCreateTeams && <DropdownLink href={route('teams.create')}>
                                                    Create New Team
                                                </DropdownLink>}

                                                <div className="border-t border-gray-100"></div>

                                                {/* Team Switcher */}
                                                <div className="block px-4 py-2 text-xs text-gray-400">
                                                    Switch Teams
                                                </div>

                                                {pageProps.user.all_teams.map(team => (
                                                    <form onSubmit={handleSwitchToTeam(team)} key={team.id}>
                                                        <DropdownLink as="button">
                                                            <div className="flex items-center">
                                                                {team.id === pageProps.user.current_team_id && <svg className="mr-2 h-5 w-5 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                                                                <div>{ team.name }</div>
                                                            </div>
                                                        </DropdownLink>
                                                    </form>
                                                ))}

                                                <div className="border-t border-gray-100"></div>
                                            </Fragment>}

                                            {/* Authentication */}
                                            <form method="POST" onSubmit={handleLogout}>
                                                <DropdownLink as="button">
                                                    Logout
                                                </DropdownLink>
                                            </form>
                                        </Fragment>
                                    }
                                />
                            </div>
                        </div>

                        {/* Hamburger */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button onClick={() => setShowNavigationDropdown(state => !state)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={classNames({'hidden': showingNavigationDropdown, 'inline-flex': !showingNavigationDropdown})} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={classNames({'hidden': !showingNavigationDropdown, 'inline-flex': showingNavigationDropdown})} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Responsive Navigation Menu */}
                <div className={classNames({'block': showingNavigationDropdown, 'hidden': !showingNavigationDropdown}, 'sm:hidden')}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route("dashboard")} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src={pageProps.user.profile_photo_url} alt={pageProps.user.name} />
                            </div>

                            <div className="ml-3">
                                <div className="font-medium text-base text-gray-800">{ pageProps.user.name }</div>
                                <div className="font-medium text-sm text-gray-500">{ pageProps.user.email }</div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.show")} active={route().current('profile.show')}>
                                Profile
                            </ResponsiveNavLink>

                            {pageProps.jetstream.hasApiFeatures && <ResponsiveNavLink href={route("api-tokens.index")} active={route().current('api-tokens.index')}>
                                API Tokens
                            </ResponsiveNavLink>}

                            {/* Authentication */}
                            <form method="POST" onSubmit={handleLogout}>
                                <ResponsiveNavLink as="button">
                                    Logout
                                </ResponsiveNavLink>
                            </form>

                            {/* Team Management */}
                            {pageProps.jetstream.hasTeamFeatures && <Fragment>
                                <div className="border-t border-gray-200"></div>

                                <div className="block px-4 py-2 text-xs text-gray-400">
                                    Manage Team
                                </div>

                                {/* Team Settings */}
                                <ResponsiveNavLink href={route('teams.show', pageProps.user.current_team)} active={route().current('teams.show')}>
                                    Team Settings
                                </ResponsiveNavLink>

                                <ResponsiveNavLink href={route("teams.create")} active={route().current('teams.create')}>
                                    Create New Team
                                </ResponsiveNavLink>

                                <div className="border-t border-gray-200"></div>

                                {/* Team Switcher */}
                                <div className="block px-4 py-2 text-xsf text-gray-400">
                                    Switch Teams
                                </div>

                                {pageProps.user.all_teams.map(team => (
                                    <form onSubmit={handleSwitchToTeam(team)} key={team.id}>
                                        <ResponsiveNavLink as="button">
                                            <div className="flex items-center">
                                                {team.id === pageProps.user.current_team_id && <svg className="mr-2 h-5 w-5 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                                                <div>{ team.name }</div>
                                            </div>
                                        </ResponsiveNavLink>
                                    </form>
                                ))}
                            </Fragment>}
                        </div>
                    </div>
                </div>
            </nav>
                
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {header}
                </div>
            </header>

            <main>
                {children}
            </main>
        </div>
    );
}