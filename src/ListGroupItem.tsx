import React               from 'react';

import {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
}                          from './Indicator';



export {
    stateEnabled, stateNotEnabled, stateDisabled, stateNotDisabled, stateEnabledDisabled, stateNotEnabledDisabled, stateNotEnablingDisabling,
    stateActive, stateNotActive, statePassive, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateNoAnimStartup,

    filterValidProps, filterPrefixProps,

    defineSizes, defineThemes,

    useStateEnabledDisabled, useStateActivePassive,
};



export interface Props {
    active?:   boolean
    enabled?:  boolean

    children?: React.ReactNode
};
export default function ListGroupItem(props: Props) {
    const stateEnbDis    = useStateEnabledDisabled(props);
    const stateActPass   = useStateActivePassive(props);



    return (
        <li className={[
                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateActPass.class,
            ].join(' ')}
        
            onAnimationEnd={(e) => {
                stateEnbDis.handleAnimationEnd(e);
                stateActPass.handleAnimationEnd(e);
            }}
        >
            <div className='lg-wrapper'>
                {props.children}
            </div>
        </li>
    );
}