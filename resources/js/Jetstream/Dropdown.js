// todo
// <script>
//     export default {
//         created() {
//             const closeOnEscape = (e) => {
//                 if (this.open && e.keyCode === 27) {
//                     this.open = false
//                 }
//             }
//
//             this.$once('hook:destroyed', () => {
//                 document.removeEventListener('keydown', closeOnEscape)
//             })
//
//             document.addEventListener('keydown', closeOnEscape)
//         },
//     }
// </script>

import classNames from 'classnames';
import React, {useMemo, useState} from 'react'

export default function Dropdown(props) {
    const {align = "right", width = 48, contentClasses = 'py-1 bg-white', trigger, content} = props;

    const [isOpen, setIsOpen] = useState(false);

    const handleTriggerClick = () => {
        setIsOpen(value => !value);
    };

    const aligmentClasses = useMemo(() => {
        if (align === 'left') {
            return 'origin-top-left left-0'
        } else if (align === 'right') {
            return 'origin-top-right right-0'
        } else {
            return 'origin-top'
        }
    }, [align]);

    const widthClass = `w-${width}`;

    return (
        <div className="relative">
            <div onClick={handleTriggerClick}>{trigger}</div>

            <div style={isOpen ? {} : {display: 'none'}} className="fixed inset-0 z-40" onClick={handleTriggerClick}></div>

            {/*<transition enter-active-class="transition ease-out duration-200" enter-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">*/}
                <div style={isOpen ? {} : {display: 'none'}} className={classNames("absolute z-50 mt-2 rounded-md shadow-lg", widthClass, aligmentClasses)} onClick={handleTriggerClick}>
                    <div className={classNames("rounded-md shadow-xs", contentClasses)}>
                        {content}
                    </div>
                </div>
            {/*</transition>*/}
        </div>
    );
}