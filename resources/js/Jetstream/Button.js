import classNames from 'classnames';
import React from 'react'

export default function Button(props) {
    const {type = 'submit', className, children, ...rest} = props;

    return (
        <button type={type} className={classNames("inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150", className)} {...rest}>
            {children}
        </button>
    );
}