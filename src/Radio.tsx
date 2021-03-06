import type * as Css       from './Css';

import * as Checks         from './Check';
import {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeaving, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlurring, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateValidating, stateValid, stateNotValid, stateUnvalidating, stateNotUnvalid, stateValidUnvalid, stateNotValidUnvalid, stateNotValidatingUnvalidating,
    stateInvalidating, stateInvalid, stateNotInvalid, stateUninvalidating, stateNotUninvalid, stateInvalidUninvalid, stateNotInvalidUninvalid, stateNotInvalidatingUninvalidating,
    stateValidationDisabled, stateValidationEnabled,
    applyStateNoAnimStartup, applyStateActive, applyStateValid, applyStateInvalid,

    filterValidProps, filterPrefixProps,

    defineThemes, defineSizes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
    useNativeValidator, useStateValidInvalid,
}                          from './Check';
import * as border         from './borders';

import { createUseStyles } from 'react-jss';
import JssVarCollection    from './jss-var-collection';



export {
    escapeSvg,
    getVar,
    
    stateEnable, stateNotEnable, stateDisabling, stateDisable, stateNotDisable, stateEnableDisable, stateNotEnableDisable, stateNotEnablingDisabling,
    stateActivating, stateActive, stateNotActive, statePassivating, stateNotPassive, stateActivePassive, stateNotActivePassive, stateNotActivatingPassivating,
    stateHover, stateNotHover, stateLeaving, stateNotLeave, stateHoverLeave, stateNotHoverLeave,
    stateFocus, stateNotFocus, stateBlurring, stateNotBlur, stateFocusBlur, stateNotFocusBlur,
    stateValidating, stateValid, stateNotValid, stateUnvalidating, stateNotUnvalid, stateValidUnvalid, stateNotValidUnvalid, stateNotValidatingUnvalidating,
    stateInvalidating, stateInvalid, stateNotInvalid, stateUninvalidating, stateNotUninvalid, stateInvalidUninvalid, stateNotInvalidUninvalid, stateNotInvalidatingUninvalidating,
    stateValidationDisabled, stateValidationEnabled,
    applyStateNoAnimStartup, applyStateActive, applyStateValid, applyStateInvalid,

    filterValidProps, filterPrefixProps,

    defineThemes, defineSizes,

    useStateEnableDisable, useStateActivePassive,
    useStateLeave, useStateFocusBlur,
    useNativeValidator, useStateValidInvalid,
};



export interface CssProps {
    img          : Css.Image

    borderRadius : Css.BorderRadius
}
// const unset   = 'unset';
// const none    = 'none';
// const inherit = 'inherit';
// const center  = 'center';

// internal css vars:
export const vars = Checks.vars;

// define default cssProps' value to be stored into css vars:
const _cssProps: CssProps = {
    // forked from Bootstrap 5:
    img          : `url("data:image/svg+xml,${escapeSvg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='2' fill='#000'/></svg>")}")`,

    borderRadius : border.radiuses.circle,
};



// convert _cssProps => varProps => cssProps:
const collection = new JssVarCollection(
    /*cssProps :*/ _cssProps as { [index: string]: any },
    /*config   :*/ { varPrefix: 'rad'}
);
const config   = collection.config;
const cssProps = collection.varProps as typeof _cssProps;
// export the configurable varPops:
export { config, cssProps };
// export default cssProps;



export const themes = Checks.themes; // copy Check's themes
export const sizes  = Checks.sizes;  // copy Check's sizes


export const fnVars = Checks.fnVars; // copy Check's fnVars
export const states = Checks.states; // copy Check's states


const chkStyles = {
    extend: [
        filterValidProps(cssProps), // apply our filtered cssProps
    ],

    img : undefined as unknown as null, // delete



    '&::before': { // the main "icon" element:
        [vars.img]: cssProps.img,
    },
};
export const basicStyle = {
    // the main "checkbox" element:
    '& >:first-child': chkStyles,
};
export const styles = {
    main: {
        extend: [
            basicStyle, // apply our basicStyle

            // themes:
            // themes,  // no changes
            // sizes,   // no changes
            
            // states:
            // states,  // no changes
        ],
    },
};
export const useStyles = createUseStyles(styles);



export interface Props
    extends
        Checks.Props
{
}
export default function Radio(props: Props) {
    const styles = useStyles();
    return Checks.CheckBase(styles.main, props, 'radio');
}