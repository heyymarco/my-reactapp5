import React               from 'react';

import {
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
}                          from './Indicator';



export {
    stateEnable, stateNotEnable, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
};



export interface Props {
    active?:   boolean
    enabled?:  boolean

    children?: React.ReactNode
};
export default function ListGroupItem(props: Props) {
    const stateEnbDis    = useStateEnableDisable(props);
    const stateActPass   = useStateActivePassive(props);



    return (
        <li className={[
                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateActPass.class,
            ].join(' ')}
        >
            <div className='lg-wrapper'
                onAnimationEnd={(e) => {
                    stateEnbDis.handleAnimationEnd(e);
                    stateActPass.handleAnimationEnd(e);
                }}
            >
                {props.children}
            </div>
        </li>
    );
}