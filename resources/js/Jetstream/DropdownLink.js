import React from 'react'
import { InertiaLink } from '@inertiajs/inertia-react';

export default function DropdownLink(props) {
    const {href, as, children} = props;

    if (as === 'button') {
        return (
            <button type="submit" className="block w-full px-4 py-2 text-sm leading-5 text-gray-700 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
                {children}
            </button>
        );
    } else {
        return (
            <div>
                <InertiaLink href={href} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
                    {children}
                </InertiaLink>
            </div>
        );
    }
}