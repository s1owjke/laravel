import classNames from 'classnames';
import React, {forwardRef} from "react";
import {useField} from "formik";

function Input(props, ref) {
    const {className, ...rest} = props;

    const [field] = useField(props);

    return <input ref={ref} {...field} className={classNames("form-input rounded-md shadow-sm", className)} {...rest} />;
}

export default forwardRef(Input);