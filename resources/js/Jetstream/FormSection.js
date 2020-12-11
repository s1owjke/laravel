import React from 'react';
import Form from "./Form";
import SectionTitle from "./SectionTitle";

export default function FormSection(props) {
    const {title, description, form, actions} = props;

    return (
        <div className="md:grid md:grid-cols-3 md:gap-6">
            <SectionTitle title={title} description={description} />

            <div className="mt-5 md:mt-0 md:col-span-2">
                <Form>
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="grid grid-cols-6 gap-6">
                                {form}
                            </div>
                        </div>

                        {actions && <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right sm:px-6">
                            {actions}
                        </div>}
                    </div>
                </Form>
            </div>
        </div>
    );
}