import
    React,
    { useContext }         from 'react';

import
    * as Elements          from './Element';
import {
    filterValidProps
}                          from './Element';
import
    * as Controls          from './Control';
import
    * as border            from './borders';
import spacers             from './spacers';
import
    colors,
    * as color             from './colors';
import stipOuts            from './strip-outs';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';
import { pascalCase }      from 'pascal-case';



export interface Props {
    active?:   boolean
    enabled?:  boolean

    children?: React.ReactNode
};
export default function ListGroupItem(props: Props) {
    const stateEnbDis    = Controls.useStateEnabledDisabled(props);
    const stateActPass   = Controls.useStateActivePassive(props);



    return (
        <li className={[
                stateEnbDis.class ?? (stateEnbDis.disabled ? 'disabled' : null),
                stateActPass.class,
            ].join(' ')}
        
            onMouseDown={stateActPass.handleMouseDown}
            onMouseUp={stateActPass.handleMouseUp}
            onKeyDown={stateActPass.handleKeyDown}
            onKeyUp={stateActPass.handleKeyUp}
            onAnimationEnd={() => {
                stateEnbDis.handleAnimationEnd();
                stateActPass.handleAnimationEnd();
            }}
        >
            <div>
                {props.children}
            </div>
        </li>
    );
}