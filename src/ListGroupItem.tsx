import React               from 'react';

import {
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    applyStateNoAnimStartup, applyStateDefault,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
}                          from './Indicator';



export {
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    applyStateNoAnimStartup, applyStateDefault,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnableDisable, useStateActivePassive,
};



export interface Props {
    // accessibility:
    enabled?:  boolean
    active?:   boolean

    children?: React.ReactNode
};
export default function ListGroupItem(props: Props) {
    const stateEnbDis    = useStateEnableDisable(props);
    const stateActPass   = useStateActivePassive(props, stateEnbDis);



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