// <script>
//         created() {
//             const closeOnEscape = (e) => {
//                 if (e.key === 'Escape' && this.show) {
//                     this.close()
//                 }
//             }
//
//             document.addEventListener('keydown', closeOnEscape)
//
//             this.$once('hook:destroyed', () => {
//                 document.removeEventListener('keydown', closeOnEscape)
//             })
//         },
// </script>

import classNames from 'classnames';
import React, {useEffect, useMemo} from 'react'
import {createPortal} from "react-dom";
import {Fragment} from "react/cjs/react.development";

export default function Modal(props) {
    const {show = true, maxWidth = '2xl', closeable = true, onClose, children} = props;

    const handleClose = () => {
        if (closeable && onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = null
        }

        return () => {
            document.body.style.overflow = null
        }
    }, [show]);

    const maxWidthClass = useMemo(() => {
        return {
            'sm': 'sm:max-w-sm',
            'md': 'sm:max-w-md',
            'lg': 'sm:max-w-lg',
            'xl': 'sm:max-w-xl',
            '2xl': 'sm:max-w-2xl',
        }[maxWidth]
    }, [maxWidth]);

    // todo remove fragment
    return createPortal((
        <Fragment>
            {/*<transition leave-active-class="duration-200">*/}
                <div style={show ? {} : {display: 'none'}} className="fixed top-0 inset-x-0 px-4 pt-6 sm:px-0 sm:flex sm:items-top sm:justify-center">
                    {/*<transition enter-active-class="ease-out duration-300" enter-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-class="opacity-100" leave-to-class="opacity-0">*/}
                        <div style={show ? {} : {display: 'none'}} className="fixed inset-0 transform transition-all" onClick={handleClose}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                    {/*</transition>*/}

                    {/*<transition enter-active-class="ease-out duration-300" enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200" leave-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">*/}
                        <div style={show ? {} : {display: 'none'}} className={classNames("bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full", maxWidthClass)}>
                            {children}
                        </div>
                    {/*</transition>*/}
                </div>
            {/*</transition>*/}
        </Fragment>
    ), document.body);
}
