import React from 'react'
import Modal from "./Modal";

export default function DialogModal(props) {
    const {show = false, maxWidth = '2xl', closeable = true, onClose, title, content, footer} = props;

    return (
        <Modal show={show} maxWidth={maxWidth} closeable={closeable} onClose={onClose}>
            <div className="px-6 py-4">
                <div className="text-lg">
                    {title}
                </div>

                <div className="mt-4">
                    {content}
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-100 text-right">
                {footer}
            </div>
        </Modal>
    );
}