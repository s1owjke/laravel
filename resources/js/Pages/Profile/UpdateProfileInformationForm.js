import classNames from 'classnames';
import {FormikProvider, useFormik} from "formik";
import {Inertia} from '@inertiajs/inertia'
import {usePage} from '@inertiajs/inertia-react';
import React, {Fragment, useRef, useState} from 'react';
import {objectToFormData} from "@/utils";

import ActionMessage from "@/Jetstream/ActionMessage";
import Button from "@/Jetstream/Button";
import FormSection from "@/Jetstream/FormSection";
import Input from "@/Jetstream/Input";
import InputError from "@/Jetstream/InputError";
import Label from "@/Jetstream/Label";
import SecondaryButton from "@/Jetstream/SecondaryButton";

export default function UpdateProfileInformationForm(props) {
    const {user} = props;

    const pageProps = usePage().props;

    const form = useFormik({
        initialValues: {
            '_method': 'PUT',
            name: user.name,
            email: user.email,
            photo: null,
        },
        onSubmit: async (values, {setErrors, resetForm}) => {
            if (photoInput.current) {
                values.photo = photoInput.current.files[0];
            }

            await Inertia.post(route('user-profile-information.update'), objectToFormData(values), {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props.errors["updateProfileInformation"];
                    if (errors && Object.keys(errors).length > 0) {
                        setErrors(errors);
                    }
                }
            });
        }
    });

    const photoInput = useRef(null);

    const [photoPreview, setPhotoPreview] = useState(null);

    const selectNewPhoto = () => {
        photoInput.current.click();
    };

    const updatePhotoPreview = () => {
        const reader = new FileReader();

        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };

        reader.readAsDataURL(photoInput.current.files[0]);
    };

    const deletePhoto = () => {
        Inertia.delete(route('current-user-photo.destroy'), {
            preserveScroll: true,
            onSuccess: (page) => {
                setPhotoPreview(null);
            }
        });
    };

    return (
        <FormikProvider value={form}>
            <FormSection
                title="Profile Information"
                description="Update your account's profile information and email address."
                form={
                    <Fragment>
                        {/* Profile Photo */}
                        {pageProps.jetstream.managesProfilePhotos && (
                            <div className="col-span-6 sm:col-span-4">
                                {/* Profile Photo File Input */}
                                <input type="file" ref={photoInput} onChange={updatePhotoPreview} className="hidden" />

                                <Label htmlFor="photo" value="Photo" />

                                {/* Current Profile Photo */}
                                {!photoPreview && (
                                    <div className="mt-2">
                                        <img src={user.profile_photo_url} alt="Current Profile Photo" className="rounded-full h-20 w-20 object-cover" />
                                    </div>
                                )}

                                {/* New Profile Photo Preview */}
                                {photoPreview && (
                                    <div className="mt-2">
                                        <span className="block rounded-full w-20 h-20" style={{backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center",  backgroundImage: `url('${photoPreview}')`}}>
                                        </span>
                                    </div>
                                )}

                                <SecondaryButton className="mt-2 mr-2" onClick={selectNewPhoto}>
                                    Select A New Photo
                                </SecondaryButton>

                                {user.profile_photo_path && (
                                    <SecondaryButton className="mt-2" onClick={deletePhoto}>
                                        Remove Photo
                                    </SecondaryButton>
                                )}

                                <InputError name="photo" className="mt-2" />
                            </div>
                        )}

                        {/* Name */}
                        <div className="col-span-6 sm:col-span-4">
                            <Label htmlFor="name" value="Name" />
                            <Input id="name" type="text" name="name" className="mt-1 block w-full" />
                            <InputError name="name" className="mt-2" />
                        </div>

                        {/* Email */}
                        <div className="col-span-6 sm:col-span-4">
                            <Label htmlFor="email" value="Email" />
                            <Input id="email" type="text" name="email" className="mt-1 block w-full" />
                            <InputError name="email" className="mt-2" />
                        </div>
                    </Fragment>
                }
                actions={
                    <Fragment>
                        <ActionMessage on={true} className="mr-3">
                            Saved.
                        </ActionMessage>

                        <Button className={classNames({"opacity-25": form.isSubmitting})} disabled={form.isSubmitting}>Save</Button>
                    </Fragment>
                }
            />
        </FormikProvider>
    );
}
