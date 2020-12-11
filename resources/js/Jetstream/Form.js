import React from "react";
import { useFormikContext } from "formik";

export default function Form(props) {
    const { action, ...rest } = props;
    const { handleReset, handleSubmit } = useFormikContext();
    return (
        <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            action={action || "#"}
            {...rest}
        />
    );
}
