import classNames from 'classnames';
import React from 'react'

export default function DangerButton(props) {
    const {type = 'button', className, children, ...rest} = props;

    return (
        <button type={type} className={classNames("inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-600 transition ease-in-out duration-150", className)} {...rest}>
            {children}
        </button>
    );
}