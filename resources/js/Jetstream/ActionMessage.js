import classNames from 'classnames';
import React from 'react'

export default function ActionMessage(props) {
    const {className, on, children} = props;

    return (
        <div>
            {/*<transition leave-active-class="transition ease-in duration-1000" leave-class="opacity-100" leave-to-class="opacity-0">*/}
                {<div className={classNames("text-sm text-gray-600", className)} style={on ? {} : {display: 'none'}}>
                    {children}
                </div>}
            {/*</transition>*/}
        </div>
    );
}
