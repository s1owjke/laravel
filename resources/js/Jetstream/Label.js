import classNames from 'classnames';
import React from 'react'

export default function Label(props) {
    const {className, value, children, ...rest} = props;

    return (
        <label className={classNames("block font-medium text-sm text-gray-700", className)} {...rest}>
            {value ? value : children}
        </label>
    );
}