import classNames from 'classnames';
import React from 'react';
import {ErrorMessage} from "formik";

export default function InputError(props) {
    const {name, className, ...rest} = props;

    return (
        <ErrorMessage name={name} render={(message) => (
            <p className={classNames("text-sm text-red-600", className)} {...rest}>
                {message}
            </p>
        )} />
    );
}